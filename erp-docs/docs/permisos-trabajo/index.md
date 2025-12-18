# 🔒 Permisos de Trabajo (PTW)

## Cómo Acceder al Módulo

1. En el **menú lateral izquierdo**, busque la opción **"Permisos de Trabajo"** o **"PTW"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Verá las siguientes secciones:
   - **Dashboard**: Panel con indicadores
   - **Permisos**: Lista de permisos
   - **Stop Work**: Paradas de trabajo

---

## Dashboard

![Dashboard de Permisos](./images/22-ptw-dashboard.png) de PTW

### Acceder al Dashboard

1. En el menú, seleccione **"PTW"** → **"Dashboard"**
2. Verá el panel principal con indicadores

### Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Permisos Activos** | Trabajos en curso |
| **Pendientes** | Por aprobar |
| **Por Vencer** | Próximos a expirar |
| **Stop Works** | Paradas activas |

---

## Lista de Permisos

![Lista de Permisos](./images/22-ptw-permisos-lista.png)

### Ver Todos los Permisos

1. En el menú, seleccione **"PTW"** → **"Permisos"**
2. Verá la tabla/tarjetas de permisos

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Búsqueda** | Por código o título |
| **Estado** | Borrador, Pendiente, Activo, etc. |
| **Tipo** | Trabajo en Caliente, Espacio Confinado, etc. |

### Columnas de la Tabla

| Columna | Descripción |
|---------|-------------|
| **Código** | Identificador único |
| **Título** | Descripción del trabajo |
| **Tipo** | Tipo de permiso |
| **Ubicación** | Dónde se realiza |
| **Vigencia** | Inicio y fin |
| **Estado** | Estado actual |
| **Acciones** | Ver, Editar, Aprobar, Activar |

---

### Solicitar un Permiso

1. Haga clic en el botón **"+ Nuevo Permiso"**
2. Complete el formulario:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Código** | ✅ Sí | Código único |
| **Título** | ✅ Sí | Descripción del trabajo |
| **Tipo** | ✅ Sí | Tipo de permiso |
| **Ubicación** | ✅ Sí | Dónde se realizará |
| **Fecha/Hora Inicio** | ✅ Sí | Cuándo inicia |
| **Fecha/Hora Fin** | ✅ Sí | Cuándo termina |
| **Descripción del Trabajo** | ✅ Sí | Detalle de actividades |
| **Riesgos Identificados** | ✅ Sí | Peligros del trabajo |
| **Medidas de Control** | ✅ Sí | Cómo se controlan los riesgos |
| **Personal Autorizado** | ✅ Sí | Quiénes realizarán el trabajo |
| **Equipos de Protección** | ❌ No | EPP requerido |

3. Haga clic en **"Guardar"**
4. El permiso queda en estado "Borrador"

---

### Flujo del Permiso

```
1. BORRADOR → Crear y completar información
   ↓ [Enviar para Aprobación]
2. PENDIENTE → Esperando revisión de HSE
   ↓ [Aprobar]
3. APROBADO → Listo para iniciar
   ↓ [Activar]
4. ACTIVO → Trabajo en curso
   ↓ [Cerrar]
5. CERRADO → Trabajo completado
```

---

### Enviar para Aprobación

1. En el detalle del permiso en estado "Borrador"
2. Verifique que toda la información esté completa
3. Haga clic en **"Enviar para Aprobación"**
4. El estado cambia a "Pendiente"

---

### Aprobar un Permiso

1. En el detalle del permiso en estado "Pendiente"
2. Revise la información y medidas de control
3. Haga clic en **"Aprobar"** o **"Rechazar"**
4. Agregue comentarios si es necesario

---

### Activar un Permiso

1. En el detalle del permiso aprobado
2. Verifique que las condiciones están listas
3. Haga clic en **"Activar"**
4. El trabajo puede comenzar

---

### Cerrar un Permiso

1. Cuando el trabajo esté completado
2. En el detalle del permiso activo
3. Haga clic en **"Cerrar Permiso"**
4. Confirme que el área quedó segura
5. El estado cambia a "Cerrado"

---

## Stop Work Authority

### Ver Lista de Stop Works

1. En el menú, seleccione **"PTW"** → **"Stop Work"**
2. Verá las paradas de trabajo registradas

### Registrar una Parada

1. Haga clic en **"+ Nuevo Stop Work"**
2. Complete:
   - Permiso afectado (si aplica)
   - Ubicación
   - Razón de la parada
   - Condición insegura observada
   - Acciones inmediatas tomadas
3. Haga clic en **"Guardar"**

### Resolver una Parada

1. En el detalle del Stop Work
2. Documente las acciones correctivas
3. Verifique que la condición se corrigió
4. Marque como resuelto
5. El trabajo puede reanudarse

---

## Consejos Útiles

### Para Solicitar Permisos
- ✅ Identifique todos los riesgos
- ✅ Defina medidas de control claras
- ✅ Liste todo el personal autorizado
- ✅ Solicite con anticipación

### Para Aprobar
- ✅ Verifique que los riesgos están controlados
- ✅ Confirme que el personal está capacitado
- ✅ Revise los EPP requeridos
- ✅ Visite el área si es necesario

### Para Trabajos Activos
- ✅ Mantenga el permiso visible en el área
- ✅ Respete los horarios autorizados
- ✅ Detenga el trabajo si hay cambios
- ✅ Cierre el permiso al terminar

---

## Preguntas Frecuentes

### ¿Puedo extender un permiso?
Sí, antes de que expire puede solicitar una extensión que debe ser aprobada.

### ¿Qué pasa si el permiso expira?
El trabajo debe detenerse. Debe solicitar un nuevo permiso o extensión.

### ¿Quién puede aprobar permisos?
Personal de HSE o supervisores autorizados según el tipo de trabajo.

### ¿Puedo trabajar sin permiso?
No para trabajos de alto riesgo. Es una violación de seguridad grave.

### ¿Qué hago si veo una condición insegura?
Use la autoridad de Stop Work para detener el trabajo inmediatamente.
