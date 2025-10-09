#!/bin/bash

# Script de Deployment Automático para REME LAT-USA
# Ejecuta todos los pasos necesarios para deployment en Vercel

echo "🚀 REME LAT-USA - Deployment Automático"
echo "========================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado. Ejecuta desde el directorio raíz del proyecto."
    exit 1
fi

echo "✅ Verificando proyecto..."
echo ""

# Build para verificar que no hay errores
echo "🔨 Building proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en build. Corrige los errores antes de deployar."
    exit 1
fi

echo "✅ Build exitoso!"
echo ""

# Verificar si Git está inicializado
if [ ! -d ".git" ]; then
    echo "📦 Inicializando Git..."
    git init
    git add .
    git commit -m "feat: Initial commit - REME LAT-USA Pro v2.0.0 💰

Complete monetization-ready full-stack remittance comparison app

Features:
- Affiliate links system with tracking
- Referral program for users
- Google Analytics integration
- SEO optimized with Open Graph
- PWA ready with service worker
- Supabase auth and database
- Dashboard with history and alerts

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
else
    echo "✅ Git ya inicializado"
fi

echo ""
echo "🌐 Opciones de Deployment:"
echo ""
echo "1. Vercel (Recomendado)"
echo "2. Netlify"
echo "3. Railway"
echo ""
echo "Para deployar, ejecuta uno de estos comandos:"
echo ""
echo "   # Vercel (recomendado)"
echo "   npx vercel"
echo ""
echo "   # Netlify"
echo "   npx netlify deploy --prod"
echo ""
echo "   # Railway"
echo "   # Conecta tu repo en railway.app"
echo ""
echo "🔐 No olvides configurar las variables de entorno:"
echo ""
echo "   NEXT_PUBLIC_SUPABASE_URL=..."
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
echo "   NEXT_PUBLIC_GA_ID=..."
echo "   NEXT_PUBLIC_APP_URL=..."
echo ""
echo "✅ ¡Proyecto listo para deployment!"
echo ""
echo "📚 Documentación:"
echo "   - DEPLOYMENT.md - Guía completa"
echo "   - MONETIZATION-GUIDE.md - Cómo generar ingresos"
echo "   - QUICK-START.md - Setup rápido"
echo ""
