#!/bin/bash

echo "🚀 REME LAT-USA - Deploy Rápido"
echo "================================"
echo ""
echo "Tu proyecto está listo para deploy!"
echo ""
echo "📁 Ubicación: /home/usermario/reme-lat-usa-pro"
echo "✅ Git: Inicializado y commiteado"
echo "✅ Vercel CLI: Instalado"
echo ""
echo "🎯 OPCIONES DE DEPLOY:"
echo ""
echo "1️⃣  OPCIÓN 1: Vercel CLI (MÁS RÁPIDO - 2 minutos)"
echo "   npx vercel login"
echo "   npx vercel --prod"
echo ""
echo "2️⃣  OPCIÓN 2: GitHub + Vercel (3 minutos)"
echo "   - Crear repo en github.com/new"
echo "   - git remote add origin https://github.com/TU-USUARIO/reme-lat-usa-pro.git"
echo "   - git push -u origin main"
echo "   - Conectar en vercel.com/new"
echo ""
echo "3️⃣  OPCIÓN 3: Vercel Dashboard (5 minutos)"
echo "   - Ve a vercel.com/new"
echo "   - Import Git Repository"
echo "   - Deploy automático"
echo ""
echo "📚 DOCUMENTACIÓN COMPLETA:"
echo "   cat /home/usermario/reme-lat-usa-pro/DEPLOY-NOW.md"
echo ""
echo "💡 TIP: La opción más rápida es la #1"
echo ""
read -p "¿Quieres hacer login en Vercel ahora? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    npx vercel login
    echo ""
    echo "✅ Login completado!"
    echo ""
    read -p "¿Deploy a producción ahora? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        npx vercel --prod
    fi
fi
