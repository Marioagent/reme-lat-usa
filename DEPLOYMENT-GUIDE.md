# 🚀 REME LAT-USA PRO - Guía de Deployment

## Estado Actual
✅ Proyecto preparado y listo para deployment
✅ Build exitoso sin errores críticos
✅ Git configurado con commits actualizados
✅ Vercel CLI instalado

---

## 🎯 OPCIÓN 1: Deployment Directo con Vercel CLI (5 minutos)

### Paso 1: Login en Vercel
```bash
cd /home/usermario/reme-lat-usa-pro
vercel login
```

**Esto abrirá tu navegador.** Autoriza la conexión.

### Paso 2: Deploy
```bash
vercel --prod
```

Responde las preguntas:
- **Set up and deploy?** → `Y`
- **Which scope?** → Selecciona tu cuenta
- **Link to existing project?** → `N`
- **Project name?** → `reme-lat-usa-pro` (o el que prefieras)
- **Directory?** → `.` (presiona ENTER)
- **Override settings?** → `N`

**¡Listo!** Vercel te dará la URL de producción.

---

## 🎯 OPCIÓN 2: Deployment vía GitHub (Recomendado - Automático)

### Paso 1: Crear Repositorio en GitHub
1. Ve a: https://github.com/new
2. Nombre: `reme-lat-usa-pro`
3. Descripción: `💧 Comparador de Remesas LAT-USA en tiempo real`
4. **Privado** o **Público** (tu elección)
5. **NO** marques "Initialize with README"
6. Click en **Create repository**

### Paso 2: Conectar y Push
Copia la URL que te da GitHub (algo como `git@github.com:tu-usuario/reme-lat-usa-pro.git`) y ejecuta:

```bash
cd /home/usermario/reme-lat-usa-pro
git remote add origin TU_URL_DE_GITHUB_AQUI
git push -u origin master
```

### Paso 3: Conectar con Vercel
1. Ve a: https://vercel.com/new
2. Click en **Import Git Repository**
3. Selecciona `reme-lat-usa-pro`
4. **IMPORTANTE**: Agrega las variables de entorno:
   - Copia desde `.env.example`
   - O déjalas vacías por ahora (app funcionará en modo demo)
5. Click en **Deploy**

**¡Deployment automático configurado!** Cada push a `master` = deployment automático.

---

## 🔧 Variables de Entorno (Opcional)

Si quieres funcionalidad completa, configura en Vercel:

### Supabase (Para autenticación)
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
```

### APIs de Tasas (Para tasas reales)
```
EXCHANGE_API_KEY=tu-clave-de-exchangerate-api
BINANCE_API_KEY=tu-clave-de-binance
```

**NOTA:** La app funciona sin estas variables (usa tasas simuladas).

---

## 🌐 URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub**: https://github.com
- **Supabase** (si necesitas): https://supabase.com

---

## 🐛 Troubleshooting

### Error: "supabaseUrl is required"
- Es solo un warning en build
- La app funciona perfectamente sin Supabase
- O agrega las variables de entorno en Vercel

### Build tarda mucho
- Normal en primera vez (instala dependencias)
- Builds siguientes son más rápidos (cache)

### 404 después de deployment
- Espera 1-2 minutos (propagación DNS)
- Refresca con CTRL + F5

---

## 📊 Verificación Post-Deployment

Después de desplegar, verifica:
- ✅ Landing page carga correctamente
- ✅ Calculadora funciona
- ✅ Comparador muestra servicios
- ✅ Tasas se actualizan (simuladas)
- ✅ Responsive en móvil
- ✅ PWA instalable

---

## 🎉 Próximos Pasos

Una vez desplegado:

1. **Configura Supabase** (si quieres auth real)
2. **Agrega APIs reales** de tasas
3. **Configura dominio custom** en Vercel
4. **SEO**: Agrega meta tags personalizados
5. **Analytics**: Configura Vercel Analytics
6. **Monetización**: Agrega links de afiliados

---

**¿Necesitas ayuda?** Dime en qué paso estás y te asisto.
