#!/bin/bash
# =============================================================================
# Script para configurar el cron job de respaldo diario
# ERP Sistema de Gestión Empresarial
# =============================================================================
# Este script configura un cron job que ejecuta el respaldo diariamente
# a las 2:00 AM (hora del servidor).
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup.sh"

# Verificar que el script de backup existe
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "ERROR: No se encontró el script de backup: $BACKUP_SCRIPT"
    exit 1
fi

# Hacer ejecutable el script de backup
chmod +x "$BACKUP_SCRIPT"
chmod +x "$SCRIPT_DIR/restore.sh"

# Hora del respaldo (por defecto 2:00 AM)
BACKUP_HOUR="${1:-2}"
BACKUP_MINUTE="${2:-0}"

# Crear entrada de cron
CRON_ENTRY="$BACKUP_MINUTE $BACKUP_HOUR * * * $BACKUP_SCRIPT >> $SCRIPT_DIR/../backups/cron.log 2>&1"

# Verificar si ya existe una entrada similar
EXISTING=$(crontab -l 2>/dev/null | grep -F "$BACKUP_SCRIPT" || true)

if [ -n "$EXISTING" ]; then
    echo "Ya existe una entrada de cron para el respaldo:"
    echo "  $EXISTING"
    echo ""
    read -p "¿Desea reemplazarla? (s/n): " REPLACE
    if [ "$REPLACE" != "s" ] && [ "$REPLACE" != "S" ]; then
        echo "Operación cancelada"
        exit 0
    fi
    # Eliminar entrada existente
    crontab -l 2>/dev/null | grep -v -F "$BACKUP_SCRIPT" | crontab -
fi

# Agregar nueva entrada de cron
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -

echo "=========================================="
echo "Cron job configurado exitosamente"
echo "=========================================="
echo ""
echo "Configuración:"
echo "  - Hora: $BACKUP_HOUR:$(printf '%02d' $BACKUP_MINUTE)"
echo "  - Script: $BACKUP_SCRIPT"
echo "  - Log: $SCRIPT_DIR/../backups/cron.log"
echo ""
echo "Para verificar: crontab -l"
echo "Para eliminar: crontab -l | grep -v '$BACKUP_SCRIPT' | crontab -"
echo ""
