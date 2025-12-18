# 🔒 Módulo de Permisos de Trabajo - Guía de Uso

## Acceder al Módulo

1. En el menú lateral, hacer clic en **"Permisos de Trabajo"**
2. Se despliegan las opciones:
   - Dashboard
   - Lista de Permisos

---

## Dashboard PTW

**Ruta:** `/ptw`

### KPIs Principales

| KPI | Descripción |
|-----|-------------|
| **Permisos Activos** | En ejecución |
| **Pendientes** | Por aprobar |
| **Vencidos** | Expirados |

---

## Solicitar Permiso

**Ruta:** `/ptw/permits/new`

### Campos del Formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Tipo** | ✅ | Tipo de permiso |
| **Ubicación** | ✅ | Dónde se realizará |
| **Descripción** | ✅ | Trabajo a realizar |
| **Fecha Inicio** | ✅ | Cuándo inicia |
| **Fecha Fin** | ✅ | Cuándo termina |
| **Responsable** | ✅ | Quien ejecuta |
| **Análisis de Riesgos** | ✅ | JSA adjunto |

### Pasos
1. Clic en **"+ Nuevo Permiso"**
2. Seleccionar tipo de permiso
3. Describir el trabajo
4. Definir ubicación y fechas
5. Completar análisis de riesgos
6. Enviar para aprobación

---

## Flujo de Aprobación

```
DRAFT → PENDING → APPROVED → ACTIVE → CLOSED
                ↘ REJECTED
```

### Aprobar Permiso
1. Revisar solicitud
2. Verificar análisis de riesgos
3. Verificar medidas de control
4. Aprobar o rechazar

### Activar Permiso
1. Verificar condiciones en sitio
2. Confirmar medidas implementadas
3. Activar permiso

### Cerrar Permiso
1. Verificar trabajo completado
2. Verificar área segura
3. Cerrar permiso

---

## Tips y Mejores Prácticas

- ✅ Solicitar con anticipación
- ✅ Completar JSA detallado
- ✅ Verificar vigencia antes de trabajar
- ✅ Cerrar al terminar el trabajo
