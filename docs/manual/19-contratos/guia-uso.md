# 📜 Módulo de Contratos O&G - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Contratos O&G"**
2. Se despliegan las opciones:
   - Dashboard
   - Lista de Contratos
   - Concesiones

---

## Dashboard de Contratos

**Ruta:** `/contracts`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Contratos Activos** | Contratos vigentes |
| **Por Vencer** | Próximos a expirar |
| **Valor Total** | Suma de contratos |

### Alertas
- Contratos por vencer (próximos 90 días)
- Obligaciones pendientes

---

## Lista de Contratos

**Ruta:** `/contracts/list`

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o nombre |
| **Tipo** | Servicio, Joint Venture, Operación |
| **Estado** | Activo, Vencido, Terminado |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Nombre** | Nombre del contrato |
| **Tipo** | Tipo de contrato |
| **Partes** | Empresas involucradas |
| **Vigencia** | Fecha inicio - fin |
| **Valor** | Monto del contrato |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar |

---

## Crear Contrato

**Ruta:** `/contracts/new`

### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Nombre** | ✅ | Nombre del contrato |
| **Tipo** | ✅ | Tipo de contrato |
| **Fecha Inicio** | ✅ | Inicio de vigencia |
| **Fecha Fin** | ✅ | Fin de vigencia |
| **Valor** | ❌ | Monto del contrato |
| **Moneda** | ❌ | USD (default) |
| **Descripción** | ❌ | Detalles |

### Partes del Contrato
Agregar las partes involucradas:
- Empresa/Entidad
- Rol (Operador, Socio, etc.)
- Porcentaje de participación

### Pasos
1. Hacer clic en **"+ Nuevo Contrato"**
2. Completar información general
3. Agregar partes del contrato
4. Definir obligaciones
5. Hacer clic en **"Guardar"**

---

## Detalle del Contrato

**Ruta:** `/contracts/:id`

### Información
- Código y nombre
- Tipo y estado
- Fechas de vigencia
- Valor

### Tabs Disponibles

#### Tab: Información
Datos generales del contrato.

#### Tab: Partes
Lista de partes involucradas:
- Empresa
- Rol
- Participación (%)
- Contacto

#### Tab: Obligaciones
Obligaciones contractuales:
- Descripción
- Fecha límite
- Estado
- Responsable

#### Tab: Documentos
Archivos adjuntos (contrato firmado, anexos).

#### Tab: Auditoría
Historial de cambios.

---

## Concesiones

### Lista de Concesiones

**Ruta:** `/contracts/concessions`

Muestra las concesiones petroleras:
- Nombre de la concesión
- Área/Bloque
- Operador
- Vigencia
- Estado

---

## Tips y Mejores Prácticas

### Para Contratos
- ✅ Adjuntar contrato firmado
- ✅ Definir todas las partes
- ✅ Registrar obligaciones clave
- ✅ Monitorear vencimientos

### Para Seguimiento
- ✅ Revisar alertas de vencimiento
- ✅ Actualizar estado cuando cambie
- ✅ Documentar modificaciones

---

## Solución de Problemas

### "Contrato vencido"
- Renovar o terminar formalmente
- Actualizar estado en el sistema

### "No puedo agregar partes"
- Verificar que el contrato esté en modo edición
- Verificar permisos de usuario
