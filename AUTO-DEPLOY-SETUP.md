# 🚀 Configurar Auto-Deploy - Guía Visual

## 📋 Sigue estos pasos exactos:

---

### ✅ PASO 1: Abre Vercel Dashboard

**URL:** https://vercel.com/dashboard

**Abre esta URL en Chrome ahora** ↑

---

### ✅ PASO 2: Encuentra tu Proyecto

En el dashboard verás una lista de proyectos.

**Click en:** `reme-lat-usa-pro`

(El que está actualmente desplegado)

---

### ✅ PASO 3: Ve a Settings

En la parte superior del proyecto, verás un menú:
- Overview
- Deployments
- Analytics
- **Settings** ← Click aquí

---

### ✅ PASO 4: Busca la sección "Git"

En el menú lateral de Settings, busca y click en:
- General
- Domains
- **Git** ← Click aquí
- Environment Variables
- Functions
- ...

---

### ✅ PASO 5: Conecta GitHub Repository

Verás algo como:

```
┌─────────────────────────────────────┐
│ Git Repository                       │
│                                      │
│ No Git repository connected          │
│                                      │
│ [Connect Git Repository]            │ ← Click aquí
└─────────────────────────────────────┘
```

**Click en el botón "Connect Git Repository"**

---

### ✅ PASO 6: Selecciona GitHub

Te mostrará opciones:
- GitHub
- GitLab
- Bitbucket

**Selecciona: GitHub**

---

### ✅ PASO 7: Autoriza Vercel (si es necesario)

Si es la primera vez, te pedirá autorizar Vercel en GitHub.

**Click "Authorize"** o **"Install"**

---

### ✅ PASO 8: Selecciona el Repositorio

Verás una lista de tus repositorios de GitHub.

**Busca y selecciona:** `Marioagent/reme-lat-usa`

**Click "Connect"**

---

### ✅ PASO 9: Configurar Branch (Opcional)

Verás:

```
Production Branch: [main ▼]
```

**Dejar en: main** (ya debería estar correcto)

---

### ✅ PASO 10: Guardar

**Click en "Save"** o el botón de confirmar

---

## 🎉 ¡Listo! Auto-Deploy Configurado

Verás un mensaje de éxito:
```
✓ Git repository connected successfully
```

---

## 🧪 Verificar que Funciona

Vamos a hacer un test:

```bash
cd /home/usermario/reme-lat-usa-pro

# Hacer un cambio pequeño
echo "" >> README.md

# Commit y push
git add README.md
git commit -m "test: verify auto-deploy is working"
git push origin master:main
```

**Resultado esperado:**
- Ve a Vercel Dashboard → reme-lat-usa-pro → Deployments
- Verás un nuevo deployment iniciándose automáticamente
- En 2-3 minutos estará listo

---

## ✅ A Partir de Ahora

**Workflow simple:**

```bash
# 1. Haces cambios en tu código
nano src/app/page.tsx

# 2. Guardas en Git
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Push a GitHub
git push origin master:main

# 4. ¡Vercel deploya automáticamente! ✨
# No necesitas hacer nada más
```

**Recibirás:**
- Email de Vercel cuando el deploy esté listo
- Comentario en GitHub con el status del deploy
- URL actualizada automáticamente

---

## 📊 Monitorear Deployments

**Ve a:** https://vercel.com/dashboard

**Click en tu proyecto** → **Deployments**

Ahí verás:
- Todos los deployments automáticos
- Logs de cada build
- Status (Building / Ready / Error)
- Preview URLs

---

**¿Necesitas ayuda en algún paso?** Dime en cuál estás 🚀


## ✅ Auto-Deploy Configurado

Cada push a la rama `main` desplegará automáticamente a Vercel.

**Deployment automático activo desde:** Fri Oct 10 10:31:00 -04 2025

