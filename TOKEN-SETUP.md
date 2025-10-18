# 🔑 Crear Token GitHub con Scope Workflow - 5 MINUTOS

## Paso 1: Ir a crear token

Abre esta URL en tu navegador:
```
https://github.com/settings/tokens/new
```

## Paso 2: Configurar el token

Llena el formulario:

### Note (nombre del token):
```
Claude Code - Workflow Access
```

### Expiration (vencimiento):
Selecciona: **90 days** (o el que prefieras)

### Select scopes (permisos):
Marca estas 2 casillas:
- ✅ **repo** (Full control of private repositories)
- ✅ **workflow** (Update GitHub Action workflows) ← IMPORTANTE

## Paso 3: Generar token

1. Scroll hasta abajo
2. Click en **"Generate token"** (botón verde)
3. **COPIA EL TOKEN INMEDIATAMENTE** (solo se muestra una vez)
   - Empieza con `ghp_...`
   - Tiene ~40 caracteres

## Paso 4: Actualizar git remote

Abre terminal y ejecuta:

```bash
cd /home/usermario/Desktop/reme-lat-usa

# Remover remote actual
git remote remove origin

# Agregar con nuevo token (reemplaza TU-NUEVO-TOKEN)
git remote add origin https://TU-NUEVO-TOKEN@github.com/Marioagent/reme-lat-usa.git

# Verificar
git remote -v
```

## Paso 5: Push con workflows

```bash
# Push del commit con workflows
git push origin master:main

# Si pregunta algo, responde 'yes'
```

## ✅ Verificar

1. Ve a: https://github.com/Marioagent/reme-lat-usa/actions
2. Deberías ver los workflows disponibles

---

## 🔒 Seguridad del Token

- El token es como una contraseña
- Solo tú lo tienes
- Git lo guarda localmente en `.git/config`
- Puedes revocarlo después en: https://github.com/settings/tokens

---

**Tiempo total:** 5 minutos
**Próximo paso:** Configurar secrets en GitHub
