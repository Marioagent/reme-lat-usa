# 🚀 RAGSearch1 - Comandos de Instalación

## ⚡ Opción Rápida: Script Automático

Copia y pega estos comandos en tu terminal WSL2:

```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
chmod +x INSTALL-MANUAL.sh
./INSTALL-MANUAL.sh
```

Te pedirá tu contraseña sudo y configurará todo automáticamente.

---

## 📋 Opción Manual: Paso a Paso

Si prefieres hacerlo manualmente, sigue estos pasos:

### 1. Instalar python3-venv

```bash
sudo apt update
sudo apt install -y python3.12-venv python3-pip
```

### 2. Navegar al directorio

```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
```

### 3. Crear entorno virtual

```bash
python3 -m venv venv
```

### 4. Activar entorno e instalar dependencias

```bash
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Configurar .env

```bash
cp .env.example .env

# Configurar para desarrollo local
sed -i 's/POSTGRES_HOST=postgres/POSTGRES_HOST=localhost/' .env
sed -i 's/REDIS_HOST=redis/REDIS_HOST=localhost/' .env
sed -i 's/CHROMA_HOST=chromadb/CHROMA_HOST=localhost/' .env
sed -i 's/ENVIRONMENT=production/ENVIRONMENT=development/' .env
sed -i 's/SCHEDULER_ENABLE=true/SCHEDULER_ENABLE=false/' .env

# Generar SECRET_KEY
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i "s/SECRET_KEY=your-secret-key-here/SECRET_KEY=${SECRET_KEY}/" .env
```

### 6. Agregar OpenAI API Key

```bash
nano .env
# Busca la línea OPENAI_API_KEY y pega tu key:
# OPENAI_API_KEY=sk-tu-key-aqui
# Guarda con Ctrl+O, Enter, Ctrl+X
```

### 7. Crear directorios

```bash
mkdir -p data/chromadb logs backups
```

### 8. Iniciar ChromaDB

```bash
# En una terminal separada (o en background)
chroma run --path ./data/chromadb --port 8001
```

### 9. Iniciar API de RAGSearch1

```bash
# En tu terminal principal
source venv/bin/activate
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

---

## ✅ Verificación

Una vez iniciado, prueba estos comandos:

```bash
# Health check
curl http://localhost:8000/health

# Ver documentación
curl http://localhost:8000/docs

# Búsqueda de prueba
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "exchanges en México", "limit": 5}'
```

---

## 🌐 URLs Disponibles

Una vez iniciado RAGSearch1:

- **API**: http://localhost:8000
- **Documentación Interactiva**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **ChromaDB**: http://localhost:8001

---

## 🎯 Uso Rápido

### Script de inicio (después de instalar)

```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
./start-ragsearch1.sh
```

Este script automáticamente:
- Activa el entorno virtual
- Inicia ChromaDB si no está corriendo
- Inicia la API en puerto 8000

---

## 🔧 Troubleshooting

### Error: "python3-venv not found"
```bash
sudo apt install python3.12-venv
```

### Error: "chroma command not found"
```bash
pip install chromadb
```

### Error: "OpenAI API Key required"
```bash
nano .env
# Agrega tu key: OPENAI_API_KEY=sk-...
```

### Puerto 8000 ya en uso
```bash
# Ver qué está usando el puerto
lsof -i :8000

# Matar el proceso
kill -9 <PID>
```

### Reiniciar todo
```bash
# Detener ChromaDB
pkill -f "chroma run"

# Detener API
# Presiona Ctrl+C en la terminal donde corre

# Reiniciar
./start-ragsearch1.sh
```

---

## 📊 Próximos Pasos

Una vez que RAGSearch1 esté corriendo:

1. **Trigger colección inicial de datos:**
   ```bash
   curl -X POST http://localhost:8000/api/v1/admin/collection/run
   ```

2. **Verificar estadísticas:**
   ```bash
   curl http://localhost:8000/api/v1/admin/stats
   ```

3. **Integrar con REME-LAT-USA:**
   - El SDK está en `client-sdk/ragsearch1-sdk.ts`
   - Copialo a tu proyecto Next.js
   - Úsalo para búsquedas inteligentes

---

## 🎉 ¡Todo Listo!

RAGSearch1 ahora está funcionando al 100% en tu máquina local sin Docker.

Para desarrollo rápido, este setup es perfecto. Si más adelante quieres usar Docker para producción, sigue la guía en `LOCAL-SETUP.md`.
