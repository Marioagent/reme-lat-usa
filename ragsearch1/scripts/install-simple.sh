#!/bin/bash
# RAGSearch1 - Instalación Simplificada (Sin venv, usa --user)
# Esta versión instala los paquetes directamente con pip --user

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 RAGSearch1 - Instalación Simplificada${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Esta versión instala los paquetes directamente sin virtualenv"
echo ""

# Navigate to ragsearch1
cd "$(dirname "$0")/.."

# Check Python version
echo -e "${YELLOW}📋 Verificando Python...${NC}"
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✓ Python ${PYTHON_VERSION}${NC}"

# Install dependencies with --user
echo ""
echo -e "${YELLOW}📦 Instalando dependencias Python...${NC}"
echo -e "${YELLOW}(Esto puede tardar 3-5 minutos)${NC}"
echo ""

pip3 install --user --upgrade pip --quiet
pip3 install --user -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    echo ""
    echo "Intenta manualmente:"
    echo "  pip3 install --user -r requirements.txt"
    exit 1
fi

# Configure .env
echo ""
echo -e "${YELLOW}⚙️  Configurando variables de entorno...${NC}"

if [ -f .env ]; then
    echo -e "${YELLOW}  Respaldando .env existente...${NC}"
    cp .env .env.backup.$(date +%s)
fi

cp .env.example .env

# Configure for local development
sed -i 's/POSTGRES_HOST=postgres/POSTGRES_HOST=localhost/' .env
sed -i 's/REDIS_HOST=redis/REDIS_HOST=localhost/' .env
sed -i 's/CHROMA_HOST=chromadb/CHROMA_HOST=localhost/' .env
sed -i 's/ENVIRONMENT=production/ENVIRONMENT=development/' .env
sed -i 's/SCHEDULER_ENABLE=true/SCHEDULER_ENABLE=false/' .env

# Generate SECRET_KEY
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i "s/SECRET_KEY=your-secret-key-here/SECRET_KEY=${SECRET_KEY}/" .env

echo -e "${GREEN}✓ Archivo .env configurado${NC}"

# Create directories
echo ""
echo -e "${YELLOW}📁 Creando directorios...${NC}"
mkdir -p data/chromadb logs backups
echo -e "${GREEN}✓ Directorios creados${NC}"

# Create startup script (without venv activation)
echo ""
echo -e "${YELLOW}📝 Creando script de inicio...${NC}"
cat > start-ragsearch1-simple.sh << 'EOFSTART'
#!/bin/bash
cd "$(dirname "$0")"

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

# Add user site-packages to PATH
export PATH="$HOME/.local/bin:$PATH"
export PYTHONPATH="$(pwd):$PYTHONPATH"

# Start API
python3 -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
EOFSTART

chmod +x start-ragsearch1-simple.sh
echo -e "${GREEN}✓ Script creado: ./start-ragsearch1-simple.sh${NC}"

# Prompt for OpenAI API Key
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🔑 Configuración de OpenAI API Key${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "RAGSearch1 requiere una OpenAI API Key para funcionar."
echo ""
echo -e "${YELLOW}Obtener API Key:${NC}"
echo "  1. Ve a: https://platform.openai.com/api-keys"
echo "  2. Crea una nueva API key"
echo "  3. Cópiala (empieza con 'sk-')"
echo ""
read -p "¿Tienes tu OpenAI API Key lista? (s/n): " has_key

if [ "$has_key" = "s" ] || [ "$has_key" = "S" ] || [ "$has_key" = "y" ] || [ "$has_key" = "Y" ]; then
    echo ""
    read -p "Pega tu OpenAI API Key aquí: " api_key

    if [ -z "$api_key" ]; then
        echo -e "${YELLOW}⚠️  No se ingresó API Key${NC}"
        echo "Recuerda editarla después en .env"
    else
        sed -i "s/OPENAI_API_KEY=sk-your-openai-api-key-here/OPENAI_API_KEY=${api_key}/" .env
        echo -e "${GREEN}✓ API Key configurada${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Recuerda agregar tu OPENAI_API_KEY en .env antes de usar RAGSearch1${NC}"
    echo ""
    echo "Edita el archivo con:"
    echo "  nano .env"
fi

# Display final instructions
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ¡RAGSearch1 instalado correctamente!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📊 PARA INICIAR EL SERVIDOR:${NC}"
echo ""
echo "  ./start-ragsearch1-simple.sh"
echo ""
echo -e "${YELLOW}🌐 URLs (después de iniciar):${NC}"
echo "  • API:    http://localhost:8000"
echo "  • Docs:   http://localhost:8000/docs"
echo "  • Health: http://localhost:8000/health"
echo ""
echo -e "${YELLOW}🧪 VERIFICAR (en otra terminal):${NC}"
echo "  curl http://localhost:8000/health"
echo ""
echo -e "${YELLOW}📚 PRIMEROS PASOS:${NC}"
echo "  1. Inicia el servidor: ./start-ragsearch1-simple.sh"
echo "  2. Abre en navegador: http://localhost:8000/docs"
echo "  3. Trigger colección: curl -X POST http://localhost:8000/api/v1/admin/collection/run"
echo ""
echo -e "${YELLOW}📝 NOTA:${NC}"
echo "  Los paquetes se instalaron con --user en ~/.local/"
echo "  No se usó virtualenv para simplificar la instalación"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}¡Todo listo! 🎉${NC}"
echo ""
