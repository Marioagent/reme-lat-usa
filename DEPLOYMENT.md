# 🚀 Guía de Deployment - REME LAT-USA PRO

## Deployment Rápido en Vercel (5 minutos)

### Opción 1: Deploy desde GitHub (Recomendado)

#### Paso 1: Subir a GitHub
\`\`\`bash
cd /home/usermario/reme-lat-usa-pro

# Inicializar Git
git init
git add .
git commit -m "feat: Initial commit - REME LAT-USA Pro 🚀

- Next.js 14 + TypeScript full-stack app
- PWA completa con Service Worker
- Autenticación con Supabase
- Dashboard con historial y alertas
- Calculadora y comparador de remesas
- Responsive design mobile-first

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Crear repo en GitHub y pushear
git remote add origin https://github.com/tu-usuario/reme-lat-usa-pro.git
git branch -M main
git push -u origin main
\`\`\`

#### Paso 2: Deploy en Vercel
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu cuenta de GitHub
3. Selecciona el repo `reme-lat-usa-pro`
4. Añade las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click en **Deploy**
6. ✅ ¡Listo! Tu app está en producción

---

### Opción 2: Deploy con Vercel CLI

\`\`\`bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /home/usermario/reme-lat-usa-pro
vercel

# Seguir las instrucciones en pantalla
# Añadir variables de entorno cuando se solicite
\`\`\`

---

## Configuración de Supabase (10 minutos)

### Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click en **New Project**
3. Completa:
   - **Name**: reme-lat-usa
   - **Database Password**: [genera una contraseña segura]
   - **Region**: Selecciona la más cercana
4. Click en **Create new project**
5. Espera 2-3 minutos mientras se crea

### Paso 2: Ejecutar Schema SQL

1. En Supabase, ve a **SQL Editor**
2. Click en **New Query**
3. Copia todo el contenido de `lib/supabase-schema.sql`
4. Pega en el editor
5. Click en **Run** (▶️)
6. ✅ Tablas creadas

### Paso 3: Obtener Credenciales

1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Añade estas variables en:
   - Archivo `.env.local` (local)
   - Vercel Dashboard > Settings > Environment Variables (producción)

---

## Deploy Demo HTML Simple (1 minuto)

El demo HTML original está en `/public/demo.html` y se puede acceder directamente:

\`\`\`
https://tu-dominio.vercel.app/demo.html
\`\`\`

O desplegarlo standalone:

\`\`\`bash
# Opción 1: Vercel
vercel /home/usermario/reme-lat-usa-demo.html

# Opción 2: Netlify
netlify deploy --prod --dir=/home/usermario --site=reme-lat-usa-demo
\`\`\`

---

## Verificación Post-Deployment

### Checklist ✅

- [ ] **App principal**: `https://tu-dominio.vercel.app/` carga correctamente
- [ ] **PWA**: Aparece botón "Instalar app" en móvil/escritorio
- [ ] **Auth**: Login/Signup funciona
- [ ] **Dashboard**: Se puede acceder con usuario registrado
- [ ] **Calculadora**: Calcula remesas correctamente
- [ ] **Comparador**: Muestra servicios de remesas
- [ ] **Service Worker**: Registrado en DevTools > Application
- [ ] **Manifest**: PWA válida en Lighthouse
- [ ] **Performance**: Score 90+ en Lighthouse

### Testing Rápido

\`\`\`bash
# Test local antes de deploy
npm run build
npm run start

# Abrir en navegador
open http://localhost:3000

# Test PWA
# 1. Abrir DevTools > Application > Service Workers
# 2. Verificar que está registrado
# 3. Application > Manifest
# 4. Verificar íconos y metadata
\`\`\`

---

## Configuración de Dominio Personalizado

### En Vercel

1. Ve a tu proyecto en Vercel
2. **Settings** > **Domains**
3. Click en **Add**
4. Ingresa tu dominio (ej: `reme-lat-usa.com`)
5. Sigue las instrucciones para configurar DNS:
   - **Tipo A**: Apunta a la IP de Vercel
   - **CNAME**: Apunta `www` a `cname.vercel-dns.com`
6. ✅ Espera propagación DNS (5-30 min)

---

## Environment Variables Requeridas

### Desarrollo (`.env.local`)
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Producción (Vercel)
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
\`\`\`

---

## Troubleshooting

### Error: "Supabase client not configured"
- Verifica que las variables de entorno estén configuradas
- Recarga la página de Vercel
- Re-deploy el proyecto

### Error: "Service Worker registration failed"
- Verifica que `sw.js` esté en `/public/`
- Chequea que `vercel.json` tenga las headers correctas
- Limpia caché del navegador

### Error: Build failed
\`\`\`bash
# Limpia cache y reinstala
rm -rf .next node_modules
npm install
npm run build
\`\`\`

### Performance Issues
- Optimiza imágenes: Usa Next.js Image component
- Lazy load components: `dynamic(() => import(...))`
- Reduce bundle size: Revisa `next.config.js`

---

## Monitoreo y Analytics

### Vercel Analytics
1. Ve a tu proyecto en Vercel
2. **Analytics** tab
3. Habilita **Web Analytics**
4. ✅ Tracking automático

### Supabase Logs
1. Ve a tu proyecto en Supabase
2. **Logs** > **API Logs**
3. Monitor queries y errores

---

## Backups y Recuperación

### Database Backup (Supabase)
\`\`\`bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Backup
supabase db dump -p your-password > backup.sql

# Restore
psql -h your-db.supabase.co -U postgres -d postgres < backup.sql
\`\`\`

---

## Escalabilidad

### Cuando el tráfico crezca:

1. **CDN**: Vercel Edge Network (automático)
2. **Database**: Upgrade Supabase plan
3. **Caching**: Implementar Redis
4. **Rate Limiting**: Añadir en API routes
5. **Load Balancer**: Vercel Pro+ (automático)

---

## Costos Estimados

| Servicio | Plan Free | Plan Pro |
|----------|-----------|----------|
| Vercel | ✅ Ilimitado (hobby) | $20/mes |
| Supabase | ✅ 500MB DB, 50K users | $25/mes |
| **Total** | **$0/mes** | **$45/mes** |

---

## Next Steps

1. ✅ Deploy aplicación
2. ✅ Configurar Supabase
3. 🔄 Integrar APIs reales de tasas
4. 🔄 Configurar Google Analytics
5. 🔄 SEO optimization
6. 🔄 Meta tags y OG images
7. 🔄 Sitemap y robots.txt

---

**¿Necesitas ayuda?** Revisa la [documentación completa](README.md)

---

🚀 **Happy Deploying!**
