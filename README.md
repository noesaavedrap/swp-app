# swp-app

## Configuración local

Copia `.env.example` como `.env.local` y completa las credenciales de Supabase y Auth0 antes de probar registro, login o el panel de administración. Las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` también deben estar configuradas en el proveedor de despliegue.

Después de actualizar variables de entorno, vuelve a desplegar la aplicación para que Next.js las incluya en el cliente.