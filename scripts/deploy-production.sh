#!/bin/bash
# =============================================================================
# Deploy Script para ERP ACE - Servidor de Producción
# Servidor: 144.126.150.120 (vmi1759824.contaboserver.net)
# Ruta: /var/proyectos/erp_ace
# =============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
SSH_HOST="144"
REMOTE_PATH="/var/proyectos/erp_ace"
PM2_BACKEND="erp-backend"
PM2_FRONTEND="erp-frontend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deploy ERP ACE a Producción${NC}"
echo -e "${BLUE}========================================${NC}"

# Función para ejecutar comandos remotos
remote_exec() {
    ssh $SSH_HOST "$1"
}

# 1. Verificar conexión SSH
echo -e "\n${YELLOW}[1/6] Verificando conexión SSH...${NC}"
if ssh -q $SSH_HOST exit; then
    echo -e "${GREEN}✓ Conexión SSH exitosa${NC}"
else
    echo -e "${RED}✗ Error: No se puede conectar al servidor${NC}"
    exit 1
fi

# 2. Git Pull
echo -e "\n${YELLOW}[2/6] Actualizando código (git pull)...${NC}"
remote_exec "cd $REMOTE_PATH && git pull origin main"
echo -e "${GREEN}✓ Código actualizado${NC}"

# 3. Instalar dependencias del backend
echo -e "\n${YELLOW}[3/6] Instalando dependencias del backend...${NC}"
remote_exec "cd $REMOTE_PATH/backend && npm install --production"
echo -e "${GREEN}✓ Dependencias del backend instaladas${NC}"

# 4. Instalar dependencias y compilar frontend
echo -e "\n${YELLOW}[4/6] Compilando frontend...${NC}"
remote_exec "cd $REMOTE_PATH/frontend && npm install && npm run build"
echo -e "${GREEN}✓ Frontend compilado${NC}"

# 5. Reiniciar PM2 Backend
echo -e "\n${YELLOW}[5/6] Reiniciando backend (PM2)...${NC}"
remote_exec "pm2 restart $PM2_BACKEND"
echo -e "${GREEN}✓ Backend reiniciado${NC}"

# 6. Reiniciar PM2 Frontend
echo -e "\n${YELLOW}[6/6] Reiniciando frontend (PM2)...${NC}"
remote_exec "pm2 restart $PM2_FRONTEND"
echo -e "${GREEN}✓ Frontend reiniciado${NC}"

# Verificar estado
echo -e "\n${YELLOW}Verificando estado de los servicios...${NC}"
remote_exec "pm2 show $PM2_BACKEND | grep -E 'status|uptime|restarts'"
remote_exec "pm2 show $PM2_FRONTEND | grep -E 'status|uptime|restarts'"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Deploy completado exitosamente!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${BLUE}URLs de Producción:${NC}"
echo -e "  Backend:  http://144.126.150.120:5003"
echo -e "  Frontend: http://144.126.150.120:5004"
