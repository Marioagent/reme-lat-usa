# 🔐 GitHub Authentication Setup

El push requiere autenticación. Aquí están tus opciones:

---

## ✅ OPCIÓN 1: Personal Access Token (Más Fácil)

### Paso 1: Crear Token
1. Ve a: https://github.com/settings/tokens
2. Click en **"Generate new token"** → **"Generate new token (classic)"**
3. Nombre: `REME-LAT-USA-Deploy`
4. Expiration: `90 days` (o el que prefieras)
5. Selecciona scopes:
   - ✅ **repo** (todos los sub-items)
6. Click **"Generate token"**
7. **COPIA EL TOKEN** (solo se muestra una vez)

### Paso 2: Push con Token
```bash
cd /home/usermario/reme-lat-usa-pro

# Configura el remote con token
git remote set-url origin https://TU_TOKEN@github.com/Marioagent/reme-lat-usa.git

# Push
git push -u origin master
```

**Reemplaza `TU_TOKEN`** con el token que copiaste.

---

## ✅ OPCIÓN 2: SSH Key (Más Seguro)

### Paso 1: Generar SSH Key (si no tienes)
```bash
ssh-keygen -t ed25519 -C "reme@lat-usa.com"
# Presiona ENTER 3 veces (usa defaults)

# Muestra tu clave pública
cat ~/.ssh/id_ed25519.pub
```

### Paso 2: Agregar a GitHub
1. Copia la salida del comando anterior (empieza con `ssh-ed25519`)
2. Ve a: https://github.com/settings/keys
3. Click **"New SSH key"**
4. Title: `WSL REME-LAT-USA`
5. Pega la clave
6. Click **"Add SSH key"**

### Paso 3: Cambiar Remote a SSH
```bash
cd /home/usermario/reme-lat-usa-pro
git remote set-url origin git@github.com:Marioagent/reme-lat-usa.git
git push -u origin master
```

---

## ✅ OPCIÓN 3: GitHub CLI (Automático)

```bash
# Instalar gh (si no lo tienes)
sudo apt update
sudo apt install gh -y

# Autenticar
gh auth login

# Push
cd /home/usermario/reme-lat-usa-pro
git push -u origin master
```

---

## 🚀 Después del Push

Una vez que el código esté en GitHub:

1. Verifica en: https://github.com/Marioagent/reme-lat-usa
2. Ve a: https://vercel.com/new
3. Click **"Import Git Repository"**
4. Selecciona `reme-lat-usa`
5. Click **"Deploy"**

**¡Y listo!** Tu app estará en vivo en 2-3 minutos.

---

## ⚡ Atajo Rápido (GitHub CLI)

Si quieres ir súper rápido:
```bash
cd /home/usermario/reme-lat-usa-pro
gh auth login
gh repo create Marioagent/reme-lat-usa --public --source=. --push
```

---

**¿Cuál método prefieres?** Dime y te guío paso a paso.
