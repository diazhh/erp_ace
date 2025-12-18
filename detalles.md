Página de Dashboard:
título de gráfico no cambia de idioma
algunos Cards de navegación tienen elementos que no responden al cambio de idioma,
subtítulos de proyectos activos, balance general, items de inventario, vehículos y títulos de pendientes por conciliar

cards de debajo de gráfico no cambian de idioma

Página de Empleados:
en lista principal, columna código, departamento y cargo no cambian de idioma
paginación no funciona bien.. dice que hay 12 empleados, y debería mostrar 12 registros pero muestra 9
estatus “En licencia” no cambia de idioma
tooltips de acciones no cambian de idioma
en detalles de empleado:
boton “descargar pdf” no cambia de idioma
pdf de empleado siempre sale en español (no seguro si es bug)
faltan semillas de cuentas (https://erp.atilax.io/employees/9d950398-67d2-490b-b929-b7405d103c2c)
faltan relación o semillas de jerarquía
en pestaña de NÓMINA, el estatus de la lista no cambia de idioma
falta semilla de préstamos
en pestaña de DOCUMENTOS, no se puede descargar los archivos subidos ({"success":false,"status":"fail","message":"Ruta /api/uploads/employees/profiles/2025/12/cc26b8f5-3a8e-46e3-80ff-aecac4d9b400.png no encontrada"}), ni visualizar imágenes en los cards ni en modal de visualización
falta semillas de auditoría
	en Edición de Empleado:
detalle, la posición y el departamento parecen ser campos de texto por lo que se explica que no se traduzcan bien en otros lados
tambien hay departamentos y posicion de estructura que si son con enums pero no cambian de idioma
la fecha de nacimiento se editó a 17/12/2025 pero se guardó con 16/12/2025

Sección ORGANIZACIÓN 

Organigrama:
ninguno de los elementos cambia de idioma
Directorio:
no cambia de idioma
el filtro de departamentos no cambia de idioma
el filtro de departamentos no funciona, al aplicar cualquiera de las opciones no muestra ningún resultado, pero en “todos” si muestra registros
la acción de correo si abre la aplicación de correo del cliente, la opción de llamar hace un intento de abrir una aplicación pero no hace nada
Departamentos:
no cambia de idioma
falta página de detalles y edición
no hay paginación ni filtros
Cargos:
no cambia de idioma
al eliminar un cargo (code: APRO) y volverlo a crear no me deja porque “el code ya existe” aunque refresque la pagina y el cargo seguía eliminado, algo debió quedar en la BD, con código distinto (APRO1) si me dejo agregar el cargo
falta página de detalles y edición
no hay paginación ni filtros


Sección NÓMINA:

Periodos:
	Página de detalles:
Card de información de periodo, Tipo de periodo, no cambia de idioma (BIWEEKLY)
boton de descargar pdf no cambia de idioma
encabezado de pdf se monta información haciendo ilegible el documento

en la lista de entradas de nomina, el status no cambia de idioma y le falta paginacion.
no se muestran las acciones de la lista de entradas de nomina
Prestamos:
filtro de tipo de prestamo no cambia de idioma
filtro de tipo de prestamo no tiene efecto sobre la lista, siempre se muestran todos los registros
pdf de prestamos tiene formato que hace dificil la lectura de los montos en la seccion superior

	Nuevo prestamo:
TextArea de Notas no cambia de idioma
botones de acciones de cancelar o crear nuevo prestamo no cambian de idioma
	Pagina de Detalles:
boton de descargar pdf no cambia de idioma
en archivos adjuntos no se ven los archivos subidos ni se pueden descargar correctamente


Seccion FINANZAS

Dashboard:
la unica seccion que responde al cambio de idioma es el card de “saldos por moneda” de resto ningun elemento cambia de idioma
el boton de nueva transaccion lleva a la pagina de nueva transaccion pero dice por defecto nuevo gasto, diferente a si desde la pagina de transacciones se elige si sera nuevo ingreso o nuevo gasto
Transacciones:
el unico elemento que responde al cambio de idioma es el label de filtro de estatus
las acciones de agregar ingreso y agregar gasto dan un error 500 en el navegador ({"success":false,"status":"error","message":"Error interno del servidor"}).. la accion de agregar transferencia si funciona
las paginas de agregar ingreso / gasto no cambian de idioma
la pagina de detalles de transaccion no cambia de idioma
en la pestaña de agregar archivos no se ven o descargan los archivos subidos
Cuentas Bancarias:
la pagina de crear cuenta bancaria no cambia de idioma
la pagina de editar cuenta bancaria no cambia de idioma
Detalles:
las pestañas de la pagina de detalles no cambian de idioma
descargar pdf no funciona. error 500
la pestaña de transferencias no esta funcionando bien. En la cuenta de bs hay una transaccion de tipo transferencia que se refleja en la pestaña de transacciones pero no en la de transferencias

 

Seccion de Caja Chica

Cajas:
item del menu lateral no cambia de idioma
pagina principal no cambia de idioma
pagina de crear caja chica no cambia de idioma
al crear la caja chica no toma en cuenta el codigo que le puse, le creo uno propio
en la pagina de detalles de la caja el boton de editar abre un modal, no lleva a la pagina de editar que se usa en la vista principal
no deja descargar el pdf de la caja. error 500
boton de actualizar no hace nada
en la seccion de informacion veo que hay un mensaje de que la caja no esta asociada a ninguna cuenta bancaria, pero no hay una accion dentro de esta interfaz para asociarla a alguna cuenta bancaria
al momento de reponer la caja me deja realizar la accion asi no este asociada a ninguna cuenta con un mensaje resaltando este detalle
al momento de reponer la caja me pide que suba un archivo de comprobante pero al entrar en los detalles de los movimientos no veo el archivo subido, medeja subir nuevos archivos con el mismo problema de que no se ven ni descargan
error en generar el pdf del detalle de movimiento
pagina de detalles de movimiento no cambia de idioma
las acciones de reponer y registrar gasto se hacen con modales, funcionan pero no cambian de idioma
al registrar gastos tiene los mismo detalles con los archivos comprobantes que tiene la accion de reponer
no existe un boton para eliminar Caja
