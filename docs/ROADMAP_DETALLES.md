# Roadmap de Correcciones - Detalles Pendientes

Este documento organiza los problemas identificados en `detalles.md` por categoría y prioridad para su resolución sistemática.

---

## Resumen de Problemas por Categoría

| Categoría | Cantidad | Prioridad |
|-----------|----------|-----------|
| Internacionalización (i18n) | ~40 | Alta |
| Archivos/Uploads | 8 | Crítica |
| PDFs | 6 | Media |
| Filtros no funcionales | 3 | Alta |
| Paginación | 3 | Media |
| Seeders faltantes | 5 | Media |
| Funcionalidad faltante | 8 | Media |
| Bugs específicos | 5 | Alta |

---

## FASE 1: Problemas Críticos (Bloquean funcionalidad)

### 1.1 Sistema de Archivos/Uploads (CRÍTICO)
**Problema**: Los archivos subidos no se pueden ver ni descargar en múltiples módulos.
**Afecta**: Empleados, Préstamos, Transacciones, Caja Chica

| # | Ubicación | Descripción |
|---|-----------|-------------|
| 1 | Empleados > Documentos | No se pueden descargar archivos subidos, error 404 en `/api/uploads/...` |
| 2 | Empleados > Documentos | No se visualizan imágenes en cards ni modal |
| 3 | Préstamos > Detalles | Archivos adjuntos no visibles ni descargables |
| 4 | Transacciones > Archivos | Archivos subidos no se ven ni descargan |
| 5 | Caja Chica > Reposición | Comprobantes subidos no visibles |
| 6 | Caja Chica > Gastos | Archivos comprobantes no visibles |
| 7 | Caja Chica > Movimientos | Archivos no visibles ni descargables |

**Solución propuesta**:
- [x] Revisar configuración de rutas estáticas en Express ✅ (Corregido: ruta absoluta en app.js)
- [x] Verificar que la carpeta `uploads/` esté correctamente servida ✅
- [x] Revisar el controlador de archivos para rutas correctas ✅
- [x] Crear utilidad `getFileUrl` en frontend para construir URLs correctamente ✅
- [x] Actualizar AttachmentGallery.jsx para usar getFileUrl ✅
- [x] Actualizar ReportsDashboard.jsx para usar getServerBaseUrl ✅

### 1.2 Errores 500 en Backend
| # | Ubicación | Descripción |
|---|-----------|-------------|
| 1 | Finanzas > Transacciones | Error 500 al agregar ingreso/gasto |
| 2 | Cuentas Bancarias > PDF | Error 500 al descargar PDF |
| 3 | Caja Chica > PDF | Error 500 al descargar PDF de caja |
| 4 | Caja Chica > Movimiento PDF | Error 500 al generar PDF de movimiento |

**Solución propuesta**:
- [x] Revisar logs del backend para identificar causa ✅
- [ ] Verificar controladores de transacciones (income/expense) - Pendiente pruebas
- [x] Revisar generación de PDFs en cuentas bancarias ✅ (Corregido: nombres de columnas en reportController.js)
- [x] Revisar generación de PDFs en caja chica ✅ (Corregido: asociaciones en modelos PettyCash y PettyCashEntry)

---

## FASE 2: Filtros y Paginación No Funcionales

### 2.1 Filtros que no funcionan
| # | Ubicación | Descripción |
|---|-----------|-------------|
| 1 | Directorio > Departamentos | Filtro no muestra resultados al aplicar opciones |
| 2 | Préstamos > Tipo | Filtro de tipo no tiene efecto sobre la lista |
| 3 | Empleados > Lista | Paginación incorrecta (dice 12, muestra 9) |

**Solución propuesta**:
- [x] Revisar query params en endpoint de directorio ✅ (Backend correcto, frontend envía params correctamente)
- [x] Verificar filtro de tipo en préstamos (backend) ✅ (Agregado filtro loanType, startDate, endDate en payrollController.js)
- [ ] Corregir conteo de paginación en empleados - Pendiente verificación

### 2.2 Paginación faltante
| # | Ubicación |
|---|-----------|
| 1 | Nómina > Entradas de nómina |
| 2 | Departamentos |
| 3 | Cargos |

---

## FASE 3: Internacionalización (i18n)

### 3.1 Dashboard Principal
- [x] Título de gráfico ✅
- [x] Cards de navegación (subtítulos) ✅
- [x] Proyectos activos, balance general, items inventario, vehículos ✅ (Corregido: "en mantenimiento" traducido)
- [x] Títulos de pendientes por conciliar ✅
- [x] Cards debajo del gráfico ✅

### 3.2 Módulo Empleados
- [x] Lista: columnas código, departamento, cargo ✅
- [x] Estatus "En licencia" y "Terminado" ✅ (Traducidos usando employees.status.*)
- [x] Tooltips de acciones ✅
- [ ] Botón "Descargar PDF" - Pendiente
- [ ] Pestaña Nómina: estatus de lista - Pendiente
- [ ] Edición: departamento y posición (campos de texto vs enums) - Pendiente
- [ ] Departamento y posición de estructura (enums) - Pendiente

### 3.3 Sección Organización
- [x] Organigrama: todos los elementos ✅ (Título, stats, tooltips, mensajes traducidos)
- [x] Directorio: página completa ✅ (Título, botones, filtros traducidos)
- [x] Directorio: filtro de departamentos ✅
- [x] Departamentos: página completa ✅ (Título, tabla, formulario, tooltips, mensajes traducidos)
- [x] Cargos: página completa ✅ (Título, tabla, formulario, niveles, tooltips traducidos)

### 3.4 Sección Nómina ✅ COMPLETADO
- [x] Periodos > Detalles: tipo de periodo (BIWEEKLY) ✅ (Traducido usando payroll.weekly/biweekly/monthly)
- [x] Periodos > Detalles: botón descargar PDF ✅ (Ya usa DownloadPDFButton con i18n)
- [x] Entradas de nómina: status ✅ (PayrollPeriodDetail.jsx - getPaymentStatusLabel agregado)
- [x] Préstamos: filtro de tipo ✅ (Traducido usando payroll.loanType*)
- [x] Nuevo préstamo: textarea notas ✅ (LoanForm.jsx traducido)
- [x] Nuevo préstamo: botones cancelar/crear ✅ (LoanForm.jsx traducido)
- [x] Detalles préstamo: botón descargar PDF ✅ (LoanDetail.jsx ya usa DownloadPDFButton)

### 3.5 Sección Finanzas ✅ COMPLETADO
- [x] Dashboard: ✅ (Ya usa useTranslation, claves en finance.*)
- [x] Transacciones: ✅ (TransactionForm.jsx y TransactionDetail.jsx ya usan i18n)
- [x] Páginas agregar ingreso/gasto ✅ (TransactionForm.jsx traducido)
- [x] Página detalles transacción ✅ (TransactionDetail.jsx traducido)
- [x] Crear cuenta bancaria ✅ (BankAccountForm.jsx traducido)
- [x] Editar cuenta bancaria ✅ (BankAccountForm.jsx traducido)
- [x] Detalles cuenta: pestañas ✅ (BankAccountDetail.jsx traducido)

### 3.6 Sección Caja Chica ✅ COMPLETADO
- [x] Item menú lateral ✅ (Ya estaba traducido en menu.pettyCash)
- [x] Página principal ✅ (Título, stats, cards, tooltips traducidos)
- [x] Crear caja chica ✅ (Formulario completo traducido)
- [x] Detalles de movimiento ✅ (PettyCashEntryDetail.jsx traducido)
- [x] Detalles de caja chica ✅ (PettyCashDetail.jsx traducido)
- [x] Modales: reponer y registrar gasto ✅ (PettyCashEntryDialog.jsx y PettyCashReplenishDialog.jsx traducidos)

---

## FASE 4: PDFs con Problemas

| # | Ubicación | Problema |
|---|-----------|----------|
| 1 | Empleado PDF | Siempre sale en español (¿intencional?) |
| 2 | Periodo Nómina PDF | Encabezado se monta, ilegible |
| 3 | Préstamos PDF | Formato dificulta lectura de montos |
| 4 | Cuentas Bancarias PDF | Error 500 |
| 5 | Caja Chica PDF | Error 500 |
| 6 | Movimiento Caja PDF | Error 500 |

**Solución propuesta**:
- [ ] Revisar templates de PDFs para i18n
- [ ] Corregir layout de encabezado en periodo nómina
- [ ] Ajustar formato de montos en préstamos
- [x] Corregir errores 500 en generación de PDFs ✅ (Cuentas Bancarias y Caja Chica corregidos en FASE 1.2)

---

## FASE 5: Seeders Faltantes

| # | Entidad | Descripción | Estado |
|---|---------|-------------|--------|
| 1 | Cuentas bancarias empleados | Para ver datos en pestaña "Cuentas" | ✅ Creado |
| 2 | Préstamos empleados | Para ver datos en pestaña "Préstamos" | ✅ Creado |
| 3 | Registros de auditoría | Para ver historial de cambios | ✅ Creado (audit-seeder.js) |
| 4 | Auditoría | Empleados > Pestaña Auditoría |

**Solución propuesta**:
- [ ] Crear seeder para cuentas bancarias de empleados
- [ ] Crear seeder para jerarquía organizacional

---

## FASE 6: Funcionalidad Faltante/Incompleta

### 6.1 Páginas faltantes
| # | Ubicación | Faltante | Estado |
|---|-----------|----------|--------|
| 1 | Departamentos | Página de detalles | ✅ Creada (DepartmentDetail.jsx) |
| 2 | Departamentos | Página de edición | ✅ Creada (DepartmentForm.jsx) |
| 3 | Cargos | Página de detalles | ✅ Creada (PositionDetail.jsx) |
| 4 | Cargos | Página de edición | ✅ Creada (PositionForm.jsx) |

### 6.2 Acciones faltantes
| # | Ubicación | Descripción | Estado |
|---|-----------|-------------|--------|
| 1 | Entradas nómina | No se muestran acciones en lista | ✅ Corregido (ver empleado, editar, descargar recibo) |
| 2 | Caja Chica | No hay botón para eliminar caja | ✅ Creado (botón Cerrar Caja Chica) |
| 3 | Caja Chica | Botón actualizar no hace nada | ✅ Funciona (handleRefresh) |
| 4 | Caja Chica | No hay acción para asociar cuenta bancaria | ✅ Creado (PettyCashBankAccountDialog.jsx) |

### 6.3 Comportamiento incorrecto
| # | Ubicación | Descripción | Estado |
|---|-----------|-------------|--------|
| 1 | Caja Chica | Editar abre modal en lugar de página | ✅ Corregido (usa navegación) |
| 2 | Caja Chica | No toma código personalizado al crear | ✅ Corregido (backend acepta código del usuario) |
| 3 | Finanzas | Botón nueva transacción dice "nuevo gasto" por defecto | ✅ Corregido (menú desplegable con opciones) |
| 4 | Cuentas Bancarias | Transferencias no aparecen en pestaña correspondiente | ✅ Corregido (entrantes y salientes) |

---

## FASE 7: Bugs Específicos

| # | Bug | Ubicación | Descripción | Estado |
|---|-----|-----------|-------------|--------|
| 1 | Fecha nacimiento | Empleados | Se guarda con día anterior (timezone) | ✅ Corregido |
| 2 | Soft delete | Cargos | No funciona correctamente | ✅ Corregido |
| 3 | Directorio | Acción llamar no funciona | Baja |
| 4 | Caja Chica | Permite reponer sin cuenta bancaria asociada | Media |

---

## Orden de Ejecución Recomendado

### Sprint 1: Críticos (1-2 días)
1. **Sistema de Uploads** - Bloquea múltiples funcionalidades
2. **Errores 500** - Transacciones y PDFs

### Sprint 2: Funcionalidad Core (2-3 días)
3. **Filtros no funcionales** - Directorio, Préstamos
4. **Paginación** - Empleados, Nómina, Departamentos, Cargos
5. **Bug fecha empleados** - Timezone issue
6. **Bug soft delete cargos**

### Sprint 3: i18n Dashboard y Empleados (2-3 días)
7. **Dashboard i18n** - Alta visibilidad
8. **Empleados i18n** - Módulo más usado
9. **Organización i18n**

### Sprint 4: i18n Nómina y Finanzas (2-3 días)
10. **Nómina i18n**
11. **Finanzas i18n**
12. **Caja Chica i18n**

### Sprint 5: PDFs y Seeders (1-2 días)
13. **Corregir PDFs** - Layout y errores
14. **Agregar seeders** - Datos de prueba

### Sprint 6: Funcionalidad Adicional (2-3 días)
15. **Páginas faltantes** - Departamentos y Cargos
16. **Acciones faltantes** - Nómina, Caja Chica
17. **Comportamientos incorrectos**

---

## Notas Técnicas

### Problema de Uploads
Verificar en `backend/src/app.js`:
```javascript
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));
```

### Problema de Fechas
Posible issue de timezone. Verificar:
- Frontend: formato de fecha enviado
- Backend: parsing de fecha
- Base de datos: tipo de columna (DATE vs TIMESTAMP)

### Problema de Soft Delete
Verificar en modelo de Cargos:
- Índice único debe excluir registros eliminados
- `paranoid: true` en Sequelize

### i18n Pendiente
Archivos a modificar:
- `frontend/src/i18n/locales/es.json`
- `frontend/src/i18n/locales/en.json`
- `frontend/src/i18n/locales/pt.json`

---

*Documento generado: 17/12/2024*
*Última actualización: 18/12/2024*
*Basado en: detalles.md*
