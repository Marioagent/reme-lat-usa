#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate

clear
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║              🚀 Iniciando RAGSearch1...                  ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Iniciar ChromaDB
if ! pgrep -f "chroma run" > /dev/null; then
    echo "📊 Iniciando ChromaDB..."
    nohup chroma run --path ./data/chromadb --port 8001 > logs/chromadb.log 2>&1 &
    sleep 3
    echo "✓ ChromaDB iniciado en puerto 8001"
else
    echo "✓ ChromaDB ya está corriendo"
fi

echo ""
echo "🌐 URLs disponibles:"
echo "   • API:    http://localhost:8000"
echo "   • Docs:   http://localhost:8000/docs"
echo "   • Health: http://localhost:8000/health"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Iniciar API
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
