# swp-app

## Configuración local

Copia `.env.example` como `.env.local` y completa las credenciales de Supabase y Auth0 antes de probar registro, login o el panel de administración. Las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` también deben estar configuradas en el proveedor de despliegue.

Después de actualizar variables de entorno, vuelve a desplegar la aplicación para que Next.js las incluya en el cliente.

## Dashboard y MongoDB

El dashboard usa Supabase para autenticación, perfiles y transacciones protegidas por RLS. MongoDB se usa únicamente desde el servidor para registrar actividad y analítica del dashboard. Configura `MONGODB_URI` y, opcionalmente, `MONGODB_DB` en `.env.local` o en el proveedor de despliegue. La pantalla seguirá funcionando con Supabase si MongoDB aún no está configurado, pero mostrará la analítica como pendiente.

## Preparar Supabase

En el proyecto de Supabase abre `SQL Editor`, pega el contenido de `supabase-schema.sql` y ejecútalo una vez. Esto crea las tablas `socios` y `transacciones`, las políticas RLS y el trigger que crea el perfil al registrarse.