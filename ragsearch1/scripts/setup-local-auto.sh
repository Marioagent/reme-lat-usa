#!/bin/bash
# RAGSearch1 Local Setup - Completamente Automático (Sin Docker)
# Este script configura RAGSearch1 para desarrollo local sin requerir Docker

set -e

echo "🚀 RAGSearch1 Local Setup (Sin Docker)"
echo "======================================"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Navigate to ragsearch1 directory
cd "$(dirname "$0")/.."

# Step 1: Check Python
echo -e "\n${YELLOW}📋 Verificando Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 no está instalado${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo -e "${GREEN}✓ Python ${PYTHON_VERSION}${NC}"

# Step 2: Create virtual environment
echo -e "\n${YELLOW}🐍 Creando entorno virtual...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Entorno virtual creado${NC}"
else
    echo -e "${GREEN}✓ Entorno virtual ya existe${NC}"
fi

# Step 3: Activate and install dependencies
echo -e "\n${YELLOW}📦 Instalando dependencias...${NC}"
source venv/bin/activate

# Upgrade pip silently
pip install --upgrade pip --quiet

# Install requirements
echo "Instalando paquetes Python (esto puede tardar 1-2 minutos)..."
pip install -r requirements.txt --quiet

echo -e "${GREEN}✓ Dependencias instaladas${NC}"

# Step 4: Configure .env
echo -e "\n${YELLOW}⚙️  Configurando variables de entorno...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env

    # Configure for local development
    sed -i.bak 's/POSTGRES_HOST=postgres/POSTGRES_HOST=localhost/' .env
    sed -i.bak 's/REDIS_HOST=redis/REDIS_HOST=localhost/' .env
    sed -i.bak 's/CHROMA_HOST=chromadb/CHROMA_HOST=localhost/' .env
    sed -i.bak 's/CHROMA_PORT=8001/CHROMA_PORT=8001/' .env
    sed -i.bak 's/ENVIRONMENT=production/ENVIRONMENT=development/' .env
    sed -i.bak 's/SCHEDULER_ENABLE=true/SCHEDULER_ENABLE=false/' .env
    rm .env.bak 2>/dev/null || true

    # Generate SECRET_KEY
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    sed -i.bak "s/SECRET_KEY=your-secret-key-here/SECRET_KEY=${SECRET_KEY}/" .env
    rm .env.bak 2>/dev/null || true

    echo -e "${GREEN}✓ Archivo .env creado y configurado${NC}"
else
    echo -e "${GREEN}✓ Archivo .env ya existe${NC}"
fi

# Step 5: Create directories
echo -e "\n${YELLOW}📁 Creando directorios...${NC}"
mkdir -p data/chromadb logs backups
echo -e "${GREEN}✓ Directorios creados${NC}"

# Step 6: Check OpenAI API Key
echo -e "\n${YELLOW}🔑 Verificando OpenAI API Key...${NC}"
if grep -q "OPENAI_API_KEY=sk-" .env; then
    echo -e "${GREEN}✓ OpenAI API Key configurado${NC}"
else
    echo -e "${RED}⚠️  OpenAI API Key NO configurado${NC}"
    echo -e "${YELLOW}Por favor edita .env y agrega tu OPENAI_API_KEY${NC}"
    echo ""
    read -p "Presiona Enter para abrir el editor .env..."
    nano .env || vi .env || echo "Por favor edita manualmente: nano .env"
fi

# Step 7: Start ChromaDB
echo -e "\n${YELLOW}🗄️  Iniciando ChromaDB local...${NC}"
if pgrep -f "chroma run" > /dev/null; then
    echo -e "${GREEN}✓ ChromaDB ya está corriendo${NC}"
else
    echo "Iniciando ChromaDB en puerto 8001..."
    nohup chroma run --path ./data/chromadb --port 8001 > logs/chromadb.log 2>&1 &
    sleep 3

    if pgrep -f "chroma run" > /dev/null; then
        echo -e "${GREEN}✓ ChromaDB iniciado correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️  ChromaDB no pudo iniciar automáticamente${NC}"
        echo -e "${YELLOW}Puedes iniciarlo manualmente con: chroma run --path ./data/chromadb --port 8001${NC}"
    fi
fi

# Step 8: Create startup script
echo -e "\n${YELLOW}📝 Creando script de inicio...${NC}"
cat > start-ragsearch1.sh << 'EOF'
#!/bin/bash
# Start RAGSearch1 Local Development Server

cd "$(dirname "$0")"
source venv/bin/activate

echo "🚀 Iniciando RAGSearch1..."
echo "=========================="
echo ""
echo "API estará disponible en:"
echo "  - http://localhost:8000"
echo "  - Docs: http://localhost:8000/docs"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Check ChromaDB
if ! pgrep -f "chroma run" > /dev/null; then
    echo "Iniciando ChromaDB..."
    nohup chroma run --path ./data/chromadb --port 8001 > logs/chromadb.log 2>&1 &
    sleep 2
fi

# Start API
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
EOF

chmod +x start-ragsearch1.sh
echo -e "${GREEN}✓ Script de inicio creado: ./start-ragsearch1.sh${NC}"

# Step 9: Display summary
echo -e "\n${GREEN}✅ ¡RAGSearch1 configurado exitosamente!${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📊 PARA INICIAR EL SERVIDOR:${NC}"
echo "   ./start-ragsearch1.sh"
echo ""
echo -e "${YELLOW}📚 O manualmente:${NC}"
echo "   source venv/bin/activate"
echo "   uvicorn api.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo -e "${YELLOW}🌐 URLs disponibles:${NC}"
echo "   API:          http://localhost:8000"
echo "   Docs:         http://localhost:8000/docs"
echo "   Health:       http://localhost:8000/health"
echo ""
echo -e "${YELLOW}🧪 Probar el API:${NC}"
echo "   curl http://localhost:8000/health"
echo ""
echo -e "${YELLOW}📝 Notas importantes:${NC}"
echo "   - Este es un setup LOCAL (sin Docker)"
echo "   - PostgreSQL y Redis están deshabilitados"
echo "   - ChromaDB corre localmente en puerto 8001"
echo "   - ⚠️  Asegúrate de tener tu OPENAI_API_KEY en .env"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}¡Listo para usar! 🎉${NC}"
