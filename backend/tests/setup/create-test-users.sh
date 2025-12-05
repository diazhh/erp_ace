#!/bin/bash

# Script para crear usuarios de prueba en el sistema ERP
# Ejecutar después de tener la base de datos inicializada

BASE_URL="${BASE_URL:-http://localhost:5000/api}"
ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin123!}"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "==============================================="
echo "  Creación de Usuarios de Prueba - ERP"
echo "==============================================="
echo ""

# Login como admin para obtener token
echo "🔐 Iniciando sesión como administrador..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}")

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')

if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}✗ Error al obtener token de administrador${NC}"
  echo "Respuesta: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Token de administrador obtenido${NC}"
echo ""

# Función para crear usuario
create_user() {
  local username=$1
  local password=$2
  local email=$3
  local role_ids=$4
  local employee_id=${5:-null}

  echo "👤 Creando usuario: $username..."

  RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"$username\",
      \"password\": \"$password\",
      \"email\": \"$email\",
      \"isActive\": true,
      \"employeeId\": $employee_id,
      \"roleIds\": $role_ids
    }")

  SUCCESS=$(echo $RESPONSE | jq -r '.success')

  if [ "$SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓ Usuario $username creado exitosamente${NC}"
  else
    ERROR=$(echo $RESPONSE | jq -r '.error')
    echo -e "${YELLOW}⚠ Usuario $username: $ERROR${NC}"
  fi
}

# Crear usuarios de prueba con sus roles correspondientes
# Nota: Los IDs de roles deben coincidir con los de la base de datos

echo "Creando usuarios de prueba..."
echo ""

# 1. Gerente General (rol ID: 2)
create_user "gerente.general" "Gerente123!" "gerente.general@test.com" "[2]"

# 2. Gerente Administrativo (rol ID: 3)
create_user "gerente.admin" "GerenteAdmin123!" "gerente.admin@test.com" "[3]"

# 3. Contador (rol ID: 4)
create_user "contador" "Contador123!" "contador@test.com" "[4]"

# 4. Jefe de RRHH (rol ID: 5)
create_user "jefe.rrhh" "RRHH123!" "jefe.rrhh@test.com" "[5]"

# 5. Gerente de Operaciones (ID personalizado si existe)
create_user "gerente.ops" "GerenteOps123!" "gerente.ops@test.com" "[3]"

# 6. Supervisor de Proyecto
create_user "supervisor.proyecto" "Supervisor123!" "supervisor.proyecto@test.com" "[3]"

# 7. Empleado Regular (rol ID: 6)
create_user "empleado.regular" "Empleado123!" "empleado.regular@test.com" "[6]"

# 8. Usuario sin permisos (sin roles)
create_user "sin.permisos" "NoPermiso123!" "sin.permisos@test.com" "[]"

echo ""
echo "==============================================="
echo -e "${GREEN}✅ Proceso de creación completado${NC}"
echo "==============================================="
echo ""
echo "Usuarios creados:"
echo "  - gerente.general / Gerente123!"
echo "  - gerente.admin / GerenteAdmin123!"
echo "  - contador / Contador123!"
echo "  - jefe.rrhh / RRHH123!"
echo "  - gerente.ops / GerenteOps123!"
echo "  - supervisor.proyecto / Supervisor123!"
echo "  - empleado.regular / Empleado123!"
echo "  - sin.permisos / NoPermiso123!"
echo ""
echo "Usa estos usuarios para ejecutar las pruebas de API con diferentes roles."
echo ""
