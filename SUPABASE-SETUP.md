# SUPABASE SETUP - PRODUCCIÓN REAL

## Paso 1: Crear Proyecto Supabase

1. Ve a https://supabase.com/dashboard
2. Click "New Project"
3. Nombre: `reme-lat-usa-pro`
4. Database Password: (genera uno seguro)
5. Region: Elige la más cercana (ej: `us-east-1`)
6. Click "Create new project"

## Paso 2: Ejecutar Schema SQL

1. En Supabase Dashboard, ve a "SQL Editor"
2. Click "New query"
3. Copia y pega TODO el contenido de: `lib/supabase-schema.sql`
4. Click "Run" o presiona Cmd/Ctrl + Enter
5. Verifica que las tablas se crearon: ve a "Table Editor"

## Paso 3: Obtener Credenciales

1. En Supabase Dashboard, ve a "Settings" → "API"
2. Copia:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...`

## Paso 4: Actualizar Variables en Vercel

Ejecuta estos comandos:

```bash
cd /home/usermario/Desktop/reme-lat-usa

# Actualizar URL
vercel env rm NEXT_PUBLIC_SUPABASE_URL production
echo "TU_URL_REAL_AQUI" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Actualizar Key
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "TU_KEY_REAL_AQUI" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Deploy automático
vercel --prod --yes
```

## Paso 5: Actualizar .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...
```

## ✅ Verificar que Funciona

1. Abre: https://reme-lat-usa-pro.vercel.app
2. Registra tu cuenta: mac.global.apps@gmail.com
3. Verifica el email de confirmación
4. Inicia sesión
5. Todas las funcionalidades deben funcionar con Supabase real

---

**IMPORTANTE:** Sin credenciales reales de Supabase, la aplicación NO funcionará.
