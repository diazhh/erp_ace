# 🔒 Permisos de Trabajo (PTW)

## ¿Qué es este módulo?

El módulo de **Permisos de Trabajo** (PTW - Permit to Work) permite gestionar los permisos requeridos para realizar trabajos de alto riesgo. Es fundamental para la seguridad en operaciones petroleras, asegurando que los trabajos peligrosos se realicen con las precauciones adecuadas.

Piense en este módulo como su "sistema de autorización de trabajos peligrosos": antes de realizar un trabajo de riesgo, se debe obtener un permiso que asegure que se han tomado todas las medidas de seguridad.

## ¿Para quién es útil?

- **HSE**: Para gestionar y aprobar permisos
- **Supervisores de Campo**: Para solicitar permisos
- **Operadores**: Para verificar permisos vigentes
- **Gerencia**: Para monitorear trabajos de alto riesgo

## ¿Qué puedo hacer aquí?

### Permisos de Trabajo
- **Solicitar permisos** para trabajos de riesgo
- **Flujo de aprobación** multinivel
- **Activar y cerrar** permisos
- **Extensiones** si el trabajo se prolonga

### Stop Work Authority
- **Registrar paradas** de trabajo por seguridad
- **Documentar razones**
- **Seguimiento de resolución**

### Dashboard
- **Permisos activos**: Trabajos en curso
- **Pendientes de aprobación**: Por revisar
- **Estadísticas**: Por tipo y ubicación

## Conceptos Importantes

### Tipos de Permiso

| Tipo | Descripción |
|------|-------------|
| **Trabajo en Caliente** | Soldadura, corte, esmerilado |
| **Espacio Confinado** | Tanques, recipientes, pozos |
| **Eléctrico** | Trabajos en sistemas eléctricos |
| **Excavación** | Zanjas, excavaciones |
| **Izaje** | Levantamiento de cargas |
| **Trabajo en Altura** | Andamios, techos, torres |
| **Bloqueo/Etiquetado** | LOTO - Lockout/Tagout |
| **General** | Otros trabajos de riesgo |

### Estados del Permiso

| Estado | Descripción | Color |
|--------|-------------|-------|
| **Borrador** | En elaboración | Gris |
| **Pendiente** | Esperando aprobación | Amarillo |
| **Aprobado** | Autorizado, no iniciado | Azul |
| **Activo** | Trabajo en curso | Verde |
| **Suspendido** | Detenido temporalmente | Rojo |
| **Cerrado** | Trabajo completado | Gris |
| **Cancelado** | Anulado | Gris |
| **Expirado** | Venció sin completar | Rojo |

### Vigencia del Permiso

Cada permiso tiene:
- **Fecha/Hora Inicio**: Cuándo puede comenzar
- **Fecha/Hora Fin**: Cuándo expira
- **Duración máxima**: Según tipo de trabajo

### Flujo de Aprobación

```
1. BORRADOR → Solicitante crea el permiso
   ↓
2. PENDIENTE → Enviado para aprobación
   ↓
3. APROBADO → HSE/Supervisor aprueba
   ↓
4. ACTIVO → Trabajo inicia
   ↓
5. CERRADO → Trabajo completado
```

### Stop Work Authority

Cualquier persona puede detener un trabajo si observa una condición insegura. El sistema registra:
- Quién detuvo el trabajo
- Razón de la parada
- Acciones tomadas
- Resolución

## Relación con Otros Módulos

El módulo de Permisos de Trabajo se conecta con:

- **HSE**: Los permisos son parte del sistema de seguridad.

- **Empleados**: Los permisos se asignan a personal autorizado.

- **Producción**: Permisos para trabajos en campos y pozos.

- **Mantenimiento**: Permisos para trabajos de mantenimiento.
