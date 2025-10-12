# 🔍 RAGSearch1 - Sistema RAG para Instituciones Financieras de América

Sistema de búsqueda inteligente basado en RAG (Retrieval-Augmented Generation) que indexa y proporciona información actualizada sobre instituciones financieras en 32+ países de América.

## 🌟 Características Principales

- 🌎 **Cobertura Geográfica**: 32+ países de América (Norte, Central, Sur y Caribe)
- 🏦 **Entidades Indexadas**: 5,000+ bancos, exchanges, casas de cambio, fintech
- 🔄 **Actualización Automática**: Cada 15-30 minutos
- 🇻🇪 **Panel BCV Venezuela**: Tasas en tiempo real (7 monedas)
- 💱 **Comparador de Remesas**: Análisis inteligente con IA
- 🔌 **20+ APIs Integradas**: Plaid, Belvo, ccxt, CoinGecko, y más
- 🐳 **Docker Ready**: Deploy completo con un comando
- 📊 **Monitoreo**: Prometheus + Grafana incluidos
- 🔐 **Seguro**: HTTPS, rate limiting, validación completa

## 📦 Stack Tecnológico

```yaml
Backend:
  - Python 3.11+
  - FastAPI
  - Langchain
  - ChromaDB (vector database)
  - PostgreSQL (metadata)
  - Redis (cache)

Integraciones:
  - Plaid API (banking)
  - Belvo API (LATAM banking)
  - ccxt (100+ crypto exchanges)
  - CoinGecko API
  - Web3.py (blockchain)
  - BeautifulSoup (web scraping)

Monitoreo:
  - Prometheus
  - Grafana
  - Logs estructurados

Deployment:
  - Docker + Docker Compose
  - Nginx (reverse proxy)
  - Let's Encrypt (SSL)
```

## 🚀 Quick Start

### Prerequisitos

```bash
- Docker 20.10+
- Docker Compose 2.0+
- Python 3.11+ (para desarrollo local)
- 4GB RAM mínimo
- 10GB espacio en disco
```

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-repo/ragsearch1.git
cd ragsearch1

# 2. Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con tus API keys

# 3. Iniciar servicios
docker-compose up -d

# 4. Verificar instalación
curl http://localhost:8000/health

# 5. Acceder a la documentación
open http://localhost:8000/docs
```

### Configuración Rápida

```bash
# Variables esenciales en .env
OPENAI_API_KEY=sk-...                    # Para embeddings
PLAID_CLIENT_ID=your_client_id          # API Plaid
PLAID_SECRET=your_secret                # API Plaid
BELVO_SECRET_ID=your_id                 # API Belvo
BELVO_SECRET_PASSWORD=your_password     # API Belvo
```

## 📖 Uso

### API REST

```bash
# Búsqueda inteligente
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "mejores exchanges en México", "limit": 5}'

# Comparar remesas
curl -X POST http://localhost:8000/api/v1/compare \
  -H "Content-Type: application/json" \
  -d '{
    "from_country": "USA",
    "to_country": "VE",
    "amount": 100,
    "currency": "USD"
  }'

# Tasas BCV Venezuela
curl http://localhost:8000/api/v1/bcv/rates
```

### SDK JavaScript

```javascript
import { RAGSearch1Client } from 'ragsearch1-sdk';

const client = new RAGSearch1Client({
  baseURL: 'http://localhost:8000',
  apiKey: 'your-api-key'
});

// Búsqueda
const results = await client.search('bancos con API en Colombia');

// Comparación
const comparison = await client.compare({
  from: 'USA',
  to: 'CO',
  amount: 1000
});

// BCV Venezuela
const bcvRates = await client.getBCVRates();
```

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  REME-LAT-USA                        │
│              (Frontend React/Next.js)                │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────────────────┐
│              RAGSearch1 API (FastAPI)                │
│  ┌──────────┬──────────┬──────────┬──────────┐     │
│  │  Search  │ Compare  │   BCV    │  Admin   │     │
│  └──────────┴──────────┴──────────┴──────────┘     │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ ChromaDB │  │  Redis   │  │PostgreSQL│
│ Vectors  │  │  Cache   │  │ Metadata │
└────┬─────┘  └──────────┘  └──────────┘
     │
     ▼
┌─────────────────────────────────────────────────────┐
│           Data Collection Layer                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  APIs: Plaid, Belvo, ccxt, CoinGecko        │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Scrapers: BCV, Monitor Dólar, etc.         │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 📊 Endpoints API

### Búsqueda

```http
POST /api/v1/search
Content-Type: application/json

{
  "query": "mejores opciones para enviar dinero a Venezuela",
  "limit": 10,
  "filters": {
    "country": "VE",
    "type": "remittance"
  }
}
```

### Comparación de Remesas

```http
POST /api/v1/compare
Content-Type: application/json

{
  "from_country": "USA",
  "to_country": "VE",
  "amount": 100,
  "currency": "USD"
}
```

### Panel BCV Venezuela

```http
GET /api/v1/bcv/rates

Response:
{
  "usd_oficial": 36.50,
  "usd_paralelo": 42.80,
  "eur": 39.45,
  "gbp": 45.30,
  "last_updated": "2025-10-12T14:30:00Z"
}
```

## 🔧 Desarrollo

### Setup Local

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
.\venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar tests
pytest tests/ -v

# Ejecutar API en modo desarrollo
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### Estructura del Proyecto

```
ragsearch1/
├── api/                    # FastAPI endpoints
│   ├── main.py
│   ├── routes/
│   ├── models/
│   └── middleware/
├── ragsearch1/            # Core RAG system
│   ├── collector.py       # Data collection
│   ├── processor.py       # Data processing
│   ├── vectordb.py        # ChromaDB wrapper
│   ├── retriever.py       # RAG search
│   └── scheduler.py       # Auto-updates
├── integrations/          # API integrations
│   ├── plaid.py
│   ├── belvo.py
│   ├── ccxt_exchanges.py
│   └── bcv_scraper.py
├── tests/                 # Test suite
├── monitoring/            # Prometheus + Grafana
├── docs/                  # Documentation
└── scripts/               # Utility scripts
```

## 📈 Monitoreo

### Grafana Dashboard

```bash
# Acceder a Grafana
open http://localhost:3000

# Credenciales por defecto
Usuario: admin
Password: admin
```

### Métricas Disponibles

- Requests por segundo
- Latencia promedio
- Tasa de error
- Entidades indexadas
- Frescura de datos
- API calls por fuente

## 🔐 Seguridad

```yaml
Implementado:
  ✅ HTTPS/TLS
  ✅ Rate limiting
  ✅ Input validation
  ✅ SQL injection prevention
  ✅ XSS protection
  ✅ CORS configurado
  ✅ Headers de seguridad
  ✅ No almacena datos sensibles
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
pytest

# Con coverage
pytest --cov=ragsearch1 --cov-report=html

# Tests específicos
pytest tests/test_api.py -v
pytest tests/test_collector.py -v
pytest tests/test_vectordb.py -v
```

## 📚 Documentación Adicional

- [API Reference](docs/api-reference.md)
- [Integration Guide](docs/integration-guide.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Contributing](CONTRIBUTING.md)

## 🤝 Contribución

Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles.

## 📝 License

MIT License - ver [LICENSE](LICENSE) para detalles

## 🆘 Soporte

- GitHub Issues: https://github.com/tu-repo/ragsearch1/issues
- Email: support@ragsearch1.com
- Discord: https://discord.gg/ragsearch1

## 🗺️ Roadmap

### v1.0 (Actual)
- ✅ Core RAG system
- ✅ 20+ API integrations
- ✅ 32+ países cubiertos
- ✅ Panel BCV Venezuela
- ✅ Docker deployment

### v1.1 (Próximo)
- 🔄 Machine Learning para predicciones
- 🔄 Soporte para más monedas fiat
- 🔄 Integración con más exchanges
- 🔄 Mobile SDK (iOS/Android)

### v2.0 (Futuro)
- 📋 Sistema de alertas personalizadas
- 📋 API GraphQL
- 📋 Real-time websockets
- 📋 Multi-tenancy support

---

**Desarrollado con ❤️ para REME-LAT-USA**
