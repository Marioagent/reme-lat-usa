#!/bin/bash
# RAGSearch1 Installation - Part 2 (No sudo required)
# Run this AFTER installing python3-venv

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 RAGSearch1 - Instalación Automática (Parte 2)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Navigate to ragsearch1
cd "$(dirname "$0")/.."

# Check if python3-venv is installed
echo -e "${YELLOW}📋 Verificando python3-venv...${NC}"
if python3 -m venv --help &> /dev/null; then
    echo -e "${GREEN}✓ python3-venv está instalado${NC}"
else
    echo -e "${RED}❌ python3-venv NO está instalado${NC}"
    echo ""
    echo "Por favor ejecuta primero:"
    echo "  sudo apt update && sudo apt install -y python3.12-venv python3-pip"
    echo ""
    exit 1
fi

# Create virtual environment
echo ""
echo -e "${YELLOW}🐍 Creando entorno virtual...${NC}"
if [ -d "venv" ]; then
    echo -e "${YELLOW}  Eliminando venv anterior...${NC}"
    rm -rf venv
fi

python3 -m venv venv

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Entorno virtual creado${NC}"
else
    echo -e "${RED}❌ Error creando entorno virtual${NC}"
    exit 1
fi

# Activate virtual environment
echo ""
echo -e "${YELLOW}📦 Activando entorno e instalando dependencias...${NC}"
source venv/bin/activate

# Upgrade pip
echo -e "  Actualizando pip..."
pip install --upgrade pip --quiet

# Install requirements
echo -e "  Instalando paquetes Python (puede tardar 2-3 minutos)..."
echo -e "${YELLOW}  Por favor espera...${NC}"

pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    echo ""
    echo "Intenta manualmente:"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
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
echo "  ./start-ragsearch1.sh"
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
echo "  1. Inicia el servidor: ./start-ragsearch1.sh"
echo "  2. Abre en navegador: http://localhost:8000/docs"
echo "  3. Trigger colección: curl -X POST http://localhost:8000/api/v1/admin/collection/run"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}¡Todo listo! 🎉${NC}"
echo ""
