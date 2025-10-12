# 🚀 RAGSearch1 - Quick Start Guide

Guía rápida para implementar el sistema RAGSearch1 en minutos.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** 20.10+ ([Instalar](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ ([Instalar](https://docs.docker.com/compose/install/))
- **OpenAI API Key** ([Obtener](https://platform.openai.com/api-keys))

Opcional (para desarrollo local):
- Python 3.11+
- Node.js 18+ (para el SDK)

## ⚡ Instalación Rápida (5 minutos)

### Opción 1: Script Automático (Recomendado)

```bash
# 1. Clonar o navegar al directorio
cd ragsearch1

# 2. Ejecutar script de setup automático
chmod +x scripts/setup.sh
./scripts/setup.sh
```

El script automáticamente:
- ✅ Verifica prerrequisitos
- ✅ Crea archivo `.env` desde `.env.example`
- ✅ Genera SECRET_KEY seguro
- ✅ Construye imágenes Docker
- ✅ Inicia todos los servicios
- ✅ Verifica que todo funcione

### Opción 2: Manual

```bash
# 1. Copiar archivo de configuración
cp .env.example .env

# 2. Editar .env y agregar tu OpenAI API Key
nano .env
# OPENAI_API_KEY=sk-your-key-here

# 3. Generar SECRET_KEY
openssl rand -hex 32
# Copiar el resultado y pegarlo en .env como SECRET_KEY=

# 4. Iniciar servicios
docker-compose up -d

# 5. Verificar salud
curl http://localhost:8000/health
```

## 🎯 Verificación de Instalación

### 1. Verificar que todos los servicios estén corriendo:

```bash
docker-compose ps
```

Deberías ver:
- ✅ `ragsearch1-api` (healthy)
- ✅ `ragsearch1-postgres` (healthy)
- ✅ `ragsearch1-redis` (healthy)
- ✅ `ragsearch1-chromadb` (healthy)

### 2. Probar la API:

```bash
# Health check
curl http://localhost:8000/health

# Documentación interactiva
open http://localhost:8000/docs
```

## 📊 Primer Uso

### Paso 1: Cargar Datos Iniciales

```bash
# Trigger manual de recolección de datos
curl -X POST http://localhost:8000/api/v1/admin/collection/run

# Verificar progreso (esperar 30-60 segundos)
curl http://localhost:8000/api/v1/admin/stats
```

### Paso 2: Probar Búsqueda

```bash
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "exchanges en México",
    "limit": 5
  }'
```

### Paso 3: Obtener Tasas de Venezuela

```bash
curl http://localhost:8000/api/v1/bcv/rates
```

### Paso 4: Comparar Opciones de Remesa

```bash
curl -X POST http://localhost:8000/api/v1/compare \
  -H "Content-Type: application/json" \
  -d '{
    "from_country": "US",
    "to_country": "VE",
    "amount": 100,
    "currency": "USD"
  }'
```

## 🔌 Integrar con REME-LAT-USA

### Opción A: Usar el SDK (Recomendado)

```typescript
// 1. Instalar SDK
npm install axios

// 2. Copiar el SDK a tu proyecto
cp ragsearch1/client-sdk/ragsearch1-sdk.ts src/lib/

// 3. Usar en tu componente
import RAGSearch1Client from '@/lib/ragsearch1-sdk';

const ragsearch = new RAGSearch1Client({
  baseURL: 'http://localhost:8000'
});

// Buscar instituciones
const results = await ragsearch.search({
  query: 'mejores opciones para remesas',
  limit: 10
});

// Obtener tasas BCV
const bcvRates = await ragsearch.getBCVRates();

// Comparar opciones
const comparison = await ragsearch.compareRemittance({
  from_country: 'US',
  to_country: 'VE',
  amount: 100
});
```

### Opción B: Llamadas Directas con Axios

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// Búsqueda
const searchResults = await axios.post(`${API_BASE}/api/v1/search`, {
  query: 'bancos en Venezuela',
  limit: 10
});

// Tasas BCV
const bcvRates = await axios.get(`${API_BASE}/api/v1/bcv/rates`);
```

## 🛠️ Configuración Avanzada

### Habilitar Monitoreo (Prometheus + Grafana)

```bash
# Iniciar con perfil de monitoreo
docker-compose --profile monitoring up -d

# Acceder a:
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)
```

### APIs Opcionales (Plaid, Belvo)

Para obtener datos de instituciones bancarias reales, agrega en `.env`:

```bash
# Plaid (USA, México, Canadá)
PLAID_CLIENT_ID=your-client-id
PLAID_SECRET=your-secret
PLAID_ENV=sandbox

# Belvo (LATAM)
BELVO_SECRET_ID=your-id
BELVO_SECRET_PASSWORD=your-password
BELVO_ENV=sandbox
```

Luego reinicia:
```bash
docker-compose restart api
```

### Personalizar Actualizaciones

En `.env`, ajusta las frecuencias:

```bash
UPDATE_EXCHANGES_INTERVAL=900      # 15 min (exchanges crypto)
UPDATE_BCV_INTERVAL=1800           # 30 min (BCV Venezuela)
UPDATE_BANKS_INTERVAL=86400        # 24 horas (bancos)
```

## 🧪 Testing

### Test Rápido de Todos los Endpoints

```bash
# Ejecutar ejemplo del SDK
cd ragsearch1/client-sdk
npm install
npm run example
```

### Tests Unitarios (Desarrollo)

```bash
# En el directorio ragsearch1
python -m pytest tests/ -v
```

## 📚 Documentación Interactiva

Una vez iniciado el sistema, puedes ver la documentación completa en:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Aquí encontrarás:
- 📖 Descripción de todos los endpoints
- 🔧 Probar endpoints directamente desde el navegador
- 📝 Ejemplos de requests y responses
- 🏷️ Modelos de datos

## 🔍 Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/search` | POST | Búsqueda inteligente con RAG |
| `/api/v1/ask` | POST | Pregunta en lenguaje natural |
| `/api/v1/compare` | POST | Comparar opciones de remesa |
| `/api/v1/bcv/rates` | GET | Tasas Venezuela (BCV, paralelo, Binance) |
| `/api/v1/entity/{id}` | GET | Obtener entidad específica |
| `/api/v1/entities/country/{code}` | GET | Entidades por país |
| `/api/v1/admin/stats` | GET | Estadísticas del sistema |

## 🐛 Troubleshooting

### Problema: Servicios no inician

```bash
# Ver logs
docker-compose logs -f

# Limpiar y reiniciar
docker-compose down -v
docker-compose up -d
```

### Problema: "OPENAI_API_KEY not found"

```bash
# Verificar que .env tiene la key
cat .env | grep OPENAI_API_KEY

# Si falta, agregarla
echo "OPENAI_API_KEY=sk-your-key" >> .env
docker-compose restart api
```

### Problema: ChromaDB no conecta

```bash
# Verificar que el puerto 8001 esté libre
lsof -i :8001

# Reiniciar solo ChromaDB
docker-compose restart chromadb
```

### Problema: Base de datos vacía

```bash
# Trigger manual de colección
curl -X POST http://localhost:8000/api/v1/admin/collection/run

# Esperar 30-60 segundos y verificar
curl http://localhost:8000/api/v1/admin/stats
```

## 📈 Próximos Pasos

Una vez que tu sistema esté funcionando:

1. **Integrar con REME-LAT-USA**: Usa el SDK para agregar búsqueda inteligente
2. **Personalizar datos**: Agrega tus propias fuentes de datos en `ragsearch1/collector.py`
3. **Monitorear**: Configura alertas en Grafana
4. **Escalar**: Ajusta `API_WORKERS` en `.env` según tu carga
5. **Deploy a producción**: Usa `docker-compose --profile production up -d`

## 🆘 Soporte

- **Documentación completa**: Ver [README.md](README.md)
- **Ejemplos de código**: Ver `client-sdk/example.ts`
- **Issues**: https://github.com/tu-repo/ragsearch1/issues

## 📝 Notas Importantes

- ⚠️ **OpenAI API Key requerida**: Sin ella, el sistema no funcionará
- ⚠️ **Puerto 8000**: Asegúrate que esté disponible o cambia `API_PORT` en `.env`
- ⚠️ **Primer uso**: La recolección inicial puede tardar 1-2 minutos
- ⚠️ **Producción**: Cambia las passwords por defecto en `.env`

---

**Desarrollado con ❤️ por MGA para REME-LAT-USA**
