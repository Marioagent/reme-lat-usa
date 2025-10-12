# 🚀 RAGSearch1 - Setup Local (Sin Docker)

## Opción 1: Instalar Docker Desktop en Windows

### Pasos para instalar Docker Desktop:

1. **Descarga Docker Desktop para Windows:**
   - Ve a: https://www.docker.com/products/docker-desktop/
   - Descarga e instala Docker Desktop
   - Asegúrate de habilitar la integración con WSL2

2. **Configura Docker Desktop con WSL2:**
   - Abre Docker Desktop
   - Ve a Settings → Resources → WSL Integration
   - Activa tu distribución WSL (Ubuntu)
   - Aplica y reinicia

3. **Verifica en WSL2:**
   ```bash
   docker --version
   docker-compose --version
   ```

4. **Ejecuta RAGSearch1:**
   ```bash
   cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
   ./scripts/setup.sh
   ```

---

## Opción 2: Instalación Manual de Docker en WSL2

Si prefieres instalar Docker directamente en WSL2 (requiere contraseña sudo):

```bash
# 1. Actualizar paquetes
sudo apt-get update

# 2. Instalar dependencias
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 3. Agregar llave GPG de Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Agregar repositorio de Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Instalar Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 6. Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# 7. Iniciar servicio Docker
sudo service docker start

# 8. Verificar instalación
docker --version
docker compose version
```

---

## Opción 3: Setup Local Python (SIN DOCKER) ⚡

### Instalación Rápida (5 minutos)

```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1

# 1. Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# 2. Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

# 3. Configurar .env
cp .env.example .env
nano .env  # Agregar OPENAI_API_KEY

# 4. Crear directorios
mkdir -p data/chromadb logs

# 5. Iniciar ChromaDB local
chroma run --path ./data/chromadb --port 8001 &

# 6. Iniciar API
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### Verificación

```bash
# En otra terminal
curl http://localhost:8000/health

# Documentación interactiva
open http://localhost:8000/docs
```

### Ventajas del Setup Local:
- ✅ No requiere Docker
- ✅ Más rápido para desarrollo
- ✅ Menor uso de recursos
- ✅ Debugging más fácil

### Desventajas:
- ❌ No incluye PostgreSQL (usa ChromaDB solo)
- ❌ No incluye Redis (cache en memoria)
- ❌ No incluye monitoreo (Prometheus/Grafana)

---

## Recomendación

**Para desarrollo/testing rápido:** Usa Opción 3 (Setup Local Python)

**Para producción completa:** Usa Opción 1 (Docker Desktop) u Opción 2 (Docker en WSL2)

---

## Próximos Pasos

Una vez que Docker esté instalado (cualquier opción), ejecuta:

```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
./scripts/setup.sh
```

O si usas setup local:

```bash
cd /home/usermario/Desktop/reme-lat-usa/ragsearch1
source venv/bin/activate
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```
