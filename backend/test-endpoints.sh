#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"
PASS=0
FAIL=0

echo ""
echo "========================================"
echo "🧪 PRUEBAS DE ENDPOINTS ERP"
echo "========================================"
echo ""

# Función para probar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    local token=$6

    if [ -n "$token" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $token" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $token")
        fi
    else
        if [ -n "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
        fi
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" == "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} [$method] $endpoint"
        echo -e "   ${BLUE}$description${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} [$method] $endpoint"
        echo -e "   ${BLUE}$description${NC}"
        echo -e "   ${YELLOW}Esperado: $expected_status, Recibido: $http_code${NC}"
        FAIL=$((FAIL + 1))
    fi
}

# ========================================
# 1. HEALTH CHECK
# ========================================
echo -e "${YELLOW}📍 1. HEALTH CHECK${NC}"
echo "----------------------------------------"
test_endpoint "GET" "/health" "" "200" "Verificar que el servidor está activo"
echo ""

# ========================================
# 2. AUTENTICACIÓN
# ========================================
echo -e "${YELLOW}📍 2. AUTENTICACIÓN${NC}"
echo "----------------------------------------"

# Login exitoso con admin
echo "Probando login con admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"Admin123!"}')

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ]; then
    echo -e "${GREEN}✅ PASS${NC} [POST] /api/auth/login"
    echo -e "   ${BLUE}Login exitoso con admin${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC} [POST] /api/auth/login"
    echo -e "   ${BLUE}Login fallido con admin${NC}"
    FAIL=$((FAIL + 1))
fi

# Login con credenciales inválidas
test_endpoint "POST" "/api/auth/login" '{"username":"admin","password":"wrongpass"}' "401" "Login con contraseña incorrecta"

# Login con usuario inexistente
test_endpoint "POST" "/api/auth/login" '{"username":"noexiste","password":"test123"}' "401" "Login con usuario inexistente"

# Obtener usuario actual
test_endpoint "GET" "/api/auth/me" "" "200" "Obtener datos del usuario autenticado" "$ADMIN_TOKEN"

# Acceso sin token
test_endpoint "GET" "/api/auth/me" "" "401" "Acceso sin token debe fallar"

echo ""

# ========================================
# 3. PRUEBAS CON DIFERENTES ROLES
# ========================================
echo -e "${YELLOW}📍 3. PRUEBAS DE ROLES Y PERMISOS${NC}"
echo "----------------------------------------"

# Login con gerente
GERENTE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"gerente","password":"Gerente123!"}')
GERENTE_TOKEN=$(echo $GERENTE_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$GERENTE_TOKEN" ]; then
    echo -e "${GREEN}✅ PASS${NC} Login con gerente"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC} Login con gerente"
    FAIL=$((FAIL + 1))
fi

# Login con contador
CONTADOR_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"contador","password":"Contador123!"}')
CONTADOR_TOKEN=$(echo $CONTADOR_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CONTADOR_TOKEN" ]; then
    echo -e "${GREEN}✅ PASS${NC} Login con contador"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC} Login con contador"
    FAIL=$((FAIL + 1))
fi

# Login con empleado
EMPLEADO_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"empleado1","password":"Empleado1!"}')
EMPLEADO_TOKEN=$(echo $EMPLEADO_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$EMPLEADO_TOKEN" ]; then
    echo -e "${GREEN}✅ PASS${NC} Login con empleado"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC} Login con empleado"
    FAIL=$((FAIL + 1))
fi

echo ""

# ========================================
# 4. MÓDULO DE EMPLEADOS
# ========================================
echo -e "${YELLOW}📍 4. MÓDULO DE EMPLEADOS${NC}"
echo "----------------------------------------"

# Listar empleados (admin)
test_endpoint "GET" "/api/employees" "" "200" "Listar empleados (admin)" "$ADMIN_TOKEN"

# Listar con paginación
test_endpoint "GET" "/api/employees?page=1&limit=5" "" "200" "Listar empleados con paginación" "$ADMIN_TOKEN"

# Buscar empleados
test_endpoint "GET" "/api/employees?search=Roberto" "" "200" "Buscar empleados por nombre" "$ADMIN_TOKEN"

# Filtrar por departamento
test_endpoint "GET" "/api/employees?department=Operaciones" "" "200" "Filtrar por departamento" "$ADMIN_TOKEN"

# Filtrar por estado
test_endpoint "GET" "/api/employees?status=ACTIVE" "" "200" "Filtrar por estado activo" "$ADMIN_TOKEN"

# Estadísticas de empleados
test_endpoint "GET" "/api/employees/stats" "" "200" "Obtener estadísticas de empleados" "$ADMIN_TOKEN"

# Documentos por vencer
test_endpoint "GET" "/api/employees/expiring-documents?days=365" "" "200" "Obtener documentos por vencer" "$ADMIN_TOKEN"

# Crear nuevo empleado
NEW_EMP='{"firstName":"Test","lastName":"Usuario","idNumber":"99999999","position":"Tester","hireDate":"2024-12-01","department":"QA"}'
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/employees" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$NEW_EMP")

NEW_EMP_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$NEW_EMP_ID" ]; then
    echo -e "${GREEN}✅ PASS${NC} [POST] /api/employees"
    echo -e "   ${BLUE}Crear nuevo empleado${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}❌ FAIL${NC} [POST] /api/employees"
    echo -e "   ${BLUE}Crear nuevo empleado${NC}"
    FAIL=$((FAIL + 1))
fi

# Obtener empleado por ID
if [ -n "$NEW_EMP_ID" ]; then
    test_endpoint "GET" "/api/employees/$NEW_EMP_ID" "" "200" "Obtener empleado por ID" "$ADMIN_TOKEN"
fi

# Actualizar empleado
if [ -n "$NEW_EMP_ID" ]; then
    test_endpoint "PUT" "/api/employees/$NEW_EMP_ID" '{"position":"Senior Tester","baseSalary":1500}' "200" "Actualizar empleado" "$ADMIN_TOKEN"
fi

# Intentar crear empleado duplicado
test_endpoint "POST" "/api/employees" "$NEW_EMP" "400" "Rechazar empleado con cédula duplicada" "$ADMIN_TOKEN"

# Eliminar empleado
if [ -n "$NEW_EMP_ID" ]; then
    test_endpoint "DELETE" "/api/employees/$NEW_EMP_ID" "" "200" "Eliminar empleado (soft delete)" "$ADMIN_TOKEN"
fi

# Obtener empleado eliminado (debe fallar)
if [ -n "$NEW_EMP_ID" ]; then
    test_endpoint "GET" "/api/employees/$NEW_EMP_ID" "" "404" "Empleado eliminado no debe encontrarse" "$ADMIN_TOKEN"
fi

# ID inválido
test_endpoint "GET" "/api/employees/invalid-uuid" "" "422" "Rechazar ID inválido" "$ADMIN_TOKEN"

echo ""

# ========================================
# 5. VALIDACIONES
# ========================================
echo -e "${YELLOW}📍 5. VALIDACIONES${NC}"
echo "----------------------------------------"

# Crear empleado sin campos requeridos
test_endpoint "POST" "/api/employees" '{"firstName":"Solo Nombre"}' "422" "Rechazar empleado sin campos requeridos" "$ADMIN_TOKEN"

# Crear empleado con email inválido
test_endpoint "POST" "/api/employees" '{"firstName":"Test","lastName":"Email","idNumber":"88888888","position":"Test","hireDate":"2024-01-01","email":"invalid-email"}' "422" "Rechazar email inválido" "$ADMIN_TOKEN"

echo ""

# ========================================
# 6. CAMBIO DE CONTRASEÑA
# ========================================
echo -e "${YELLOW}📍 6. CAMBIO DE CONTRASEÑA${NC}"
echo "----------------------------------------"

# Cambiar contraseña con contraseña actual incorrecta
test_endpoint "POST" "/api/auth/change-password" '{"currentPassword":"wrongpass","newPassword":"NewPass123!"}' "400" "Rechazar cambio con contraseña incorrecta" "$ADMIN_TOKEN"

echo ""

# ========================================
# RESUMEN
# ========================================
echo "========================================"
echo -e "${YELLOW}📊 RESUMEN DE PRUEBAS${NC}"
echo "========================================"
echo -e "${GREEN}✅ Pasaron: $PASS${NC}"
echo -e "${RED}❌ Fallaron: $FAIL${NC}"
TOTAL=$((PASS + FAIL))
PERCENT=$((PASS * 100 / TOTAL))
echo -e "📈 Porcentaje de éxito: ${PERCENT}%"
echo "========================================"
echo ""
