#!/bin/bash
# =============================================================================
# Script de Migración de Base de Datos en Producción
# 
# ⚠️ IMPORTANTE: Este script SOLO ejecuta migraciones de ESTRUCTURA
# NO modifica datos existentes en producción
# 
# Las migraciones de Sequelize solo alteran:
# - Crear/eliminar tablas
# - Agregar/eliminar columnas
# - Crear/eliminar índices
# - Modificar tipos de datos
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
REMOTE_PATH="/var/proyectos/erp_ace"

# Configuración de PRODUCCIÓN para backup directo
PROD_DB_HOST="144.126.150.120"
PROD_DB_PORT="15433"
PROD_DB_NAME="erp_db"
PROD_DB_USER="erp_user"
PROD_DB_PASSWORD="erp_password_2024"
BACKUP_DIR="/home/diazhh/dev/erp/backups"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Migración de Base de Datos en Producción             ║${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}║  ⚠️  SOLO CAMBIOS DE ESTRUCTURA - NO AFECTA DATOS            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

# 1. Verificar conexión SSH
echo -e "\n${YELLOW}[1/5] Verificando conexión SSH...${NC}"
if ssh -q $SSH_HOST exit; then
    echo -e "${GREEN}✓ Conexión SSH exitosa${NC}"
else
    echo -e "${RED}✗ Error: No se puede conectar al servidor${NC}"
    exit 1
fi

# 2. Verificar estado de migraciones
echo -e "\n${YELLOW}[2/5] Verificando migraciones pendientes...${NC}"
MIGRATION_STATUS=$(ssh $SSH_HOST "cd ${REMOTE_PATH}/backend && npx sequelize-cli db:migrate:status 2>&1 | grep -E '^(up|down)' || true")

if [ -z "$MIGRATION_STATUS" ]; then
    echo -e "${GREEN}✓ No hay migraciones definidas o todas están aplicadas${NC}"
    exit 0
fi

echo -e "${CYAN}Estado actual de migraciones:${NC}"
echo "$MIGRATION_STATUS"

PENDING=$(echo "$MIGRATION_STATUS" | grep "^down" | wc -l)
if [ "$PENDING" -eq 0 ]; then
    echo -e "\n${GREEN}✓ No hay migraciones pendientes${NC}"
    exit 0
fi

echo -e "\n${YELLOW}Hay ${PENDING} migración(es) pendiente(s)${NC}"

# 3. Mostrar qué migraciones se van a ejecutar
echo -e "\n${CYAN}Migraciones a ejecutar:${NC}"
echo "$MIGRATION_STATUS" | grep "^down"

# 4. Crear backup antes de migrar
echo -e "\n${YELLOW}[3/5] Creando backup de seguridad antes de migrar...${NC}"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="pre_migration_${TIMESTAMP}.sql"
PGPASSWORD=$PROD_DB_PASSWORD pg_dump -h $PROD_DB_HOST -p $PROD_DB_PORT -U $PROD_DB_USER -d $PROD_DB_NAME --no-owner --no-acl -F c -f ${BACKUP_DIR}/${BACKUP_FILE}
BACKUP_SIZE=$(ls -lh ${BACKUP_DIR}/${BACKUP_FILE} | awk '{print $5}')
echo -e "${GREEN}✓ Backup creado: ${BACKUP_FILE} (${BACKUP_SIZE})${NC}"

# 5. Confirmar antes de ejecutar
echo -e "\n${RED}⚠️  ADVERTENCIA: Vas a modificar la estructura de la BD de PRODUCCIÓN${NC}"
echo -e "${YELLOW}Los datos NO serán afectados, solo la estructura (tablas, columnas, índices)${NC}"
echo -e "\n${YELLOW}¿Continuar? (s/N):${NC}"
read -r confirm

if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    echo -e "${YELLOW}Migración cancelada${NC}"
    exit 0
fi

# 6. Ejecutar migraciones
echo -e "\n${YELLOW}[4/5] Ejecutando migraciones...${NC}"
ssh $SSH_HOST "cd ${REMOTE_PATH}/backend && NODE_ENV=production npx sequelize-cli db:migrate"

# 7. Verificar resultado
echo -e "\n${YELLOW}[5/5] Verificando estado final...${NC}"
FINAL_STATUS=$(ssh $SSH_HOST "cd ${REMOTE_PATH}/backend && npx sequelize-cli db:migrate:status 2>&1 | grep -E '^(up|down)' || true")
echo -e "${CYAN}Estado final de migraciones:${NC}"
echo "$FINAL_STATUS"

STILL_PENDING=$(echo "$FINAL_STATUS" | grep "^down" | wc -l)
if [ "$STILL_PENDING" -eq 0 ]; then
    echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║            ✓ Migraciones Completadas Exitosamente            ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo -e "\n${CYAN}Backup de seguridad:${NC} ${BACKUP_DIR}/${BACKUP_FILE}"
else
    echo -e "\n${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║     ⚠ Algunas migraciones no se aplicaron correctamente      ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo -e "${YELLOW}Backup disponible para rollback: ${BACKUP_DIR}/${BACKUP_FILE}${NC}"
    exit 1
fi
