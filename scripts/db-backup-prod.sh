#!/bin/bash
# =============================================================================
# Script de Backup de Base de Datos de Producción
# Crea un backup seguro antes de cualquier deploy
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración de PRODUCCIÓN (conexión directa)
PROD_DB_HOST="144.126.150.120"
PROD_DB_PORT="15433"
PROD_DB_NAME="erp_db"
PROD_DB_USER="erp_user"
PROD_DB_PASSWORD="erp_password_2024"

# Directorio local de backups
BACKUP_DIR="/home/diazhh/dev/erp/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="erp_backup_${TIMESTAMP}.sql"

# Crear directorio si no existe
mkdir -p "$BACKUP_DIR"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Backup de Base de Datos de Producción              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

# 1. Verificar conexión a producción
echo -e "\n${YELLOW}[1/2] Verificando conexión a producción...${NC}"
if PGPASSWORD=$PROD_DB_PASSWORD psql -h $PROD_DB_HOST -p $PROD_DB_PORT -U $PROD_DB_USER -d $PROD_DB_NAME -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Conexión a producción exitosa${NC}"
else
    echo -e "${RED}✗ Error: No se puede conectar a la BD de producción${NC}"
    exit 1
fi

# 2. Crear backup
echo -e "\n${YELLOW}[2/2] Creando backup...${NC}"
PGPASSWORD=$PROD_DB_PASSWORD pg_dump -h $PROD_DB_HOST -p $PROD_DB_PORT -U $PROD_DB_USER -d $PROD_DB_NAME --no-owner --no-acl -F c -f ${BACKUP_DIR}/${BACKUP_FILE}

# Verificar tamaño del backup
BACKUP_SIZE=$(ls -lh ${BACKUP_DIR}/${BACKUP_FILE} | awk '{print $5}')

echo -e "${GREEN}✓ Backup creado exitosamente${NC}"
echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    Backup Completado                         ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "\n${BLUE}Archivo:${NC} ${BACKUP_DIR}/${BACKUP_FILE}"
echo -e "${BLUE}Tamaño:${NC} ${BACKUP_SIZE}"

# Limpiar backups antiguos (mantener últimos 10)
echo -e "\n${YELLOW}Limpiando backups antiguos (manteniendo últimos 10)...${NC}"
cd ${BACKUP_DIR} && ls -t erp_backup_*.sql 2>/dev/null | tail -n +11 | xargs -r rm -- 2>/dev/null || true
echo -e "${GREEN}✓ Limpieza completada${NC}"

# Listar backups disponibles
echo -e "\n${BLUE}Backups disponibles:${NC}"
ls -lh ${BACKUP_DIR}/*.sql 2>/dev/null | tail -5 || echo "No hay backups previos"

# Retornar el nombre del archivo para uso en otros scripts
echo "${BACKUP_FILE}"
