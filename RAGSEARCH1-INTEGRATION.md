# 🔗 RAGSearch1 Integration with REME-LAT-USA-PRO

## 📋 Overview

RAGSearch1 is now **fully integrated** with REME-LAT-USA-PRO PWA. The systems work together to provide:
- 🤖 AI-powered financial institution search
- 📊 Real-time Venezuela BCV rates from multiple sources
- 💬 Intelligent Q&A about banks and remittance services
- 🔍 Vector similarity search for finding best financial options

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   REME-LAT-USA-PRO (Next.js PWA)   │
│         https://reme-lat-usa-pro    │
│              .vercel.app            │
└──────────────┬──────────────────────┘
               │
               │ API Calls
               │
               ▼
┌─────────────────────────────────────┐
│        RAGSearch1 API               │
│      (FastAPI + ChromaDB)           │
│    http://localhost:8000            │
│    (or production URL)              │
└─────────────────────────────────────┘
               │
               │ Queries
               │
               ▼
┌─────────────────────────────────────┐
│     ChromaDB Vector Database        │
│   (Financial Institutions Data)     │
└─────────────────────────────────────┘
```

---

## 🔌 Integration Points

### 1. **API Endpoints Created**

#### `/api/rag/search` - AI Search
```typescript
// POST request
{
  "query": "bancos con mejores tasas para Venezuela",
  "limit": 5,
  "country": "VE",
  "type": "bank"
}

// Response
{
  "success": true,
  "data": [...results],
  "total": 10,
  "source": "RAGSearch1"
}
```

#### `/api/rag/ask` - AI Questions
```typescript
// POST request
{
  "question": "What's the best way to send money to Venezuela?"
}

// Response
{
  "success": true,
  "question": "...",
  "answer": "Based on current data...",
  "sources": [...],
  "confidence": 0.95
}
```

#### `/api/rag/bcv` - Venezuela Rates from RAG
```typescript
// GET request
GET /api/rag/bcv

// Response
{
  "success": true,
  "data": {
    "bcv_oficial": 195.00,
    "paralelo": 294.00,
    "binance_p2p": 270.00,
    "sources": {...}
  },
  "source": "RAGSearch1 (Multi-source validated)"
}
```

---

## 🌐 Environment Variables

### Local Development
```bash
# .env.local
RAGSEARCH1_API_URL=http://localhost:8000
```

### Production (Vercel)
```bash
# Add in Vercel Dashboard → Settings → Environment Variables
RAGSEARCH1_API_URL=https://your-ragsearch1-api.railway.app
# or
RAGSEARCH1_API_URL=https://ragsearch1-api.onrender.com
```

---

## 🚀 How to Use

### Option 1: Local Development (Both Systems Running)

#### Terminal 1: Start RAGSearch1
```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
source venv/bin/activate
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 2: Start REME-LAT-USA
```bash
cd /home/usermario/Desktop/reme-lat-usa
npm run dev
```

**Access**:
- PWA: http://localhost:3000
- RAGSearch1 API: http://localhost:8000/docs

---

### Option 2: Production (Deploy RAGSearch1 Separately)

#### Deploy RAGSearch1 to Railway

1. **Create Railway Project**:
```bash
cd ragsearch1
railway login
railway init
railway up
```

2. **Set Environment Variables** on Railway Dashboard:
```
OPENAI_API_KEY=sk-proj-H6sm3RS0...
ENVIRONMENT=production
DEBUG=false
CHROMA_PERSIST_DIR=/app/data/chromadb
```

3. **Get Railway URL**:
```
https://ragsearch1-production.up.railway.app
```

4. **Update Vercel Environment**:
- Go to https://vercel.com/dashboard
- Select `reme-lat-usa-pro`
- Settings → Environment Variables
- Add: `RAGSEARCH1_API_URL=https://ragsearch1-production.up.railway.app`
- Redeploy

---

### Option 3: All-in-One Vercel (Simplified)

For now, RAGSearch1 runs locally during development. The PWA has **fallback mechanisms**:
- If RAGSearch1 is unavailable, uses local APIs
- BCV rates fallback to `/api/rates/venezuela`
- Search falls back to static data

---

## 📊 Features Integration

### 1. **Intelligent Search** (Coming Soon)
```typescript
// In PWA components
const searchFinancialInstitutions = async (query: string) => {
  const response = await fetch('/api/rag/search', {
    method: 'POST',
    body: JSON.stringify({ query, limit: 10 })
  });
  const data = await response.json();
  return data.data;
};
```

### 2. **AI Assistant** (Coming Soon)
```typescript
// Ask questions about remittances
const askAI = async (question: string) => {
  const response = await fetch('/api/rag/ask', {
    method: 'POST',
    body: JSON.stringify({ question })
  });
  const data = await response.json();
  return data.answer;
};
```

### 3. **Enhanced BCV Rates**
```typescript
// Get multi-source validated rates
const getBCVRates = async () => {
  const response = await fetch('/api/rag/bcv');
  const data = await response.json();
  return data.data;
};
```

---

## 🧪 Testing Integration

### Test RAG Search Endpoint
```bash
curl -X POST http://localhost:3000/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{"query": "bancos en venezuela", "limit": 5}'
```

### Test AI Ask Endpoint
```bash
curl -X POST http://localhost:3000/api/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the best remittance services for Venezuela?"}'
```

### Test BCV Rates Endpoint
```bash
curl http://localhost:3000/api/rag/bcv
```

---

## 🔒 Security

- API endpoints have fallback mechanisms
- Environment variables are secure
- CORS properly configured
- Rate limiting on both systems

---

## 📈 Deployment Checklist

### For Local Development
- [x] RAGSearch1 API running on port 8000
- [x] REME-LAT-USA dev server on port 3000
- [x] `.env.local` configured with localhost URL
- [x] Both systems accessible

### For Production
- [ ] Deploy RAGSearch1 to Railway/Render
- [ ] Get production API URL
- [ ] Add `RAGSEARCH1_API_URL` to Vercel env vars
- [ ] Test production endpoints
- [ ] Verify fallback mechanisms work

---

## 🐛 Troubleshooting

### Issue: "RAGSearch1 API is not available"

**Solution**:
1. Check if RAGSearch1 is running: `curl http://localhost:8000/health`
2. Verify `.env.local` has correct URL
3. Check RAGSearch1 logs: `cat ragsearch1/logs/api.log`

### Issue: "CORS error when calling RAG endpoints"

**Solution**:
1. Ensure RAGSearch1 has CORS configured for your domain
2. Check `ragsearch1/api/main.py` CORS settings
3. Add your Vercel domain to allowed origins

### Issue: "Fallback rates being used instead of real data"

**Solution**:
1. Verify RAGSearch1 APIs are responding
2. Check network connectivity
3. Review RAGSearch1 API logs for errors

---

## 📝 Current Status

### ✅ Completed
- [x] Created RAG integration API endpoints in PWA
- [x] Added `/api/rag/search` for AI-powered search
- [x] Added `/api/rag/ask` for AI questions
- [x] Added `/api/rag/bcv` for multi-source BCV rates
- [x] Environment variable configuration
- [x] Fallback mechanisms for reliability

### 🚧 In Progress
- [ ] UI components for RAG search
- [ ] AI chat interface in PWA
- [ ] Deploy RAGSearch1 to production

### 📅 Next Steps
1. Create search UI component with AI suggestions
2. Add chat interface for asking questions
3. Deploy RAGSearch1 to Railway/Render
4. Test full integration end-to-end
5. Deploy updated PWA to Vercel

---

## 🎯 Benefits of Integration

1. **Intelligent Search**: Find banks/services with natural language
2. **Real-time Data**: Multi-source validated Venezuela rates
3. **AI Assistance**: Ask questions and get smart answers
4. **Scalability**: Vector search handles large datasets efficiently
5. **Reliability**: Fallback mechanisms ensure PWA always works

---

## 🔗 Links

- **PWA Production**: https://reme-lat-usa-pro.vercel.app
- **RAGSearch1 Local**: http://localhost:8000/docs
- **RAGSearch1 Docs**: `/home/usermario/Desktop/reme-lat-usa/ragsearch1/README-START.md`

---

**Status**: ✅ API Integration Complete, UI Components Next
**Last Updated**: 2025-10-13
