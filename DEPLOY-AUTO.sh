#!/bin/bash
cd /home/usermario/reme-lat-usa-pro
echo "🚀 Deploying REME LAT-USA to Vercel..."
echo ""
npx vercel login
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Login successful! Deploying to production..."
    echo ""
    npx vercel --prod --yes
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo ""
    echo "📱 Open the URL above in your browser to see your PWA!"
    echo ""
else
    echo "❌ Login failed. Please try again."
fi
