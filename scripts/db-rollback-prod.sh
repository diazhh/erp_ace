#!/bin/bash
# =============================================================================
# Script de Rollback de Base de Datos en Producción
# Restaura un backup específico en caso de problemas
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración
SSH_HOST="144"
REMOTE_DB_NAME="erp_db"
REMOTE_DB_USER="erp_user"
REMOTE_DB_HOST="localhost"
REMOTE_DB_PORT="5432"
REMOTE_BACKUP_DIR="/var/backups/erp"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Rollback de Base de Datos de Producción            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

# Verificar conexión SSH
echo -e "\n${YELLOW}Verificando conexión SSH...${NC}"
if ! ssh -q $SSH_HOST exit; then
    echo -e "${RED}✗ Error: No se puede conectar al servidor${NC}"
    exit 1
fi

# Listar backups disponibles
echo -e "\n${CYAN}Backups disponibles:${NC}"
BACKUPS=$(ssh $SSH_HOST "ls -1t ${REMOTE_BACKUP_DIR}/erp_backup_*.sql 2>/dev/null" || true)

if [ -z "$BACKUPS" ]; then
    echo -e "${RED}No hay backups disponibles${NC}"
    exit 1
fi

# Mostrar backups con números
i=1
while IFS= read -r backup; do
    BACKUP_NAME=$(basename "$backup")
    BACKUP_SIZE=$(ssh $SSH_HOST "ls -lh $backup | awk '{print \$5}'")
    BACKUP_DATE=$(echo "$BACKUP_NAME" | sed 's/erp_backup_\([0-9]*\)_\([0-9]*\).sql/\1 \2/' | sed 's/\([0-9]\{4\}\)\([0-9]\{2\}\)\([0-9]\{2\}\) \([0-9]\{2\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)/\1-\2-\3 \4:\5:\6/')
    echo -e "  ${GREEN}[$i]${NC} $BACKUP_NAME (${BACKUP_SIZE}) - ${BACKUP_DATE}"
    i=$((i+1))
done <<< "$BACKUPS"

# Solicitar selección
echo -e "\n${YELLOW}Ingrese el número del backup a restaurar (o 'q' para cancelar):${NC}"
read -r selection

if [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
    echo -e "${YELLOW}Operación cancelada${NC}"
    exit 0
fi

# Validar selección
BACKUP_COUNT=$(echo "$BACKUPS" | wc -l)
if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt "$BACKUP_COUNT" ]; then
    echo -e "${RED}Selección inválida${NC}"
    exit 1
fi

# Obtener backup seleccionado
SELECTED_BACKUP=$(echo "$BACKUPS" | sed -n "${selection}p")
SELECTED_NAME=$(basename "$SELECTED_BACKUP")

echo -e "\n${RED}⚠ ADVERTENCIA: Esto sobrescribirá la base de datos de producción${NC}"
echo -e "${YELLOW}Backup seleccionado: ${SELECTED_NAME}${NC}"
echo -e "\n${YELLOW}¿Está seguro? Escriba 'SI' para confirmar:${NC}"
read -r confirm

if [ "$confirm" != "SI" ]; then
    echo -e "${YELLOW}Operación cancelada${NC}"
    exit 0
fi

# Crear backup de seguridad antes del rollback
echo -e "\n${YELLOW}Creando backup de seguridad antes del rollback...${NC}"
SAFETY_BACKUP="pre_rollback_$(date +%Y%m%d_%H%M%S).sql"
ssh $SSH_HOST "pg_dump -h $REMOTE_DB_HOST -p $REMOTE_DB_PORT -U $REMOTE_DB_USER -d $REMOTE_DB_NAME --no-owner --no-acl -F c -f ${REMOTE_BACKUP_DIR}/${SAFETY_BACKUP}"
echo -e "${GREEN}✓ Backup de seguridad creado: ${SAFETY_BACKUP}${NC}"

# Detener el backend temporalmente
echo -e "\n${YELLOW}Deteniendo backend temporalmente...${NC}"
ssh $SSH_HOST "pm2 stop erp-backend" || true

# Restaurar backup
echo -e "\n${YELLOW}Restaurando backup...${NC}"

# Terminar conexiones activas
ssh $SSH_HOST "psql -h $REMOTE_DB_HOST -p $REMOTE_DB_PORT -U $REMOTE_DB_USER -d postgres -c \"
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '${REMOTE_DB_NAME}'
  AND pid <> pg_backend_pid();\" 2>/dev/null" || true

# Recrear la base de datos
ssh $SSH_HOST "psql -h $REMOTE_DB_HOST -p $REMOTE_DB_PORT -U $REMOTE_DB_USER -d postgres -c 'DROP DATABASE IF EXISTS ${REMOTE_DB_NAME};'"
ssh $SSH_HOST "psql -h $REMOTE_DB_HOST -p $REMOTE_DB_PORT -U $REMOTE_DB_USER -d postgres -c 'CREATE DATABASE ${REMOTE_DB_NAME} OWNER ${REMOTE_DB_USER};'"

# Restaurar
ssh $SSH_HOST "pg_restore -h $REMOTE_DB_HOST -p $REMOTE_DB_PORT -U $REMOTE_DB_USER -d $REMOTE_DB_NAME --no-owner --no-acl ${SELECTED_BACKUP}"

# Reiniciar backend
echo -e "\n${YELLOW}Reiniciando backend...${NC}"
ssh $SSH_HOST "pm2 start erp-backend"

echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✓ Rollback Completado Exitosamente              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "\n${CYAN}Backup restaurado:${NC} ${SELECTED_NAME}"
echo -e "${CYAN}Backup de seguridad:${NC} ${SAFETY_BACKUP}"
