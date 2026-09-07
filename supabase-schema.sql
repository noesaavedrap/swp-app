-- =============================================
-- SWP Finance - Supabase Schema
-- Ejecutar en: Supabase > SQL Editor > New query
-- Proyecto: dfipuuhxisaokuxkiwqa
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

-- =============================================
-- Row Level Security
-- =============================================
alter table public.socios enable row level security;
alter table public.transacciones enable row level security;

-- Socios: un socio ve solo su propio perfil; los admins ven todos
drop policy if exists "socios_select_own" on public.socios;
create policy "socios_select_own" on public.socios
  for select using (
    (select rol from public.socios where id = auth.uid()) = 'admin'
    or id = auth.uid()
  );

drop policy if exists "socios_update_own" on public.socios;
create policy "socios_update_own" on public.socios
  for update using (id = auth.uid());

-- Transacciones: un socio ve solo las suyas; los admins ven todas
drop policy if exists "transacciones_select" on public.transacciones;
create policy "transacciones_select" on public.transacciones
  for select using (
    (select rol from public.socios where id = auth.uid()) = 'admin'
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
-- en auth.users (patrón estándar de Supabase)
-- =============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.socios (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Real-time: habilitar transacciones y socios
alter publication supabase_realtime add table public.transacciones;
alter publication supabase_realtime add table public.socios;

-- Realtime: insert/update/delete
alter table public.transacciones replica identity full;
alter table public.socios replica identity full;