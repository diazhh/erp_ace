#!/bin/bash
# =============================================================================
# Script de Restauración de Base de Datos PostgreSQL
# ERP Sistema de Gestión Empresarial
# =============================================================================
# Este script restaura la base de datos desde un archivo de respaldo.
# Uso: ./restore.sh [archivo_respaldo.sql.gz]
# Si no se especifica archivo, usa el último respaldo disponible.
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
LOG_FILE="$BACKUP_DIR/restore.log"

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Determinar archivo de respaldo a usar
if [ -n "$1" ]; then
    # Archivo especificado como argumento
    if [ -f "$1" ]; then
        BACKUP_FILE="$1"
    elif [ -f "$BACKUP_DIR/$1" ]; then
        BACKUP_FILE="$BACKUP_DIR/$1"
    else
        echo "ERROR: Archivo de respaldo no encontrado: $1"
        exit 1
    fi
else
    # Usar el último respaldo disponible
    if [ -f "$BACKUP_DIR/latest_backup.json" ]; then
        BACKUP_FILE=$(grep -o '"path": "[^"]*"' "$BACKUP_DIR/latest_backup.json" | cut -d'"' -f4)
    else
        # Buscar el respaldo más reciente
        BACKUP_FILE=$(ls -t "$BACKUP_DIR"/erp_backup_*.sql.gz 2>/dev/null | head -1)
    fi
    
    if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
        echo "ERROR: No se encontró ningún archivo de respaldo"
        echo "Uso: $0 [archivo_respaldo.sql.gz]"
        exit 1
    fi
fi

log "=========================================="
log "Iniciando restauración de base de datos"
log "=========================================="
log "Archivo: $BACKUP_FILE"
log "Host: $DB_HOST:$DB_PORT"
log "Base de datos: $DB_NAME"
log "Usuario: $DB_USER"

# Confirmar restauración (solo si es interactivo)
if [ -t 0 ]; then
    echo ""
    echo "⚠️  ADVERTENCIA: Esta operación sobrescribirá todos los datos actuales."
    echo ""
    read -p "¿Está seguro de que desea continuar? (escriba 'SI' para confirmar): " CONFIRM
    if [ "$CONFIRM" != "SI" ]; then
        log "Restauración cancelada por el usuario"
        exit 0
    fi
fi

export PGPASSWORD="$DB_PASSWORD"

# Descomprimir si es necesario
TEMP_FILE=""
if [[ "$BACKUP_FILE" == *.gz ]]; then
    log "Descomprimiendo archivo de respaldo..."
    TEMP_FILE="/tmp/erp_restore_$(date +%s).sql"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    SQL_FILE="$TEMP_FILE"
else
    SQL_FILE="$BACKUP_FILE"
fi

# Restaurar la base de datos
log "Restaurando base de datos..."
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    -f "$SQL_FILE" 2>> "$LOG_FILE"; then
    
    log "=========================================="
    log "Restauración completada exitosamente"
    log "=========================================="
    
    # Limpiar archivo temporal
    if [ -n "$TEMP_FILE" ] && [ -f "$TEMP_FILE" ]; then
        rm -f "$TEMP_FILE"
    fi
    
    exit 0
else
    log "ERROR: Falló la restauración de la base de datos"
    log "=========================================="
    
    # Limpiar archivo temporal
    if [ -n "$TEMP_FILE" ] && [ -f "$TEMP_FILE" ]; then
        rm -f "$TEMP_FILE"
    fi
    
    exit 1
fi
