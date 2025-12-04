#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api"
TOKEN=""
PETTY_CASH_ID=""
ENTRY_ID=""

echo "=========================================="
echo "  PRUEBAS DE API - MÓDULO CAJA CHICA"
echo "=========================================="
echo ""

# 1. Login
echo -e "${YELLOW}1. Autenticación...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Error en login${NC}"
  echo $LOGIN_RESPONSE
  exit 1
fi
echo -e "${GREEN}✓ Login exitoso${NC}"

# 2. Obtener estadísticas generales
echo -e "${YELLOW}2. Estadísticas generales...${NC}"
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/petty-cash/stats" \
  -H "Authorization: Bearer $TOKEN")

if echo $STATS_RESPONSE | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Estadísticas obtenidas${NC}"
  echo $STATS_RESPONSE | python3 -m json.tool 2>/dev/null || echo $STATS_RESPONSE
else
  echo -e "${RED}✗ Error obteniendo estadísticas${NC}"
  echo $STATS_RESPONSE
fi
echo ""

# 3. Obtener categorías
echo -e "${YELLOW}3. Categorías de gastos...${NC}"
CATEGORIES_RESPONSE=$(curl -s -X GET "$BASE_URL/petty-cash/categories" \
  -H "Authorization: Bearer $TOKEN")

if echo $CATEGORIES_RESPONSE | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Categorías obtenidas${NC}"
else
  echo -e "${RED}✗ Error obteniendo categorías${NC}"
  echo $CATEGORIES_RESPONSE
fi
echo ""

# 4. Listar cajas chicas
echo -e "${YELLOW}4. Listar cajas chicas...${NC}"
LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/petty-cash" \
  -H "Authorization: Bearer $TOKEN")

if echo $LIST_RESPONSE | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Lista obtenida${NC}"
  # Obtener ID de la primera caja si existe
  PETTY_CASH_ID=$(echo $LIST_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  if [ -n "$PETTY_CASH_ID" ]; then
    echo "  Primera caja chica ID: $PETTY_CASH_ID"
  fi
else
  echo -e "${RED}✗ Error listando cajas${NC}"
  echo $LIST_RESPONSE
fi
echo ""

# 5. Obtener empleados para custodio
echo -e "${YELLOW}5. Obteniendo empleados...${NC}"
EMPLOYEES_RESPONSE=$(curl -s -X GET "$BASE_URL/employees?status=ACTIVE&limit=1" \
  -H "Authorization: Bearer $TOKEN")

EMPLOYEE_ID=$(echo $EMPLOYEES_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
if [ -n "$EMPLOYEE_ID" ]; then
  echo -e "${GREEN}✓ Empleado encontrado: $EMPLOYEE_ID${NC}"
else
  echo -e "${YELLOW}⚠ No hay empleados activos${NC}"
fi
echo ""

# 6. Crear caja chica (si hay empleado)
if [ -n "$EMPLOYEE_ID" ]; then
  echo -e "${YELLOW}6. Crear caja chica...${NC}"
  CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/petty-cash" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Caja Chica Test $(date +%s)\",
      \"description\": \"Caja de prueba\",
      \"currency\": \"USD\",
      \"initialAmount\": 500,
      \"minimumBalance\": 100,
      \"maximumExpense\": 50,
      \"custodianId\": \"$EMPLOYEE_ID\",
      \"requiresApproval\": true,
      \"approvalThreshold\": 25
    }")

  if echo $CREATE_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Caja chica creada${NC}"
    PETTY_CASH_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "  ID: $PETTY_CASH_ID"
  else
    echo -e "${RED}✗ Error creando caja chica${NC}"
    echo $CREATE_RESPONSE
  fi
  echo ""
fi

# 7. Obtener caja chica por ID
if [ -n "$PETTY_CASH_ID" ]; then
  echo -e "${YELLOW}7. Obtener caja chica por ID...${NC}"
  GET_RESPONSE=$(curl -s -X GET "$BASE_URL/petty-cash/$PETTY_CASH_ID" \
    -H "Authorization: Bearer $TOKEN")

  if echo $GET_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Caja chica obtenida${NC}"
  else
    echo -e "${RED}✗ Error obteniendo caja chica${NC}"
    echo $GET_RESPONSE
  fi
  echo ""

  # 8. Obtener caja chica con trazabilidad completa
  echo -e "${YELLOW}8. Obtener caja chica /full...${NC}"
  FULL_RESPONSE=$(curl -s -X GET "$BASE_URL/petty-cash/$PETTY_CASH_ID/full" \
    -H "Authorization: Bearer $TOKEN")

  if echo $FULL_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Trazabilidad completa obtenida${NC}"
  else
    echo -e "${RED}✗ Error obteniendo trazabilidad${NC}"
    echo $FULL_RESPONSE
  fi
  echo ""

  # 9. Crear gasto
  echo -e "${YELLOW}9. Crear gasto...${NC}"
  EXPENSE_RESPONSE=$(curl -s -X POST "$BASE_URL/petty-cash/$PETTY_CASH_ID/entries" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"entryType\": \"EXPENSE\",
      \"amount\": 15.50,
      \"category\": \"OFFICE_SUPPLIES\",
      \"description\": \"Compra de papel y bolígrafos\",
      \"vendor\": \"Papelería ABC\",
      \"vendorRif\": \"J-12345678-9\",
      \"receiptNumber\": \"FAC-001\",
      \"entryDate\": \"$(date +%Y-%m-%d)\"
    }")

  if echo $EXPENSE_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Gasto registrado${NC}"
    ENTRY_ID=$(echo $EXPENSE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "  Entry ID: $ENTRY_ID"
    # Verificar si requiere aprobación
    if echo $EXPENSE_RESPONSE | grep -q '"status":"PENDING"'; then
      echo "  Estado: PENDING (requiere aprobación)"
    else
      echo "  Estado: APPROVED (aprobado automáticamente)"
    fi
  else
    echo -e "${RED}✗ Error registrando gasto${NC}"
    echo $EXPENSE_RESPONSE
  fi
  echo ""

  # 10. Listar movimientos
  echo -e "${YELLOW}10. Listar movimientos...${NC}"
  ENTRIES_RESPONSE=$(curl -s -X GET "$BASE_URL/petty-cash/$PETTY_CASH_ID/entries" \
    -H "Authorization: Bearer $TOKEN")

  if echo $ENTRIES_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Movimientos listados${NC}"
    TOTAL=$(echo $ENTRIES_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo "  Total movimientos: $TOTAL"
  else
    echo -e "${RED}✗ Error listando movimientos${NC}"
    echo $ENTRIES_RESPONSE
  fi
  echo ""

  # 11. Aprobar gasto (si está pendiente)
  if [ -n "$ENTRY_ID" ]; then
    # Primero verificar si está pendiente
    ENTRY_STATUS=$(curl -s -X GET "$BASE_URL/petty-cash/$PETTY_CASH_ID/entries/$ENTRY_ID" \
      -H "Authorization: Bearer $TOKEN" | grep -o '"status":"[^"]*' | cut -d'"' -f4)
    
    if [ "$ENTRY_STATUS" = "PENDING" ]; then
      echo -e "${YELLOW}11. Aprobar gasto pendiente...${NC}"
      APPROVE_RESPONSE=$(curl -s -X POST "$BASE_URL/petty-cash/$PETTY_CASH_ID/entries/$ENTRY_ID/approve" \
        -H "Authorization: Bearer $TOKEN")

      if echo $APPROVE_RESPONSE | grep -q '"success":true'; then
        echo -e "${GREEN}✓ Gasto aprobado${NC}"
      else
        echo -e "${RED}✗ Error aprobando gasto${NC}"
        echo $APPROVE_RESPONSE
      fi
    else
      echo -e "${YELLOW}11. Gasto ya aprobado, saltando...${NC}"
    fi
    echo ""
  fi

  # 12. Crear reposición
  echo -e "${YELLOW}12. Crear reposición...${NC}"
  REPLENISH_RESPONSE=$(curl -s -X POST "$BASE_URL/petty-cash/$PETTY_CASH_ID/replenishment" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"amount\": 100,
      \"description\": \"Reposición de prueba\",
      \"createTransaction\": false
    }")

  if echo $REPLENISH_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Reposición registrada${NC}"
  else
    echo -e "${RED}✗ Error en reposición${NC}"
    echo $REPLENISH_RESPONSE
  fi
  echo ""

  # 13. Obtener estadísticas de la caja
  echo -e "${YELLOW}13. Estadísticas de la caja...${NC}"
  CASH_STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/petty-cash/$PETTY_CASH_ID/stats" \
    -H "Authorization: Bearer $TOKEN")

  if echo $CASH_STATS_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Estadísticas obtenidas${NC}"
    echo $CASH_STATS_RESPONSE | python3 -m json.tool 2>/dev/null || echo $CASH_STATS_RESPONSE
  else
    echo -e "${RED}✗ Error obteniendo estadísticas${NC}"
    echo $CASH_STATS_RESPONSE
  fi
  echo ""

  # 14. Actualizar caja chica
  echo -e "${YELLOW}14. Actualizar caja chica...${NC}"
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/petty-cash/$PETTY_CASH_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Caja Chica Test Actualizada\",
      \"minimumBalance\": 150
    }")

  if echo $UPDATE_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Caja chica actualizada${NC}"
  else
    echo -e "${RED}✗ Error actualizando caja chica${NC}"
    echo $UPDATE_RESPONSE
  fi
  echo ""
fi

echo "=========================================="
echo "  PRUEBAS COMPLETADAS"
echo "=========================================="
