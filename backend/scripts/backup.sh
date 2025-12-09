#!/bin/bash
# =============================================================================
# Script de Respaldo de Base de Datos PostgreSQL
# ERP Sistema de Gestión Empresarial
# =============================================================================
# Este script realiza un respaldo completo de la base de datos y elimina
# los respaldos anteriores, manteniendo solo el más reciente.
# =============================================================================

set -e

# Cargar variables de entorno desde .env si existe
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

if [ -f "$BACKEND_DIR/.env" ]; then
    export $(grep -v '^#' "$BACKEND_DIR/.env" | xargs)
fi

# Configuración de la base de datos
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5433}"
DB_NAME="${DB_NAME:-erp_db}"
DB_USER="${DB_USER:-erp_user}"
DB_PASSWORD="${DB_PASSWORD:-erp_password_dev_2024}"

# Directorio de respaldos
BACKUP_DIR="$BACKEND_DIR/backups"
LOG_FILE="$BACKUP_DIR/backup.log"

# Crear directorio de respaldos si no existe
mkdir -p "$BACKUP_DIR"

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Nombre del archivo de respaldo con timestamp
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="$BACKUP_DIR/erp_backup_${TIMESTAMP}.sql.gz"
BACKUP_FILE_UNCOMPRESSED="$BACKUP_DIR/erp_backup_${TIMESTAMP}.sql"

log "=========================================="
log "Iniciando respaldo de base de datos"
log "=========================================="
log "Host: $DB_HOST:$DB_PORT"
log "Base de datos: $DB_NAME"
log "Usuario: $DB_USER"

# Realizar el respaldo
log "Creando respaldo..."
export PGPASSWORD="$DB_PASSWORD"

if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --no-owner --no-acl --clean --if-exists \
    -F p -f "$BACKUP_FILE_UNCOMPRESSED" 2>> "$LOG_FILE"; then
    
    # Comprimir el respaldo
    log "Comprimiendo respaldo..."
    gzip -f "$BACKUP_FILE_UNCOMPRESSED"
    
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "Respaldo creado exitosamente: $BACKUP_FILE ($BACKUP_SIZE)"
    
    # Eliminar respaldos anteriores (mantener solo el actual)
    log "Eliminando respaldos anteriores..."
    DELETED_COUNT=0
    for old_backup in "$BACKUP_DIR"/erp_backup_*.sql.gz; do
        if [ -f "$old_backup" ] && [ "$old_backup" != "$BACKUP_FILE" ]; then
            rm -f "$old_backup"
            log "  Eliminado: $(basename "$old_backup")"
            ((DELETED_COUNT++)) || true
        fi
    done
    
    if [ $DELETED_COUNT -eq 0 ]; then
        log "No había respaldos anteriores para eliminar"
    else
        log "Se eliminaron $DELETED_COUNT respaldo(s) anterior(es)"
    fi
    
    log "=========================================="
    log "Respaldo completado exitosamente"
    log "=========================================="
    
    # Crear archivo de metadatos del último respaldo
    cat > "$BACKUP_DIR/latest_backup.json" << EOF
{
    "filename": "$(basename "$BACKUP_FILE")",
    "path": "$BACKUP_FILE",
    "timestamp": "$TIMESTAMP",
    "date": "$(date '+%Y-%m-%d %H:%M:%S')",
    "size": "$BACKUP_SIZE",
    "database": "$DB_NAME",
    "host": "$DB_HOST",
    "port": "$DB_PORT"
}
EOF
    
    exit 0
else
    log "ERROR: Falló la creación del respaldo"
    log "=========================================="
    exit 1
fi
