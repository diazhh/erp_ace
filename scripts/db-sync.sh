#!/bin/bash
# =============================================================================
# Script de Sincronización de Base de Datos
# Descarga la BD de producción a local para desarrollo
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración de PRODUCCIÓN (conexión directa, no SSH)
PROD_DB_HOST="144.126.150.120"
PROD_DB_PORT="15433"
PROD_DB_NAME="erp_db"
PROD_DB_USER="erp_user"
PROD_DB_PASSWORD="erp_password_2024"

# Configuración LOCAL (Docker)
LOCAL_DB_NAME="erp_db"
LOCAL_DB_USER="erp_user"
LOCAL_DB_HOST="localhost"
LOCAL_DB_PORT="5433"
DOCKER_CONTAINER="erp_postgres"

BACKUP_DIR="/home/diazhh/dev/erp/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="prod_sync_${TIMESTAMP}.sql"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Sincronización de Base de Datos: Producción → Local     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

# 1. Verificar conexión a producción
echo -e "\n${YELLOW}[1/5] Verificando conexión a producción...${NC}"
if PGPASSWORD=$PROD_DB_PASSWORD psql -h $PROD_DB_HOST -p $PROD_DB_PORT -U $PROD_DB_USER -d $PROD_DB_NAME -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Conexión a producción exitosa${NC}"
else
    echo -e "${RED}✗ Error: No se puede conectar a la BD de producción${NC}"
    exit 1
fi

# 2. Crear backup de producción
echo -e "\n${YELLOW}[2/5] Descargando backup de producción...${NC}"
PGPASSWORD=$PROD_DB_PASSWORD pg_dump -h $PROD_DB_HOST -p $PROD_DB_PORT -U $PROD_DB_USER -d $PROD_DB_NAME --no-owner --no-acl -F c -f ${BACKUP_DIR}/${BACKUP_FILE}
echo -e "${GREEN}✓ Backup descargado: ${BACKUP_DIR}/${BACKUP_FILE}${NC}"

# 3. Verificar tamaño
BACKUP_SIZE=$(ls -lh ${BACKUP_DIR}/${BACKUP_FILE} | awk '{print $5}')
echo -e "${CYAN}  Tamaño: ${BACKUP_SIZE}${NC}"

# 4. Restaurar en local (usando Docker)
echo -e "\n${YELLOW}[4/5] Restaurando en base de datos local...${NC}"

# Verificar si el contenedor Docker está corriendo
if ! docker ps | grep -q erp_postgres; then
    echo -e "${RED}✗ Error: El contenedor erp_postgres no está corriendo${NC}"
    echo -e "${YELLOW}Iniciando contenedor...${NC}"
    docker start erp_postgres || {
        echo -e "${RED}✗ No se pudo iniciar el contenedor${NC}"
        exit 1
    }
    sleep 3
fi

# Copiar backup al contenedor
docker cp ${BACKUP_DIR}/${BACKUP_FILE} erp_postgres:/tmp/${BACKUP_FILE}

# Terminar conexiones activas y restaurar
docker exec erp_postgres psql -U $LOCAL_DB_USER -d postgres -c "
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '${LOCAL_DB_NAME}'
  AND pid <> pg_backend_pid();" 2>/dev/null || true

# Recrear la base de datos
docker exec erp_postgres psql -U $LOCAL_DB_USER -d postgres -c "DROP DATABASE IF EXISTS ${LOCAL_DB_NAME};"
docker exec erp_postgres psql -U $LOCAL_DB_USER -d postgres -c "CREATE DATABASE ${LOCAL_DB_NAME} OWNER ${LOCAL_DB_USER};"

# Restaurar
docker exec erp_postgres pg_restore -U $LOCAL_DB_USER -d $LOCAL_DB_NAME --no-owner --no-acl /tmp/${BACKUP_FILE}

# Limpiar
docker exec erp_postgres rm /tmp/${BACKUP_FILE}

echo -e "${GREEN}✓ Base de datos restaurada en local${NC}"

# 5. Verificar
echo -e "\n${YELLOW}[5/5] Verificando restauración...${NC}"
TABLE_COUNT=$(docker exec erp_postgres psql -U $LOCAL_DB_USER -d $LOCAL_DB_NAME -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo -e "${GREEN}✓ Tablas en la BD local: ${TABLE_COUNT}${NC}"

# Mostrar resumen
echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✓ Sincronización Completada                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "\n${CYAN}Backup guardado en:${NC} ${BACKUP_DIR}/${BACKUP_FILE}"
echo -e "${CYAN}Base de datos local:${NC} ${LOCAL_DB_NAME} (puerto ${LOCAL_DB_PORT})"

# Limpiar backups antiguos (mantener últimos 5)
echo -e "\n${YELLOW}Limpiando backups antiguos (manteniendo últimos 5)...${NC}"
cd ${BACKUP_DIR} && ls -t prod_sync_*.sql 2>/dev/null | tail -n +6 | xargs -r rm -- 2>/dev/null || true
echo -e "${GREEN}✓ Limpieza completada${NC}"

echo -e "\n${CYAN}NOTA:${NC} Para verificar migraciones, ejecuta:"
echo -e "  cd backend && npx sequelize-cli db:migrate:status"
