#!/bin/bash
# Script de pruebas de API - ERP System
# Ejecutar: bash tests/api-tests.sh

BASE_URL="http://localhost:5000/api"
TOKEN=""
EMPLOYEE_ID=""
ACCOUNT_ID=""
PERIOD_ID=""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Contadores
PASSED=0
FAILED=0

# Login y obtener token
login() {
  echo -e "${YELLOW}=== Autenticación ===${NC}"
  
  response=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"Admin123!"}')
  
  TOKEN=$(echo $response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo -e "${GREEN}✓ Login exitoso${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ Login fallido${NC}"
    echo "$response"
    ((FAILED++))
    exit 1
  fi
}

# Test genérico GET
test_get() {
  local endpoint=$1
  local name=$2
  
  response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" \
    -H "Authorization: Bearer $TOKEN")
  
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  success=$(echo "$body" | grep -o '"success":true' | head -1)
  
  if [ "$status" -eq 200 ] && [ -n "$success" ]; then
    echo -e "${GREEN}✓ GET $name${NC}"
    ((PASSED++))
    echo "$body"
  else
    echo -e "${RED}✗ GET $name - Status: $status${NC}"
    echo "$body"
    ((FAILED++))
  fi
}

# Test genérico POST
test_post() {
  local endpoint=$1
  local name=$2
  local data=$3
  local expected_status=${4:-201}
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$data")
  
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$status" -eq "$expected_status" ]; then
    echo -e "${GREEN}✓ POST $name${NC}"
    ((PASSED++))
    echo "$body"
  else
    echo -e "${RED}✗ POST $name - Expected: $expected_status, Got: $status${NC}"
    echo "$body"
    ((FAILED++))
  fi
}

# ==================== PRUEBAS ====================

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           ERP API TESTS - $(date '+%Y-%m-%d %H:%M:%S')           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 1. Autenticación
login

echo ""
echo -e "${YELLOW}=== Auth Endpoints ===${NC}"
test_get "/auth/me" "Get Current User"

echo ""
echo -e "${YELLOW}=== Employee Endpoints ===${NC}"
test_get "/employees" "List Employees"
test_get "/employees/stats" "Employee Stats"

# Obtener un empleado para pruebas
EMPLOYEE_ID=$(curl -s "$BASE_URL/employees" -H "Authorization: Bearer $TOKEN" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$EMPLOYEE_ID" ]; then
  echo "Employee ID para pruebas: $EMPLOYEE_ID"
  test_get "/employees/$EMPLOYEE_ID" "Get Employee by ID"
fi

echo ""
echo -e "${YELLOW}=== Organization Endpoints ===${NC}"
test_get "/organization/departments" "List Departments"
test_get "/organization/positions" "List Positions"
test_get "/organization/org-chart" "Get Org Chart"
test_get "/organization/directory" "Get Directory"
test_get "/organization/stats" "Organization Stats"

# Crear departamento de prueba
echo ""
echo "Creando departamento de prueba..."
DEPT_DATA='{
  "code": "TEST-DEPT",
  "name": "Departamento de Prueba",
  "type": "DEPARTMENT",
  "status": "ACTIVE"
}'
test_post "/organization/departments" "Create Department" "$DEPT_DATA"

# Crear posición de prueba
echo ""
echo "Creando posición de prueba..."
POS_DATA='{
  "code": "TEST-POS",
  "name": "Posición de Prueba",
  "level": 4,
  "status": "ACTIVE"
}'
test_post "/organization/positions" "Create Position" "$POS_DATA"

echo ""
echo -e "${YELLOW}=== Employee Bank Accounts ===${NC}"
if [ -n "$EMPLOYEE_ID" ]; then
  test_get "/employee-bank-accounts/employee/$EMPLOYEE_ID" "List Employee Bank Accounts"
  
  # Crear cuenta bancaria de empleado
  echo ""
  echo "Creando cuenta bancaria de empleado..."
  EMP_BANK_DATA="{
    \"employeeId\": \"$EMPLOYEE_ID\",
    \"accountType\": \"CHECKING\",
    \"bankName\": \"Banco de Venezuela\",
    \"accountNumber\": \"01020123456789012345\",
    \"currency\": \"VES\",
    \"isPrimary\": true
  }"
  test_post "/employee-bank-accounts" "Create Employee Bank Account" "$EMP_BANK_DATA"
fi

echo ""
echo -e "${YELLOW}=== Payroll Endpoints ===${NC}"
test_get "/payroll/periods" "List Payroll Periods"
test_get "/payroll/loans" "List Loans"
test_get "/payroll/stats" "Payroll Stats"

# Crear período de prueba
echo ""
echo "Creando período de prueba..."
PERIOD_DATA='{
  "name": "Test Period",
  "periodType": "BIWEEKLY",
  "startDate": "2025-12-01",
  "endDate": "2025-12-15",
  "paymentDate": "2025-12-15",
  "currency": "USD"
}'
test_post "/payroll/periods" "Create Payroll Period" "$PERIOD_DATA"

# Crear préstamo de prueba (si hay empleado)
if [ -n "$EMPLOYEE_ID" ]; then
  echo ""
  echo "Creando préstamo de prueba..."
  LOAN_DATA="{
    \"employeeId\": \"$EMPLOYEE_ID\",
    \"loanType\": \"PERSONAL\",
    \"amount\": 100,
    \"totalInstallments\": 2,
    \"startDate\": \"2025-01-01\",
    \"description\": \"Test loan\"
  }"
  test_post "/payroll/loans" "Create Loan" "$LOAN_DATA"
fi

echo ""
echo -e "${YELLOW}=== Finance Endpoints ===${NC}"
test_get "/finance/accounts" "List Bank Accounts"
test_get "/finance/transactions" "List Transactions"
test_get "/finance/stats" "Finance Stats"
test_get "/finance/exchange-rates" "List Exchange Rates"
test_get "/finance/categories" "List Categories"

# Crear cuenta de prueba
echo ""
echo "Creando cuenta de prueba..."
ACCOUNT_DATA='{
  "name": "Test Account",
  "accountType": "CHECKING",
  "bankName": "Test Bank",
  "currency": "USD",
  "currentBalance": 1000
}'
test_post "/finance/accounts" "Create Bank Account" "$ACCOUNT_DATA"

# Obtener cuenta para transacciones
ACCOUNT_ID=$(curl -s "$BASE_URL/finance/accounts" -H "Authorization: Bearer $TOKEN" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$ACCOUNT_ID" ]; then
  echo "Account ID para pruebas: $ACCOUNT_ID"
  test_get "/finance/accounts/$ACCOUNT_ID" "Get Account by ID"
  
  # Crear transacción de prueba
  echo ""
  echo "Creando transacción de prueba..."
  TRANSACTION_DATA="{
    \"transactionType\": \"EXPENSE\",
    \"accountId\": \"$ACCOUNT_ID\",
    \"category\": \"SUPPLIES\",
    \"amount\": 50,
    \"currency\": \"USD\",
    \"transactionDate\": \"2025-12-04\",
    \"description\": \"Test expense\"
  }"
  test_post "/finance/transactions" "Create Transaction" "$TRANSACTION_DATA"
fi

# Crear tasa de cambio
echo ""
echo "Creando tasa de cambio de prueba..."
RATE_DATA='{
  "date": "2025-12-04",
  "fromCurrency": "USD",
  "toCurrency": "VES",
  "rate": 45.50,
  "source": "MANUAL"
}'
test_post "/finance/exchange-rates" "Create Exchange Rate" "$RATE_DATA"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    RESUMEN DE PRUEBAS                      ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo -e "║  ${GREEN}Pasadas: $PASSED${NC}                                              ║"
echo -e "║  ${RED}Fallidas: $FAILED${NC}                                              ║"
echo "╚════════════════════════════════════════════════════════════╝"

if [ $FAILED -gt 0 ]; then
  exit 1
fi
