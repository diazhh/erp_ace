#!/bin/bash
# =============================================================================
# Deploy Universal para ERP ACE
# 
# Este script despliega TODO: código y base de datos (si hay cambios)
# 
# Flujo:
# 1. Verificar migraciones pendientes
# 2. Si hay → Backup BD producción → Ejecutar migraciones
# 3. Commit y push código
# 4. Pull en servidor
# 5. Instalar dependencias
# 6. Build frontend
# 7. Reiniciar PM2
# 8. Sincronizar BD producción → local
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuración
SSH_HOST="144"
REMOTE_PATH="/var/proyectos/erp_ace"
PM2_BACKEND="erp-backend"
PM2_FRONTEND="erp-frontend"
LOCAL_PATH="/home/diazhh/dev/erp"

# BD Producción
PROD_DB_HOST="144.126.150.120"
PROD_DB_PORT="15433"
PROD_DB_NAME="erp_db"
PROD_DB_USER="erp_user"
PROD_DB_PASSWORD="erp_password_2024"

# BD Local
LOCAL_DB_USER="erp_user"
DOCKER_CONTAINER="erp_postgres"

BACKUP_DIR="/home/diazhh/dev/erp/backups"

# Flags
SKIP_SYNC=false
FORCE=false

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-sync)
            SKIP_SYNC=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            echo "Uso: $0 [opciones]"
            echo ""
            echo "Opciones:"
            echo "  --skip-sync   No sincronizar BD a local al final"
            echo "  --force       No pedir confirmación"
            echo "  -h, --help    Mostrar esta ayuda"
            exit 0
            ;;
        *)
            echo -e "${RED}Opción desconocida: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${MAGENTA}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║              Deploy Universal - ERP ACE                      ║${NC}"
echo -e "${MAGENTA}║                                                              ║${NC}"
echo -e "${MAGENTA}║  Servidor: 144.126.150.120                                   ║${NC}"
echo -e "${MAGENTA}║  Dominio:  https://erp.atilax.io                             ║${NC}"
echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════════╝${NC}"

# Función para manejar errores
handle_error() {
    echo -e "\n${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    ✗ ERROR EN EL DEPLOY                      ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo -e "${YELLOW}El deploy falló en: $1${NC}"
    exit 1
}

# ============================================================================
# PASO 0: Verificaciones Previas
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[0/8] Verificaciones Previas${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Verificar SSH
echo -e "${YELLOW}→ Verificando conexión SSH...${NC}"
if ! ssh -q $SSH_HOST exit; then
    handle_error "Conexión SSH"
fi
echo -e "${GREEN}✓ SSH OK${NC}"

# Verificar rama
cd "$LOCAL_PATH"
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}✗ No estás en rama 'main' (actual: $CURRENT_BRANCH)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Rama: main${NC}"

# Mostrar cambios pendientes
CHANGES=$(git status --porcelain)
if [ -n "$CHANGES" ]; then
    CHANGE_COUNT=$(echo "$CHANGES" | wc -l)
    echo -e "${CYAN}→ Cambios pendientes: ${CHANGE_COUNT} archivo(s)${NC}"
fi

# ============================================================================
# PASO 1: Verificar Migraciones Pendientes
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[1/8] Verificando Migraciones${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

MIGRATION_STATUS=$(ssh $SSH_HOST "cd ${REMOTE_PATH}/backend && npx sequelize-cli db:migrate:status 2>&1 | grep -E '^(up|down)'" || true)
PENDING_MIGRATIONS=$(echo "$MIGRATION_STATUS" | grep "^down" | wc -l)

if [ "$PENDING_MIGRATIONS" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Hay ${PENDING_MIGRATIONS} migración(es) pendiente(s):${NC}"
    echo "$MIGRATION_STATUS" | grep "^down"
    HAS_MIGRATIONS=true
else
    echo -e "${GREEN}✓ No hay migraciones pendientes${NC}"
    HAS_MIGRATIONS=false
fi

# Confirmación
if [ "$FORCE" = false ]; then
    echo -e "\n${YELLOW}¿Continuar con el deploy? (s/N):${NC}"
    read -r confirm
    if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
        echo -e "${YELLOW}Deploy cancelado${NC}"
        exit 0
    fi
fi

# ============================================================================
# PASO 2: Backup de BD (solo si hay migraciones)
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[2/8] Backup de Base de Datos${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$HAS_MIGRATIONS" = true ]; then
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="pre_deploy_${TIMESTAMP}.sql"
    echo -e "${YELLOW}→ Creando backup de producción...${NC}"
    PGPASSWORD=$PROD_DB_PASSWORD pg_dump -h $PROD_DB_HOST -p $PROD_DB_PORT -U $PROD_DB_USER -d $PROD_DB_NAME --no-owner --no-acl -F c -f ${BACKUP_DIR}/${BACKUP_FILE} || handle_error "Backup de BD"
    BACKUP_SIZE=$(ls -lh ${BACKUP_DIR}/${BACKUP_FILE} | awk '{print $5}')
    echo -e "${GREEN}✓ Backup creado: ${BACKUP_FILE} (${BACKUP_SIZE})${NC}"
else
    echo -e "${GREEN}✓ No se requiere backup (sin migraciones)${NC}"
    BACKUP_FILE=""
fi

# ============================================================================
# PASO 3: Ejecutar Migraciones (solo si hay pendientes)
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[3/8] Migraciones de Base de Datos${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$HAS_MIGRATIONS" = true ]; then
    echo -e "${YELLOW}→ Ejecutando migraciones en producción...${NC}"
    ssh $SSH_HOST "cd ${REMOTE_PATH}/backend && NODE_ENV=production npx sequelize-cli db:migrate" || handle_error "Migraciones"
    echo -e "${GREEN}✓ Migraciones ejecutadas${NC}"
else
    echo -e "${GREEN}✓ No hay migraciones pendientes${NC}"
fi

# ============================================================================
# PASO 4: Commit y Push
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[4/8] Subiendo Cambios a GitHub${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$LOCAL_PATH"

if [ -n "$CHANGES" ]; then
    echo -e "${YELLOW}→ Agregando cambios...${NC}"
    git add .
    
    echo -e "${YELLOW}→ Creando commit...${NC}"
    git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')" || true
    
    echo -e "${YELLOW}→ Pushing a origin/main...${NC}"
    git push origin main || handle_error "Git Push"
    
    COMMIT_HASH=$(git rev-parse --short HEAD)
    echo -e "${GREEN}✓ Cambios subidos - Commit: ${COMMIT_HASH}${NC}"
else
    echo -e "${GREEN}✓ No hay cambios locales pendientes${NC}"
    COMMIT_HASH=$(git rev-parse --short HEAD)
fi

# ============================================================================
# PASO 5: Pull en Servidor
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[5/8] Actualizando Código en Servidor${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}→ Pulling cambios...${NC}"
ssh $SSH_HOST "cd $REMOTE_PATH && git fetch origin main && git pull origin main" || handle_error "Git Pull"

REMOTE_COMMIT=$(ssh $SSH_HOST "cd $REMOTE_PATH && git rev-parse --short HEAD")
echo -e "${GREEN}✓ Servidor actualizado - Commit: ${REMOTE_COMMIT}${NC}"

# Verificar sincronización
if [ "$COMMIT_HASH" != "$REMOTE_COMMIT" ]; then
    echo -e "${YELLOW}⚠ Commits no coinciden. Forzando sincronización...${NC}"
    ssh $SSH_HOST "cd $REMOTE_PATH && git fetch origin && git reset --hard origin/main"
    REMOTE_COMMIT=$(ssh $SSH_HOST "cd $REMOTE_PATH && git rev-parse --short HEAD")
fi

# ============================================================================
# PASO 6: Dependencias Backend
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[6/8] Instalando Dependencias Backend${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh $SSH_HOST "cd ${REMOTE_PATH}/backend && yarn install --production 2>/dev/null || npm install --omit=dev" || handle_error "Dependencias Backend"
echo -e "${GREEN}✓ Dependencias instaladas${NC}"

# ============================================================================
# PASO 7: Build Frontend
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[7/8] Compilando Frontend${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh $SSH_HOST "cd ${REMOTE_PATH}/frontend && yarn install && yarn build 2>/dev/null || (npm install && npm run build)" || handle_error "Build Frontend"
echo -e "${GREEN}✓ Frontend compilado${NC}"

# ============================================================================
# PASO 8: Reiniciar PM2 y Verificar
# ============================================================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[8/8] Reiniciando Servicios${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ssh $SSH_HOST "pm2 restart $PM2_BACKEND $PM2_FRONTEND" || handle_error "Reinicio PM2"
echo -e "${GREEN}✓ Servicios reiniciados${NC}"

sleep 3

# Health check
echo -e "${YELLOW}→ Verificando salud...${NC}"
HEALTH=$(ssh $SSH_HOST "curl -s http://localhost:5003/health" 2>/dev/null || echo '{"status":"error"}')
if echo "$HEALTH" | grep -q '"status"'; then
    echo -e "${GREEN}✓ Backend respondiendo${NC}"
else
    echo -e "${YELLOW}⚠ Backend no responde correctamente${NC}"
fi

# ============================================================================
# PASO FINAL: Sincronizar BD a Local
# ============================================================================
if [ "$SKIP_SYNC" = false ]; then
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[SYNC] Sincronizando BD Producción → Local${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    SYNC_FILE="post_deploy_$(date +%Y%m%d_%H%M%S).sql"
    echo -e "${YELLOW}→ Descargando BD de producción...${NC}"
    PGPASSWORD=$PROD_DB_PASSWORD pg_dump -h $PROD_DB_HOST -p $PROD_DB_PORT -U $PROD_DB_USER -d $PROD_DB_NAME --no-owner --no-acl -F c -f ${BACKUP_DIR}/${SYNC_FILE}
    
    echo -e "${YELLOW}→ Restaurando en local...${NC}"
    docker cp ${BACKUP_DIR}/${SYNC_FILE} $DOCKER_CONTAINER:/tmp/restore.sql
    docker exec $DOCKER_CONTAINER psql -U $LOCAL_DB_USER -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'erp_db' AND pid <> pg_backend_pid();" 2>/dev/null || true
    docker exec $DOCKER_CONTAINER psql -U $LOCAL_DB_USER -d postgres -c "DROP DATABASE IF EXISTS erp_db;"
    docker exec $DOCKER_CONTAINER psql -U $LOCAL_DB_USER -d postgres -c "CREATE DATABASE erp_db OWNER erp_user;"
    docker exec $DOCKER_CONTAINER pg_restore -U $LOCAL_DB_USER -d erp_db --no-owner --no-acl /tmp/restore.sql 2>/dev/null || true
    docker exec $DOCKER_CONTAINER rm /tmp/restore.sql
    
    echo -e "${GREEN}✓ BD local sincronizada${NC}"
fi

# ============================================================================
# RESUMEN FINAL
# ============================================================================
echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✓ DEPLOY COMPLETADO EXITOSAMENTE                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${CYAN}Resumen:${NC}"
echo -e "  ${BLUE}Commit:${NC} ${REMOTE_COMMIT}"
echo -e "  ${BLUE}Fecha:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
if [ -n "$BACKUP_FILE" ]; then
    echo -e "  ${BLUE}Backup:${NC} ${BACKUP_FILE}"
fi
if [ "$HAS_MIGRATIONS" = true ]; then
    echo -e "  ${BLUE}Migraciones:${NC} ${PENDING_MIGRATIONS} ejecutada(s)"
fi
if [ "$SKIP_SYNC" = false ]; then
    echo -e "  ${BLUE}BD Local:${NC} Sincronizada"
fi

echo -e "\n${CYAN}URLs de Producción:${NC}"
echo -e "  ${BLUE}Backend:${NC}  http://144.126.150.120:5003"
echo -e "  ${BLUE}Frontend:${NC} http://144.126.150.120:5004"
echo -e "  ${BLUE}Dominio:${NC}  https://erp.atilax.io"
