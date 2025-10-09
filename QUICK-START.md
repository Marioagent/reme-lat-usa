# ⚡ Quick Start - REME LAT-USA PRO

## Setup en 3 Pasos (5 minutos)

### 1️⃣ Instalar Dependencias
\`\`\`bash
cd /home/usermario/reme-lat-usa-pro
npm install
\`\`\`

### 2️⃣ Configurar Environment
\`\`\`bash
# Copiar ejemplo
cp .env.local.example .env.local

# Editar con tus credenciales
nano .env.local
\`\`\`

Añade:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
\`\`\`

### 3️⃣ Ejecutar
\`\`\`bash
npm run dev
\`\`\`

✅ Abre http://localhost:3000

---

## Deploy en Vercel (2 minutos)

\`\`\`bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Seguir instrucciones
\`\`\`

✅ ¡App en producción!

---

## Supabase Quick Setup

1. **Crear proyecto**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. **SQL Editor**: Pegar contenido de `lib/supabase-schema.sql`
3. **Run** ▶️
4. **Copiar keys**: Settings > API

✅ Base de datos lista

---

## Verificación Rápida

- [ ] Landing page carga
- [ ] Calculadora funciona
- [ ] PWA instalable
- [ ] Auth funciona
- [ ] Dashboard accesible

---

## Comandos Útiles

\`\`\`bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Ejecutar build
npm run lint         # Linter
npm run type-check   # TypeScript check
\`\`\`

---

## Demo HTML Simple

El demo HTML original está disponible en:
- Local: `/public/demo.html`
- Producción: `https://tu-dominio.vercel.app/demo.html`

---

## Estructura Básica

\`\`\`
app/
├── page.tsx           → Landing page
├── auth/page.tsx      → Login/Signup
└── dashboard/page.tsx → User dashboard

components/
├── Calculator.tsx     → Calculadora
├── Comparator.tsx     → Comparador
└── ...

lib/
├── supabase.ts        → DB client
└── api-client.ts      → APIs tasas
\`\`\`

---

## Próximos Pasos

1. ✅ Ejecutar localmente
2. 📝 Configurar Supabase
3. 🚀 Deploy a Vercel
4. 🎨 Personalizar contenido
5. 📊 Añadir analytics

---

**Need help?** Revisa [README.md](README.md) o [DEPLOYMENT.md](DEPLOYMENT.md)

---

🔥 **Let's build!**
