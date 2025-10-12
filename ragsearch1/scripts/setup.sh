#!/bin/bash
# RAGSearch1 Setup Script
# Automated installation and configuration

set -e

echo "🚀 RAGSearch1 Setup Script"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo -e "${RED}❌ Please don't run this script as root${NC}"
  exit 1
fi

# Step 1: Check prerequisites
echo -e "\n${YELLOW}📋 Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
else
    echo -e "${GREEN}✓ Docker installed${NC}"
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
else
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
fi

# Check Python (for local development)
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓ Python ${PYTHON_VERSION} installed${NC}"
else
    echo -e "${YELLOW}⚠️  Python not installed (optional for local development)${NC}"
fi

# Step 2: Create .env file from example
echo -e "\n${YELLOW}⚙️  Configuring environment...${NC}"

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env and add your API keys:${NC}"
        echo "   - OPENAI_API_KEY"
        echo "   - PLAID_CLIENT_ID and PLAID_SECRET (optional)"
        echo "   - BELVO_SECRET_ID and BELVO_SECRET_PASSWORD (optional)"
        echo ""
        read -p "Press enter to continue after editing .env file..."
    else
        echo -e "${RED}❌ .env.example file not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Step 3: Generate secure SECRET_KEY if not set
echo -e "\n${YELLOW}🔐 Checking SECRET_KEY...${NC}"

if grep -q "SECRET_KEY=your-secret-key-here" .env; then
    SECRET_KEY=$(openssl rand -hex 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/SECRET_KEY=your-secret-key-here/SECRET_KEY=${SECRET_KEY}/" .env
    else
        # Linux
        sed -i "s/SECRET_KEY=your-secret-key-here/SECRET_KEY=${SECRET_KEY}/" .env
    fi
    echo -e "${GREEN}✓ Generated secure SECRET_KEY${NC}"
else
    echo -e "${GREEN}✓ SECRET_KEY already configured${NC}"
fi

# Step 4: Create required directories
echo -e "\n${YELLOW}📁 Creating directories...${NC}"

mkdir -p data/postgres data/redis data/chromadb logs backups
echo -e "${GREEN}✓ Created data directories${NC}"

# Step 5: Build Docker images
echo -e "\n${YELLOW}🐳 Building Docker images...${NC}"

docker-compose build --no-cache
echo -e "${GREEN}✓ Docker images built successfully${NC}"

# Step 6: Start services
echo -e "\n${YELLOW}🚀 Starting services...${NC}"

docker-compose up -d
echo -e "${GREEN}✓ Services started${NC}"

# Step 7: Wait for services to be healthy
echo -e "\n${YELLOW}⏳ Waiting for services to be ready...${NC}"

sleep 10

# Check health
RETRIES=30
until docker-compose ps | grep -q "healthy" || [ $RETRIES -eq 0 ]; do
  echo "Waiting for services... ($RETRIES attempts remaining)"
  sleep 5
  RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
    echo -e "${RED}❌ Services failed to start properly${NC}"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

echo -e "${GREEN}✓ All services are healthy${NC}"

# Step 8: Display status
echo -e "\n${GREEN}✅ RAGSearch1 setup complete!${NC}"
echo -e "\n${YELLOW}📊 Service URLs:${NC}"
echo "   API:        http://localhost:8000"
echo "   API Docs:   http://localhost:8000/docs"
echo "   Health:     http://localhost:8000/health"
echo ""
echo -e "${YELLOW}💡 Useful commands:${NC}"
echo "   View logs:       docker-compose logs -f"
echo "   Stop services:   docker-compose stop"
echo "   Restart:         docker-compose restart"
echo "   Full cleanup:    docker-compose down -v"
echo ""
echo -e "${YELLOW}📚 Next steps:${NC}"
echo "   1. Visit http://localhost:8000/docs to see the API documentation"
echo "   2. Run initial data collection: curl -X POST http://localhost:8000/api/v1/admin/collection/run"
echo "   3. Check collection status: curl http://localhost:8000/api/v1/admin/stats"
echo ""
echo -e "${GREEN}Happy searching! 🔍${NC}"
