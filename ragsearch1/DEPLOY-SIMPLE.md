# 🚀 RAGSearch1 Deployment Guide - SIMPLE

## Quick Deploy to Vercel (FASTEST)

### Option 1: Deploy Now via CLI
```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
vercel --prod
```

### Option 2: Deploy via GitHub + Vercel Dashboard

1. **Push to GitHub**:
```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
git init
git add .
git commit -m "feat: RAGSearch1 API ready for deployment"
git remote add origin https://github.com/Marioagent/ragsearch1.git
git push -u origin master
```

2. **Connect to Vercel**:
- Go to https://vercel.com/dashboard
- Click "Add New" → "Project"
- Import from GitHub: `Marioagent/ragsearch1`
- Framework: Other
- Build Command: Leave empty
- Output Directory: Leave empty

3. **Add Environment Variables**:
```
OPENAI_API_KEY=your-openai-api-key-here
ENVIRONMENT=production
DEBUG=false
CHROMA_PERSIST_DIR=/tmp/chromadb
```

4. **Deploy**!

---

## Alternative: Deploy to Render (FREE)

### Step 1: Create render.yaml (Already created ✅)

### Step 2: Push to GitHub

### Step 3: Connect to Render
1. Go to https://render.com/
2. New → Web Service
3. Connect GitHub repo
4. Select `ragsearch1`
5. Environment: Python 3
6. Build Command: `pip install -r requirements.txt`
7. Start Command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

### Step 4: Add Environment Variables
- OPENAI_API_KEY
- ENVIRONMENT=production
- DEBUG=false

### Step 5: Deploy!

---

## After Deployment

### Get Your API URL
- Vercel: `https://ragsearch1.vercel.app`
- Render: `https://ragsearch1-api.onrender.com`

### Update REME-LAT-USA
```bash
# Go to Vercel Dashboard for reme-lat-usa-pro
# Settings → Environment Variables
# Add:
RAGSEARCH1_API_URL=https://ragsearch1.vercel.app
# (or your Render URL)

# Then redeploy:
vercel --prod
```

---

## Test Integration
```bash
# Test RAGSearch1 is live
curl https://ragsearch1.vercel.app/health

# Test from REME-LAT-USA
curl https://reme-lat-usa-pro.vercel.app/api/rag/bcv
curl https://reme-lat-usa-pro.vercel.app/api/rag/search -X POST -d '{"query":"banks"}'
```

---

**Current Status**: Ready to deploy!
