# 🔐 GitHub Secrets Configuration

Para que el deploy automático funcione, necesitas configurar estos secrets en tu repositorio de GitHub.

## 📍 Cómo agregar secrets:

1. Ve a: https://github.com/Marioagent/reme-lat-usa
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Agrega cada uno de los secrets listados abajo

---

## 🔑 Secrets Requeridos

### Para PWA (Vercel)

#### `VERCEL_TOKEN`
- **Descripción**: Token de autenticación de Vercel
- **Cómo obtenerlo**:
  1. Ve a https://vercel.com/account/tokens
  2. Click "Create Token"
  3. Nombre: `GitHub Actions`
  4. Scope: Full Account
  5. Copia el token generado

#### `VERCEL_ORG_ID`
- **Descripción**: ID de tu organización/team en Vercel
- **Valor actual**: `team_ANic0kKHxcXi9k4ZZKQh3YhJ`
- **Cómo verificarlo**:
  ```bash
  cat .vercel/project.json | grep orgId
  ```

#### `VERCEL_PROJECT_ID`
- **Descripción**: ID del proyecto reme-lat-usa-pro en Vercel
- **Valor actual**: `prj_e7zYPX1KPc4PrXjehQMeBP5CuU09`
- **Cómo verificarlo**:
  ```bash
  cat .vercel/project.json | grep projectId
  ```

---

### Para RAGSearch1 (Railway)

#### `RAILWAY_TOKEN`
- **Descripción**: Token de Railway para deploy automático
- **Cómo obtenerlo**:
  1. Ve a https://railway.app/account/tokens
  2. Click "Create Token"
  3. Nombre: `GitHub Actions`
  4. Copia el token generado

**ALTERNATIVA**: Si no usas Railway, puedes usar Render:

#### `RENDER_API_KEY` (Opcional - si usas Render)
- **Descripción**: API Key de Render
- **Cómo obtenerlo**:
  1. Ve a https://dashboard.render.com/account/api-keys
  2. Click "Create API Key"
  3. Copia la key generada

#### `RAGSEARCH1_URL`
- **Descripción**: URL de tu RAGSearch1 API en producción
- **Valores posibles**:
  - Railway: `https://ragsearch1-production.up.railway.app`
  - Render: `https://ragsearch1-api.onrender.com`
  - Vercel: `https://ragsearch1.vercel.app`

---

## ✅ Verificación de Secrets

Una vez agregados todos los secrets, verifica:

```bash
# Ve a tu repositorio GitHub
https://github.com/Marioagent/reme-lat-usa/settings/secrets/actions

# Deberías ver:
✓ VERCEL_TOKEN
✓ VERCEL_ORG_ID
✓ VERCEL_PROJECT_ID
✓ RAILWAY_TOKEN (o RENDER_API_KEY)
✓ RAGSEARCH1_URL
```

---

## 🚀 Después de Configurar

1. **Commit y Push** los workflows:
   ```bash
   git add .github/
   git commit -m "feat: Add automatic deployment workflows"
   git push origin main
   ```

2. **Verifica Actions**:
   - Ve a: https://github.com/Marioagent/reme-lat-usa/actions
   - Deberías ver el workflow "Full System Deploy" ejecutándose

3. **Monitor Deployment**:
   - Click en el workflow para ver el progreso
   - Verifica que ambos deploys (PWA + RAGSearch1) completen exitosamente

---

## 🔄 Deploy Manual (si necesitas)

Si algo falla o quieres forzar un deploy:

```bash
# Desde GitHub Actions
1. Ve a Actions → Full System Deploy
2. Click "Run workflow"
3. Selecciona branch: main
4. Elige qué desplegar (PWA, RAGSearch1, o ambos)
5. Click "Run workflow"
```

---

## 📝 Notas Importantes

- Los secrets son **privados** y nunca se muestran en logs
- GitHub Actions es **gratis** para repositorios públicos
- Los deployments se activan automáticamente en cada push a `main` o `master`
- Los workflows detectan cambios inteligentemente (solo deploya lo que cambió)

---

## 🆘 Troubleshooting

### Error: "VERCEL_TOKEN is not set"
→ Verifica que agregaste el secret correctamente en GitHub

### Error: "Railway deployment failed"
→ Verifica que RAILWAY_TOKEN sea válido y tenga permisos

### Error: "Health check failed"
→ Espera 1-2 minutos y reintenta (el servicio puede estar iniciando)

---

**Última actualización**: 2025-10-13
**Autor**: MarioAgent
