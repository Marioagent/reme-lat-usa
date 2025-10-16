#!/bin/bash
# RAGSearch1 - Script de instalación final
# Ejecuta esto DESPUÉS de instalar python3.12-venv

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

clear

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}║           🚀 RAGSearch1 - Instalación Final              ║${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

cd "$(dirname "$0")"

# Step 1: Verificar python3-venv
echo -e "${YELLOW}📋 Paso 1/10: Verificando python3-venv...${NC}"
if python3 -m venv --help &> /dev/null; then
    echo -e "${GREEN}✓ python3-venv instalado correctamente${NC}"
else
    echo -e "${RED}✗ python3-venv NO está instalado${NC}"
    echo ""
    echo "Por favor ejecuta primero:"
    echo "  sudo apt update && sudo apt install -y python3.12-venv python3-pip"
    echo ""
    exit 1
fi
sleep 1

# Step 2: Crear entorno virtual
echo ""
echo -e "${YELLOW}📋 Paso 2/10: Creando entorno virtual...${NC}"
if [ -d "venv" ]; then
    echo -e "${YELLOW}  Eliminando venv anterior...${NC}"
    rm -rf venv
fi
python3 -m venv venv
echo -e "${GREEN}✓ Entorno virtual creado${NC}"
sleep 1

# Step 3: Activar y actualizar pip
echo ""
echo -e "${YELLOW}📋 Paso 3/10: Activando entorno...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Entorno activado${NC}"
sleep 1

echo ""
echo -e "${YELLOW}📋 Paso 4/10: Actualizando pip...${NC}"
pip install --upgrade pip --quiet
echo -e "${GREEN}✓ pip actualizado${NC}"
sleep 1

# Step 4: Instalar dependencias
echo ""
echo -e "${YELLOW}📋 Paso 5/10: Instalando dependencias Python...${NC}"
echo -e "${YELLOW}  (Esto tomará 2-3 minutos, por favor espera)${NC}"
echo ""
pip install -r requirements.txt
echo ""
echo -e "${GREEN}✓ Dependencias instaladas${NC}"
sleep 1

# Step 5: Configurar .env
echo ""
echo -e "${YELLOW}📋 Paso 6/10: Configurando .env...${NC}"
if [ -f .env ]; then
    cp .env .env.backup.$(date +%s)
    echo -e "${YELLOW}  .env anterior respaldado${NC}"
fi
cp .env.example .env
sed -i 's/POSTGRES_HOST=postgres/POSTGRES_HOST=localhost/' .env
sed -i 's/REDIS_HOST=redis/REDIS_HOST=localhost/' .env
sed -i 's/CHROMA_HOST=chromadb/CHROMA_HOST=localhost/' .env
sed -i 's/ENVIRONMENT=production/ENVIRONMENT=development/' .env
sed -i 's/SCHEDULER_ENABLE=true/SCHEDULER_ENABLE=false/' .env
echo -e "${GREEN}✓ .env configurado${NC}"
sleep 1

# Step 6: Generar SECRET_KEY
echo ""
echo -e "${YELLOW}📋 Paso 7/10: Generando SECRET_KEY...${NC}"
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i "s/SECRET_KEY=your-secret-key-here/SECRET_KEY=${SECRET_KEY}/" .env
echo -e "${GREEN}✓ SECRET_KEY generado${NC}"
sleep 1

# Step 7: Crear directorios
echo ""
echo -e "${YELLOW}📋 Paso 8/10: Creando directorios...${NC}"
mkdir -p data/chromadb logs backups
echo -e "${GREEN}✓ Directorios creados${NC}"
sleep 1

# Step 8: Prompt para OpenAI API Key
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║             🔑 OpenAI API Key Requerida                  ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Paso 9/10: Configurando OpenAI API Key...${NC}"
echo ""
echo "RAGSearch1 necesita una OpenAI API Key para funcionar."
echo ""
echo -e "${YELLOW}Obtener API Key:${NC}"
echo "  → https://platform.openai.com/api-keys"
echo ""
read -p "¿Tienes tu OpenAI API Key? (s/n): " has_key

if [ "$has_key" = "s" ] || [ "$has_key" = "S" ]; then
    echo ""
    read -p "Pega tu OpenAI API Key aquí: " api_key
    if [ -z "$api_key" ]; then
        echo -e "${RED}✗ No se ingresó API Key${NC}"
        echo -e "${YELLOW}Recuerda editarla después: nano .env${NC}"
    else
        sed -i "s/OPENAI_API_KEY=sk-your-openai-api-key-here/OPENAI_API_KEY=${api_key}/" .env
        echo -e "${GREEN}✓ API Key configurada${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Debes editar .env manualmente:${NC}"
    echo "  nano .env"
    echo "  Busca: OPENAI_API_KEY"
    echo "  Pega tu key: sk-tu-key-aqui"
fi
sleep 1

# Step 9: Crear script de inicio
echo ""
echo -e "${YELLOW}📋 Paso 10/10: Creando script de inicio...${NC}"
cat > start.sh << 'EOFSTART'
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
EOFSTART

chmod +x start.sh
echo -e "${GREEN}✓ Script de inicio creado: ./start.sh${NC}"
sleep 1

# Final message
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${GREEN}║            ✅ ¡RAGSearch1 Instalado Exitosamente!        ║${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📊 PARA INICIAR EL SERVIDOR:${NC}"
echo ""
echo -e "   ${GREEN}./start.sh${NC}"
echo ""
echo -e "${YELLOW}🧪 PARA VERIFICAR (en otra terminal):${NC}"
echo ""
echo "   curl http://localhost:8000/health"
echo ""
echo -e "${YELLOW}🌐 DOCUMENTACIÓN INTERACTIVA:${NC}"
echo ""
echo "   http://localhost:8000/docs"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}¡Todo listo! 🎉${NC}"
echo ""
