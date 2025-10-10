# 🚀 DEPLOY A VERCEL - INSTRUCCIONES RÁPIDAS

## ✅ Tu proyecto está 100% listo para deploy

Git repository: ✅ Inicializado
Commit inicial: ✅ Completado (45 archivos)
Vercel CLI: ✅ Instalado

---

## 🎯 OPCIÓN 1: Deploy con Vercel CLI (2 minutos)

### Paso 1: Login en Vercel

\`\`\`bash
npx vercel login
\`\`\`

Sigue las instrucciones:
1. Selecciona tu método (Email / GitHub / GitLab)
2. Verifica en tu email o navegador
3. ✅ Login completado

### Paso 2: Deploy

\`\`\`bash
npx vercel --prod
\`\`\`

Preguntas que te hará:
- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta personal
- **Link to existing project?** → No
- **Project name?** → reme-lat-usa-pro (o el que quieras)
- **Directory?** → ./ (presiona Enter)
- **Override settings?** → No

### Paso 3: ¡Obtener URL! 🎉

Al final verás:
\`\`\`
✅ Production: https://reme-lat-usa-pro.vercel.app
\`\`\`

**Copia esa URL y ábrela en tu navegador!**

---

## 🎯 OPCIÓN 2: Deploy desde GitHub (3 minutos)

### Paso 1: Crear repo en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `reme-lat-usa-pro`
3. Private o Public (tu elección)
4. NO inicialices con README
5. Create repository

### Paso 2: Push tu código

\`\`\`bash
git remote add origin https://github.com/TU-USUARIO/reme-lat-usa-pro.git
git branch -M main
git push -u origin main
\`\`\`

### Paso 3: Conectar con Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Login con GitHub
3. Import el repo `reme-lat-usa-pro`
4. Click **Deploy**
5. ✅ ¡Listo!

Tu URL será: `https://reme-lat-usa-pro.vercel.app`

---

## 🎯 OPCIÓN 3: Deploy desde Dashboard de Vercel (5 minutos)

### Paso 1: Crear cuenta Vercel

1. Ve a [vercel.com/signup](https://vercel.com/signup)
2. Regístrate con GitHub, GitLab o Email
3. Verifica tu cuenta

### Paso 2: Import Project

1. Dashboard → **Add New** → **Project**
2. **Import Git Repository** → Conecta GitHub
3. Selecciona `reme-lat-usa-pro`
4. Click **Import**

### Paso 3: Configure Project

Vercel detectará automáticamente:
- ✅ Framework: Next.js
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`

**Environment Variables** (Opcional - para después):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GA_ID`

### Paso 4: Deploy

Click **Deploy** → Espera 2-3 minutos → ✅ ¡Listo!

---

## 📱 PROBAR LA PWA

Una vez deployed:

### En Móvil (Chrome/Safari)
1. Abre la URL en tu móvil
2. Verás un banner o ícono "Instalar"
3. Click en "Instalar app"
4. ✅ La app se instalará como nativa

### En Desktop (Chrome/Edge)
1. Abre la URL
2. En la barra de direcciones verás un ícono ⊕ o +
3. Click → "Instalar REME LAT-USA"
4. ✅ La app se instalará en tu desktop

---

## 🔧 CONFIGURACIÓN POST-DEPLOYMENT

### Añadir Variables de Entorno (Opcional)

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Añade:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL = https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhb...
NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
NEXT_PUBLIC_APP_URL = https://tu-url.vercel.app
\`\`\`

4. **Redeploy** para que tomen efecto

---

## 🎉 URLs ESPERADAS

Después del deployment tendrás:

### Production URL
\`https://reme-lat-usa-pro.vercel.app\`

### Demo HTML (dentro de la app)
\`https://reme-lat-usa-pro.vercel.app/demo.html\`

### Preview URL (cada push)
\`https://reme-lat-usa-pro-git-BRANCH.vercel.app\`

---

## ✅ CHECKLIST POST-DEPLOYMENT

Verifica que funcionen:

- [ ] **Landing page** carga correctamente
- [ ] **Calculadora** funciona
- [ ] **Comparador** muestra servicios
- [ ] **PWA** es instalable (ver ícono +)
- [ ] **Links de afiliados** abren correctamente
- [ ] **Auth** (Login/Signup) funciona
- [ ] **Dashboard** accesible
- [ ] **Responsive** en móvil
- [ ] **Lighthouse** score 90+

---

## 🐛 TROUBLESHOOTING

### Error: "Build failed"

\`\`\`bash
# Verifica localmente primero
npm install
npm run build
npm run start
\`\`\`

Si funciona local pero falla en Vercel:
- Verifica versión de Node.js en Vercel (Settings → General)
- Debe ser Node.js 18.x o superior

### Error: "Module not found"

- Verifica que todas las dependencias estén en `package.json`
- Redeploy desde Vercel dashboard

### Auth no funciona

- Necesitas configurar Supabase primero
- Añade las variables de entorno en Vercel
- Redeploy

---

## 📞 COMANDOS ÚTILES

\`\`\`bash
# Ver logs del deployment
npx vercel logs

# Ver información del proyecto
npx vercel inspect

# Listar deployments
npx vercel ls

# Remover un deployment
npx vercel rm [deployment-url]

# Ver alias
npx vercel alias ls
\`\`\`

---

## 🎯 SIGUIENTE PASO: MONETIZAR

Una vez deployed:

1. **Actualizar IDs de afiliados** en `lib/affiliates.ts`
2. **Configurar Google Analytics**
3. **Compartir en redes sociales**
4. **Invitar primeros usuarios**

Lee [MONETIZATION-GUIDE.md](MONETIZATION-GUIDE.md) para el plan completo.

---

## 🔗 RECURSOS

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)

---

**¡DEPLOY AHORA! 🚀**

El comando más rápido:

\`\`\`bash
npx vercel login
npx vercel --prod
\`\`\`

2 minutos y tendrás tu URL.

---

**Made with 💧 by MarioAgent**
