#!/bin/bash

# Script para crear datos de prueba de contratistas y proyectos contratados

BASE_URL="http://localhost:5000/api"

# Login
echo "🔐 Iniciando sesión..."
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}' | jq -r '.data.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Error al obtener token"
  exit 1
fi
echo "✅ Token obtenido"

# Crear contratistas
echo ""
echo "📋 Creando contratistas..."

# Contratista 1
CONTRACTOR1=$(curl -s -X POST "$BASE_URL/contractors" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "companyName": "Constructora ABC C.A.",
    "rif": "J-12345678-9",
    "contactName": "Carlos Mendoza",
    "email": "contacto@constructoraabc.com",
    "phone": "0212-555-1234",
    "address": "Av. Principal, Torre Empresarial, Piso 5, Caracas",
    "specialty": "Construcción Civil",
    "status": "ACTIVE",
    "notes": "Contratista especializado en obras civiles y estructuras"
  }')
CONTRACTOR1_ID=$(echo $CONTRACTOR1 | jq -r '.data.id')
echo "  ✅ Constructora ABC: $CONTRACTOR1_ID"

# Contratista 2
CONTRACTOR2=$(curl -s -X POST "$BASE_URL/contractors" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "companyName": "Electricidad Industrial XYZ",
    "rif": "J-98765432-1",
    "contactName": "María González",
    "email": "info@electricidadxyz.com",
    "phone": "0212-555-5678",
    "address": "Zona Industrial, Galpón 15, Valencia",
    "specialty": "Instalaciones Eléctricas",
    "status": "ACTIVE",
    "notes": "Especialistas en instalaciones eléctricas industriales"
  }')
CONTRACTOR2_ID=$(echo $CONTRACTOR2 | jq -r '.data.id')
echo "  ✅ Electricidad XYZ: $CONTRACTOR2_ID"

# Contratista 3
CONTRACTOR3=$(curl -s -X POST "$BASE_URL/contractors" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "companyName": "Plomería y Servicios Hidráulicos",
    "rif": "J-55667788-0",
    "contactName": "Pedro Ramírez",
    "email": "servicios@plomeriahidraulica.com",
    "phone": "0412-555-9012",
    "address": "Calle Los Cedros, Local 8, Maracay",
    "specialty": "Plomería e Instalaciones Hidráulicas",
    "status": "ACTIVE",
    "notes": "Servicios de plomería comercial e industrial"
  }')
CONTRACTOR3_ID=$(echo $CONTRACTOR3 | jq -r '.data.id')
echo "  ✅ Plomería Hidráulica: $CONTRACTOR3_ID"

# Crear proyectos contratados
echo ""
echo "🏗️ Creando proyectos contratados..."

# Proyecto 1 - Construcción
PROJECT1=$(curl -s -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Construcción Galpón Industrial\",
    \"description\": \"Construcción de galpón industrial de 500m2 con oficinas administrativas\",
    \"executionType\": \"OUTSOURCED\",
    \"contractorId\": \"$CONTRACTOR1_ID\",
    \"contractAmount\": 150000,
    \"budget\": 160000,
    \"currency\": \"USD\",
    \"startDate\": \"2025-01-15\",
    \"endDate\": \"2025-06-30\",
    \"status\": \"IN_PROGRESS\",
    \"priority\": \"HIGH\",
    \"location\": \"Zona Industrial Norte\",
    \"address\": \"Parcela 45, Zona Industrial Norte, Valencia\"
  }")
PROJECT1_ID=$(echo $PROJECT1 | jq -r '.data.id')
PROJECT1_CODE=$(echo $PROJECT1 | jq -r '.data.code')
echo "  ✅ Galpón Industrial: $PROJECT1_CODE ($PROJECT1_ID)"

# Proyecto 2 - Eléctrico
PROJECT2=$(curl -s -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"Instalación Eléctrica Planta Principal\",
    \"description\": \"Renovación completa del sistema eléctrico de la planta principal\",
    \"executionType\": \"OUTSOURCED\",
    \"contractorId\": \"$CONTRACTOR2_ID\",
    \"contractAmount\": 45000,
    \"budget\": 50000,
    \"currency\": \"USD\",
    \"startDate\": \"2025-02-01\",
    \"endDate\": \"2025-04-15\",
    \"status\": \"IN_PROGRESS\",
    \"priority\": \"MEDIUM\",
    \"location\": \"Planta Principal\",
    \"address\": \"Av. Industrial, Edificio Central\"
  }")
PROJECT2_ID=$(echo $PROJECT2 | jq -r '.data.id')
PROJECT2_CODE=$(echo $PROJECT2 | jq -r '.data.code')
echo "  ✅ Instalación Eléctrica: $PROJECT2_CODE ($PROJECT2_ID)"

# Crear valuaciones para el proyecto 1
echo ""
echo "📊 Creando valuaciones para $PROJECT1_CODE..."

# Valuación 1 - 20%
VAL1=$(curl -s -X POST "$BASE_URL/projects/$PROJECT1_ID/valuations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "periodStart": "2025-01-15",
    "periodEnd": "2025-02-15",
    "currentPercent": 20,
    "description": "Trabajos de fundación y estructura base completados",
    "inspectionNotes": "Fundaciones verificadas según especificaciones técnicas"
  }')
VAL1_ID=$(echo $VAL1 | jq -r '.data.id')
VAL1_CODE=$(echo $VAL1 | jq -r '.data.code')
echo "  ✅ Valuación 1 (20%): $VAL1_CODE"

# Enviar valuación 1 para revisión
curl -s -X POST "$BASE_URL/projects/$PROJECT1_ID/valuations/$VAL1_ID/submit" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo "    → Enviada para revisión"

# Aprobar valuación 1
curl -s -X POST "$BASE_URL/projects/$PROJECT1_ID/valuations/$VAL1_ID/approve" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo "    → Aprobada"

# Generar factura para valuación 1
INVOICE1=$(curl -s -X POST "$BASE_URL/projects/$PROJECT1_ID/valuations/$VAL1_ID/generate-invoice" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "invoiceNumber": "FAC-001-2025",
    "controlNumber": "00-12345678",
    "invoiceDate": "2025-02-16",
    "dueDate": "2025-03-16",
    "taxRate": 16,
    "retentionRate": 2,
    "ivaRetentionRate": 75
  }')
INVOICE1_CODE=$(echo $INVOICE1 | jq -r '.data.code')
echo "    → Factura generada: $INVOICE1_CODE"

# Valuación 2 - 25%
VAL2=$(curl -s -X POST "$BASE_URL/projects/$PROJECT1_ID/valuations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "periodStart": "2025-02-16",
    "periodEnd": "2025-03-15",
    "currentPercent": 25,
    "description": "Estructura metálica y cerramientos laterales",
    "inspectionNotes": "Estructura soldada y pintada con anticorrosivo"
  }')
VAL2_CODE=$(echo $VAL2 | jq -r '.data.code')
echo "  ✅ Valuación 2 (25%): $VAL2_CODE"

# Valuación 3 - 15% (en borrador)
VAL3=$(curl -s -X POST "$BASE_URL/projects/$PROJECT1_ID/valuations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "periodStart": "2025-03-16",
    "periodEnd": "2025-04-15",
    "currentPercent": 15,
    "description": "Instalación de techo y sistema de drenaje",
    "inspectionNotes": "Pendiente verificación de impermeabilización"
  }')
VAL3_CODE=$(echo $VAL3 | jq -r '.data.code')
echo "  ✅ Valuación 3 (15%): $VAL3_CODE (borrador)"

echo ""
echo "✅ Datos de prueba creados exitosamente!"
echo ""
echo "📋 Resumen:"
echo "  - 3 Contratistas creados"
echo "  - 2 Proyectos contratados"
echo "  - 3 Valuaciones (1 facturada, 1 enviada, 1 borrador)"
echo ""
echo "🔗 Puedes ver los proyectos en: http://localhost:5173/projects"
echo "🔗 Puedes ver los contratistas en: http://localhost:5173/contractors"
