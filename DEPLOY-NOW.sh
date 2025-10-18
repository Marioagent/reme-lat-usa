#!/bin/bash

echo "🚀 REME LAT-USA PRO - Deploy Automático"
echo "========================================"
echo ""

# Check if Supabase credentials are provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ ERROR: Faltan credenciales de Supabase"
    echo ""
    echo "Uso:"
    echo "  ./DEPLOY-NOW.sh <SUPABASE_URL> <SUPABASE_ANON_KEY>"
    echo ""
    echo "Ejemplo:"
    echo "  ./DEPLOY-NOW.sh https://xxxxx.supabase.co eyJhbG..."
    echo ""
    echo "📖 Ver SUPABASE-SETUP.md para obtener las credenciales"
    exit 1
fi

SUPABASE_URL=$1
SUPABASE_ANON_KEY=$2

echo "🔧 Configurando variables de entorno en Vercel..."
echo ""

# Remove old variables
vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>/dev/null

# Add new variables
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo ""
echo "✅ Variables configuradas"
echo ""
echo "🚀 Desplegando a producción..."
echo ""

# Deploy to production
vercel --prod --yes

echo ""
echo "✅ ¡Deploy completado!"
echo ""
echo "🌐 URL: https://reme-lat-usa-pro.vercel.app"
echo ""
