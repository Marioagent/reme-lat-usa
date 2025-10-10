#!/bin/bash
# 🚀 REME LAT-USA - Deploy Directo a Vercel

echo "🚀 Deploying REME LAT-USA PRO to Vercel..."
echo ""
echo "📍 Working directory: $(pwd)"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory"
    echo "Run: cd /home/usermario/reme-lat-usa-pro"
    exit 1
fi

echo "✅ Project found"
echo ""
echo "🔐 Authenticating with Vercel..."
echo ""
echo "INSTRUCTIONS:"
echo "1. A browser window will open"
echo "2. Click 'Authorize' to connect"
echo "3. Come back here and press ENTER"
echo ""

vercel login

echo ""
echo "🚢 Deploying to production..."
echo ""

vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is now live!"
echo "📊 Check dashboard: https://vercel.com/dashboard"
