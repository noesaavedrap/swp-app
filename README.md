# SWP App (Finorio)

Plataforma de pagos y operación financiera para empresas que escalan en LATAM.

## Características avanzadas

- **Dashboard de socios** con saldo en tiempo real
- Trigger automático que actualiza el `saldo` al crear/modificar transacciones
- Filtros por tipo, método de pago y búsqueda de texto
- Exportación de movimientos a CSV
- Validación de DNI/RUC en el registro
- Soporte de métodos de pago peruanos (Yape, Plin, PagoEfectivo, etc.)
- Panel de administración con Auth0
- Realtime con Supabase

## Configuración local

1. Copia `.env.example` como `.env.local` y completa las credenciales de **Supabase** y **Auth0**.
2. Las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` también deben estar configuradas en el proveedor de despliegue.
3. Después de actualizar variables de entorno, vuelve a desplegar la aplicación.

## Preparar Supabase (importante)

En el proyecto de Supabase abre **SQL Editor**, pega el contenido completo de `supabase-schema.sql` y ejecútalo una vez.

Esto crea:
- Tablas `socios` y `transacciones`
- Políticas RLS
- Trigger de creación de perfil al registrarse
- **Trigger avanzado** que actualiza el saldo automáticamente

> Si ya tenías el schema anterior, ejecuta de nuevo el archivo completo (usa `create or replace` y `drop if exists`).

## Scripts

```bash
npm install
npm run dev      # desarrollo con Turbopack
npm run build
npm start
```

## Stack

- Next.js 16 + React 19
- Supabase (Auth + Database + Realtime)
- Auth0 (panel admin)
- Tailwind CSS 4
- Framer Motion / Motion
