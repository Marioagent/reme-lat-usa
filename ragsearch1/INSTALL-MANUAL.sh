#!/bin/bash
# RAGSearch1 - Instalación Manual Completa
# Ejecuta este script en tu terminal WSL2 con permisos sudo

echo "🚀 RAGSearch1 - Instalación Manual Completa"
echo "============================================"
echo ""
echo "Este script instalará:"
echo "  1. Python venv (para entornos virtuales)"
echo "  2. Dependencias de Python"
echo "  3. RAGSearch1 configurado y listo"
echo ""
echo "⚠️  REQUIERE CONTRASEÑA SUDO"
echo ""
read -p "Presiona Enter para continuar..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Install python3-venv
echo -e "\n${YELLOW}📦 Instalando python3-venv...${NC}"
sudo apt update
sudo apt install -y python3.12-venv python3-pip

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ python3-venv instalado${NC}"
else
    echo -e "${RED}❌ Error instalando python3-venv${NC}"
    exit 1
fi

# Step 2: Navigate to ragsearch1
cd "$(dirname "$0")/.."
echo -e "\n${YELLOW}📁 Directorio: $(pwd)${NC}"

# Step 3: Create virtual environment
echo -e "\n${YELLOW}🐍 Creando entorno virtual...${NC}"
python3 -m venv venv

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Entorno virtual creado${NC}"
else
    echo -e "${RED}❌ Error creando entorno virtual${NC}"
    exit 1
fi

# Step 4: Activate and install
echo -e "\n${YELLOW}📦 Instalando dependencias...${NC}"
source venv/bin/activate

pip install --upgrade pip --quiet
echo "Instalando paquetes (esto puede tardar 2-3 minutos)..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

# Step 5: Configure .env
echo -e "\n${YELLOW}⚙️  Configurando .env...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env

    # Local config
    sed -i 's/POSTGRES_HOST=postgres/POSTGRES_HOST=localhost/' .env
    sed -i 's/REDIS_HOST=redis/REDIS_HOST=localhost/' .env
    sed -i 's/CHROMA_HOST=chromadb/CHROMA_HOST=localhost/' .env
    sed -i 's/ENVIRONMENT=production/ENVIRONMENT=development/' .env
    sed -i 's/SCHEDULER_ENABLE=true/SCHEDULER_ENABLE=false/' .env

    # Generate SECRET_KEY
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    sed -i "s/SECRET_KEY=your-secret-key-here/SECRET_KEY=${SECRET_KEY}/" .env

    echo -e "${GREEN}✓ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✓ .env ya existe${NC}"
fi

# Step 6: Create directories
echo -e "\n${YELLOW}📁 Creando directorios...${NC}"
mkdir -p data/chromadb logs backups
echo -e "${GREEN}✓ Directorios creados${NC}"

# Step 7: Create startup script
echo -e "\n${YELLOW}📝 Creando script de inicio...${NC}"
cat > start-ragsearch1.sh << 'EOFSTART'
#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate

echo "🚀 Iniciando RAGSearch1..."
echo ""

# Start ChromaDB if not running
if ! pgrep -f "chroma run" > /dev/null; then
    echo "Iniciando ChromaDB..."
    nohup chroma run --path ./data/chromadb --port 8001 > logs/chromadb.log 2>&1 &
    sleep 2
fi

echo "API disponible en:"
echo "  http://localhost:8000"
echo "  http://localhost:8000/docs"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Start API
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
EOFSTART

chmod +x start-ragsearch1.sh
echo -e "${GREEN}✓ Script creado: ./start-ragsearch1.sh${NC}"

# Step 8: Prompt for OpenAI API Key
echo -e "\n${YELLOW}🔑 Configuración de OpenAI API Key${NC}"
echo ""
echo "RAGSearch1 requiere una OpenAI API Key para funcionar."
echo "Puedes obtenerla en: https://platform.openai.com/api-keys"
echo ""
read -p "¿Tienes tu OpenAI API Key? (s/n): " has_key

if [ "$has_key" = "s" ] || [ "$has_key" = "S" ]; then
    echo ""
    read -p "Ingresa tu OpenAI API Key: " api_key
    sed -i "s/OPENAI_API_KEY=sk-your-openai-api-key-here/OPENAI_API_KEY=${api_key}/" .env
    echo -e "${GREEN}✓ API Key configurada${NC}"
else
    echo -e "${YELLOW}⚠️  Recuerda editar .env y agregar tu OPENAI_API_KEY antes de usar RAGSearch1${NC}"
fi

# Step 9: Success message
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ¡RAGSearch1 instalado exitosamente!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📊 PARA INICIAR:${NC}"
echo "   cd $(pwd)"
echo "   ./start-ragsearch1.sh"
echo ""
echo -e "${YELLOW}🌐 URLs:${NC}"
echo "   API:    http://localhost:8000"
echo "   Docs:   http://localhost:8000/docs"
echo "   Health: http://localhost:8000/health"
echo ""
echo -e "${YELLOW}🧪 PROBAR:${NC}"
echo "   curl http://localhost:8000/health"
echo ""
echo -e "${GREEN}¡Listo! 🎉${NC}"
