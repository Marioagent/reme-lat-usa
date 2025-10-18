# 🚀 DESPLEGAR RAGSEARCH1 - AHORA

RAGSearch1 necesita desplegarse manualmente la primera vez. Después será automático.

---

## ⚡ OPCIÓN 1: RENDER (GRATIS - 5 MINUTOS)

### Paso 1: Crear cuenta en Render
```
https://render.com/
```
- Click "Get Started"
- Sign up con GitHub (usa tu cuenta Marioagent)

### Paso 2: Crear Web Service
1. Click "New +" → "Web Service"
2. Conecta tu repositorio: `Marioagent/reme-lat-usa`
3. **Root Directory**: `ragsearch1`
4. **Name**: `ragsearch1-api`
5. **Runtime**: Python 3
6. **Build Command**: `pip install -r requirements.txt`
7. **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

### Paso 3: Variables de Entorno
Click "Advanced" y agrega:
```
OPENAI_API_KEY = (tu key de .env)
ENVIRONMENT = production
DEBUG = false
CHROMA_PERSIST_DIR = /opt/render/project/src/data/chromadb
```

### Paso 4: Deploy
- Click "Create Web Service"
- Espera 3-5 minutos
- Copia la URL que te da (ej: `https://ragsearch1-api.onrender.com`)

### Paso 5: Actualizar GitHub Secret
```
https://github.com/Marioagent/reme-lat-usa/settings/secrets/actions
```
- Edita `RAGSEARCH1_URL`
- Value: `https://ragsearch1-api.onrender.com` (tu URL)
- Save

---

## ⚡ OPCIÓN 2: RAILWAY ($5/MES - MÁS RÁPIDO)

### Paso 1: Crear cuenta en Railway
```
https://railway.app/
```
- Sign up con GitHub

### Paso 2: New Project
1. Click "New Project"
2. "Deploy from GitHub repo"
3. Selecciona: `Marioagent/reme-lat-usa`
4. **Root Directory**: Cambia a `ragsearch1`

### Paso 3: Variables
En la pestaña "Variables":
```
OPENAI_API_KEY = (tu key)
ENVIRONMENT = production
DEBUG = false
CHROMA_PERSIST_DIR = /app/data/chromadb
PORT = 8000
```

### Paso 4: Deploy
- Railway deployará automáticamente
- Ve a "Settings" → "Domains"
- Click "Generate Domain"
- Copia la URL (ej: `ragsearch1-production.up.railway.app`)

### Paso 5: Actualizar GitHub Secret
```
https://github.com/Marioagent/reme-lat-usa/settings/secrets/actions
```
- Edita `RAGSEARCH1_URL`
- Value: `https://ragsearch1-production.up.railway.app`
- Save

---

## 🧪 VERIFICAR QUE FUNCIONA

Una vez desplegado, prueba:

```bash
curl https://TU-URL-RAGSEARCH1/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "service": "ragsearch1",
  "version": "1.0.0"
}
```

Luego prueba el endpoint BCV:
```bash
curl https://TU-URL-RAGSEARCH1/api/v1/bcv/rates
```

---

## ✅ DESPUÉS DEL DEPLOYMENT

Una vez que RAGSearch1 esté live:

1. El endpoint `/api/rag/bcv` automáticamente usará RAGSearch1
2. La respuesta dirá: `"source": "RAGSearch1 (Multi-source validated)"`
3. El sistema híbrido estará 100% activo

---

## 🎯 RECOMENDACIÓN

**USA RENDER** (Opción 1):
- ✅ Gratis para empezar
- ✅ Muy fácil de configurar
- ✅ Auto-deploy de GitHub
- ⚠️ Puede "dormir" después de 15 min inactivo (toma 30s despertar)

**USA RAILWAY** (Opción 2) si:
- Necesitas que esté siempre activo (sin "sleep")
- No importa pagar $5/mes
- Quieres respuestas más rápidas

---

**¿Cuál prefieres? Te guío paso a paso.**
