-- =============================================
-- SWP Finance - Supabase Schema (Advanced)
-- Ejecutar en: Supabase > SQL Editor > New query
-- =============================================

-- Socios (perfil derivado de auth.users)
create table if not exists public.socios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombres text not null default '',
  apellidos text not null default '',
  documento text unique,
  telefono text,
  saldo decimal(14,2) not null default 0,
  activo boolean not null default true,
  rol text not null default 'socio' check (rol in ('socio', 'admin')),
  creado_en timestamptz not null default now()
);

comment on table public.socios is 'Socios del negocio SWP';

-- Transacciones (movimientos entre socios o pagos)
create table if not exists public.transacciones (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.socios(id) on delete cascade,
  tipo text not null check (tipo in ('ingreso', 'egreso', 'transferencia')),
  monto decimal(14,2) not null check (monto >= 0),
  concepto text,
  contraparte text,
  metodo text default 'efectivo' check (metodo in ('efectivo', 'yape', 'plin', 'tarjeta', 'transferencia', 'pagoefectivo')),
  estado text not null default 'completado' check (estado in ('pendiente', 'completado', 'rechazado', 'reembolsado')),
  creado_en timestamptz not null default now()
);

comment on table public.transacciones is 'Historial de transacciones/pagos por socio';

create index if not exists idx_transacciones_socio on public.transacciones(socio_id, creado_en desc);
create index if not exists idx_transacciones_estado on public.transacciones(estado);
create index if not exists idx_transacciones_tipo on public.transacciones(tipo);

-- =============================================
-- Row Level Security
-- =============================================
alter table public.socios enable row level security;
alter table public.transacciones enable row level security;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from public.socios where id = auth.uid() limit 1;
$$;

-- Socios: un socio ve solo su propio perfil; los admins ven todos
drop policy if exists "socios_select_own" on public.socios;
create policy "socios_select_own" on public.socios
  for select using (
    public.current_user_role() = 'admin'
    or id = auth.uid()
  );

drop policy if exists "socios_update_own" on public.socios;
create policy "socios_update_own" on public.socios
  for update using (id = auth.uid());

-- Transacciones: un socio ve solo las suyas; los admins ven todas
drop policy if exists "transacciones_select" on public.transacciones;
create policy "transacciones_select" on public.transacciones
  for select using (
    public.current_user_role() = 'admin'
    or socio_id = auth.uid()
  );

drop policy if exists "transacciones_insert_own" on public.transacciones;
create policy "transacciones_insert_own" on public.transacciones
  for insert with check (socio_id = auth.uid());

drop policy if exists "transacciones_update_own" on public.transacciones;
create policy "transacciones_update_own" on public.transacciones
  for update using (socio_id = auth.uid())
  with check (socio_id = auth.uid());

-- =============================================
-- Trigger: crear fila en socios al registrarse
-- =============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.socios (id, nombres)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nombres', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- ADVANCED: Actualizar saldo automáticamente
-- cuando se inserta o cambia el estado de una transacción
-- =============================================
create or replace function public.actualizar_saldo_socio()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  delta decimal(14,2) := 0;
begin
  -- Solo afecta cuando el estado es 'completado'
  if TG_OP = 'INSERT' then
    if NEW.estado = 'completado' then
      if NEW.tipo = 'ingreso' then
        delta := NEW.monto;
      elsif NEW.tipo in ('egreso', 'transferencia') then
        delta := -NEW.monto;
      end if;
    end if;
  elsif TG_OP = 'UPDATE' then
    -- Revertir el efecto anterior si estaba completado
    if OLD.estado = 'completado' then
      if OLD.tipo = 'ingreso' then
        delta := delta - OLD.monto;
      elsif OLD.tipo in ('egreso', 'transferencia') then
        delta := delta + OLD.monto;
      end if;
    end if;
    -- Aplicar el nuevo efecto
    if NEW.estado = 'completado' then
      if NEW.tipo = 'ingreso' then
        delta := delta + NEW.monto;
      elsif NEW.tipo in ('egreso', 'transferencia') then
        delta := delta - NEW.monto;
      end if;
    end if;
  elsif TG_OP = 'DELETE' then
    if OLD.estado = 'completado' then
      if OLD.tipo = 'ingreso' then
        delta := -OLD.monto;
      elsif OLD.tipo in ('egreso', 'transferencia') then
        delta := OLD.monto;
      end if;
    end if;
  end if;

  if delta <> 0 then
    update public.socios
    set saldo = saldo + delta
    where id = coalesce(NEW.socio_id, OLD.socio_id);
  end if;

  return coalesce(NEW, OLD);
end;
$$;

drop trigger if exists trg_actualizar_saldo on public.transacciones;
create trigger trg_actualizar_saldo
  after insert or update or delete on public.transacciones
  for each row execute procedure public.actualizar_saldo_socio();

-- Real-time
alter publication supabase_realtime add table public.transacciones;
alter publication supabase_realtime add table public.socios;

alter table public.transacciones replica identity full;
alter table public.socios replica identity full;
