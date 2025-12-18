# 📚 ROADMAP - Manual de Usuario del ERP

## Objetivo

Crear documentación completa orientada a **usuarios finales** para cada módulo del ERP. La documentación debe ser clara, sin términos técnicos, y guiar al usuario paso a paso en el uso del sistema.

---

## 📁 Estructura de Documentación por Módulo

Cada módulo tendrá una carpeta con **3 archivos**:

```
docs/manual/XX-nombre-modulo/
├── descripcion.md      # Qué hace el módulo
├── guia-uso.md         # Cómo usar el módulo paso a paso
└── prompt-capturas.md  # Prompt para generar screenshots
```

---

## 📄 Documento 1: descripcion.md

### Propósito
Explicar al usuario final qué hace el módulo, para qué sirve y qué puede lograr con él.

### Estructura Obligatoria

```markdown
# [Emoji] [Nombre del Módulo]

## ¿Qué es este módulo?
[Explicación en 2-3 párrafos de qué hace el módulo y para qué sirve]

## ¿Para quién es útil?
[Roles o personas que usarían este módulo]

## ¿Qué puedo hacer aquí?
[Lista de acciones principales que el usuario puede realizar]

## Conceptos Importantes
[Explicación de términos o conceptos que el usuario debe entender]

## Relación con Otros Módulos
[Cómo se conecta con otros módulos del sistema - en lenguaje simple]
```

### Reglas de Redacción
- ❌ NO usar términos técnicos (API, endpoint, UUID, etc.)
- ❌ NO mencionar URLs ni rutas del sistema
- ❌ NO hablar de base de datos, modelos o código
- ✅ Usar lenguaje simple y directo
- ✅ Usar ejemplos del mundo real
- ✅ Explicar beneficios para el usuario

---

## 📄 Documento 2: guia-uso.md

### Propósito
Guiar al usuario paso a paso en cómo usar cada funcionalidad del módulo.

### Estructura Obligatoria

```markdown
# [Emoji] [Nombre del Módulo] - Guía de Uso

## Cómo Acceder al Módulo
[Instrucciones exactas desde el menú principal]

## Pantalla Principal
[Descripción de lo que ve el usuario al entrar]

## [Acción 1: Ej. "Crear un Nuevo Registro"]
### Paso 1: [Descripción]
### Paso 2: [Descripción]
...

## [Acción 2: Ej. "Buscar y Filtrar"]
...

## [Acción 3: Ej. "Editar un Registro"]
...

## Consejos Útiles
[Tips para usar mejor el módulo]

## Preguntas Frecuentes
[Problemas comunes y soluciones]
```

### Reglas de Redacción
- ✅ Describir exactamente qué hacer: "Haga clic en el botón azul con el ícono +"
- ✅ Mencionar nombres de menús, tabs, botones e íconos
- ✅ Describir qué esperar después de cada acción
- ✅ Incluir advertencias o notas importantes
- ❌ NO usar URLs ni rutas técnicas
- ❌ NO asumir conocimiento previo del usuario

### Formato para Instrucciones

```markdown
1. En el **menú lateral izquierdo**, busque la opción **"[Nombre del Módulo]"**
2. Haga clic en el ícono de flecha (▼) para expandir las opciones
3. Seleccione **"[Subopción]"**
4. Se abrirá la pantalla de [descripción]
```

---

## 📄 Documento 3: prompt-capturas.md

### Propósito
Contener el prompt exacto para que un asistente AI tome todas las capturas de pantalla necesarias.

### Estructura Obligatoria

```markdown
# Prompt para Capturas de Pantalla - [Nombre del Módulo]

## Configuración Requerida
- Resolución: 2560x1600
- Navegador: Puppeteer con --no-sandbox
- Usuario: admin / Admin123!
- URL Base: http://localhost:5173

## Capturas Requeridas

### Captura 1: [Nombre descriptivo]
- **Navegación**: [Pasos para llegar a la pantalla]
- **Nombre archivo**: XX-modulo-nombre-captura.png
- **Descripción**: [Qué debe mostrar la captura]

### Captura 2: [Nombre descriptivo]
...

## Prompt para Ejecutar

[Prompt completo listo para copiar y pegar]
```

---

## 📋 Lista de Módulos a Documentar

| # | Carpeta | Módulo | Prioridad | Estado |
|---|---------|--------|-----------|--------|
| 00 | `00-introduccion` | Introducción al Sistema | Alta | ✅ Completado |
| 01 | `01-empleados` | Gestión de Empleados | Alta | ✅ Completado |
| 02 | `02-organizacion` | Estructura Organizacional | Alta | ✅ Completado |
| 03 | `03-nomina` | Nómina y Pagos | Alta | ✅ Completado |
| 04 | `04-finanzas` | Finanzas y Contabilidad | Alta | ✅ Completado |
| 05 | `05-caja-chica` | Caja Chica | Media | ✅ Completado |
| 06 | `06-proyectos` | Gestión de Proyectos | Alta | ✅ Completado |
| 07 | `07-inventario` | Inventario y Almacén | Alta | ✅ Completado |
| 08 | `08-flota` | Gestión de Flota | Media | ✅ Completado |
| 09 | `09-procura` | Compras y Procura | Alta | ✅ Completado |
| 10 | `10-hse` | Seguridad y Salud (HSE) | Media | ✅ Completado |
| 11 | `11-documentos` | Gestión Documental | Media | ✅ Completado |
| 12 | `12-dashboard` | Panel Principal | Alta | ✅ Completado |
| 13 | `13-usuarios` | Usuarios y Accesos | Alta | ✅ Completado |
| 14 | `14-activos` | Activos Fijos | Media | ✅ Completado |
| 15 | `15-crm` | Clientes y Ventas (CRM) | Media | ✅ Completado |
| 16 | `16-calidad` | Control de Calidad | Media | ✅ Completado |
| 17 | `17-produccion` | Producción y Pozos | Alta | ✅ Completado |
| 18 | `18-afe` | Autorizaciones de Gasto | Alta | ✅ Completado |
| 19 | `19-contratos` | Contratos Petroleros | Alta | ✅ Completado |
| 20 | `20-compliance` | Cumplimiento Regulatorio | Media | ✅ Completado |
| 21 | `21-jib` | Facturación Conjunta (JIB) | Media | ✅ Completado |
| 22 | `22-permisos-trabajo` | Permisos de Trabajo | Media | ✅ Completado |
| 23 | `23-notificaciones` | Notificaciones (WhatsApp/Email) | Baja | ✅ Completado |
| 24 | `24-reportes` | Reportes y Exportación | Media | ✅ Completado |
| 25 | `25-configuracion` | Configuración del Sistema | Media | ✅ Completado |

---

## 🔧 Proceso para Documentar un Módulo

### Fase 1: Análisis del Código Fuente

1. **Identificar archivos del módulo**
   - Buscar en `frontend/src/pages/[modulo]/`
   - Identificar todas las páginas (List, Detail, Form, Dashboard)

2. **Analizar cada componente**
   - ¿Qué muestra la pantalla principal?
   - ¿Qué filtros y búsquedas hay?
   - ¿Qué acciones puede hacer el usuario?
   - ¿Qué tabs o secciones tiene el detalle?
   - ¿Qué campos tiene el formulario?

3. **Identificar estados y flujos**
   - ¿Qué estados tiene la entidad principal?
   - ¿Hay flujo de aprobación?
   - ¿Qué acciones cambian el estado?

4. **Identificar relaciones**
   - ¿Con qué otros módulos se relaciona?
   - ¿Qué información se muestra de otros módulos?

### Fase 2: Crear descripcion.md

1. Redactar explicación del módulo en lenguaje simple
2. Listar todas las acciones posibles
3. Explicar conceptos importantes
4. Describir relaciones con otros módulos

### Fase 3: Crear guia-uso.md

1. Documentar cómo acceder desde el menú
2. Describir la pantalla principal
3. Crear guía paso a paso para cada acción:
   - Crear nuevo registro
   - Buscar y filtrar
   - Ver detalle
   - Editar registro
   - Acciones especiales (aprobar, cerrar, etc.)
4. Agregar consejos y preguntas frecuentes

### Fase 4: Crear prompt-capturas.md

1. Listar todas las pantallas importantes
2. Definir nombre de archivo para cada captura
3. Escribir prompt completo para tomar capturas

### Fase 5: Actualizar Roadmap

1. Marcar módulo como completado
2. Pasar al siguiente módulo

---

## 📝 Plantillas de Ejemplo

### Ver carpeta `00-introduccion/` para ejemplos completos de:
- descripcion.md
- guia-uso.md
- prompt-capturas.md

---

## ⚠️ Reglas Importantes

### Para descripcion.md
- Escribir como si explicaras a alguien que nunca usó un sistema
- Usar ejemplos concretos del día a día
- Evitar jerga técnica

### Para guia-uso.md
- Ser extremadamente específico: "botón azul con ícono de +"
- Describir exactamente dónde hacer clic
- Incluir qué esperar después de cada acción
- Usar formato de pasos numerados

### Para prompt-capturas.md
- Incluir todas las pantallas mencionadas en los otros documentos
- Usar nombres de archivo consistentes
- Incluir instrucciones de navegación claras

---

## 🚀 Orden de Ejecución Recomendado

1. **Primero**: Módulos de alta prioridad y uso frecuente
   - 12-dashboard, 01-empleados, 06-proyectos, 04-finanzas

2. **Segundo**: Módulos operativos principales
   - 07-inventario, 09-procura, 17-produccion, 18-afe

3. **Tercero**: Módulos de soporte
   - 10-hse, 11-documentos, 16-calidad, 22-permisos-trabajo

4. **Cuarto**: Módulos administrativos
   - 13-usuarios, 25-configuracion, 23-notificaciones

---

## 📊 Progreso

- **Total de módulos**: 26
- **Completados**: 26
- **En progreso**: 0
- **Pendientes**: 0

---

*Última actualización: [Fecha]*
