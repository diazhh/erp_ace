const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryUnitHistory = sequelize.define('InventoryUnitHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Unidad a la que pertenece este registro
    unitId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'unit_id',
      comment: 'Unidad de inventario',
    },
    // Tipo de evento/acción
    eventType: {
      type: DataTypes.ENUM(
        // Eventos de entrada
        'CREATED',              // Unidad creada/registrada
        'RECEIVED',             // Recibida de proveedor
        
        // Eventos de movimiento
        'TRANSFERRED',          // Transferida entre almacenes
        'RELOCATED',            // Reubicada dentro del mismo almacén
        
        // Eventos de asignación
        'ASSIGNED',             // Asignada a empleado/proyecto
        'UNASSIGNED',           // Desasignada
        'REASSIGNED',           // Reasignada a otro empleado/proyecto
        
        // Eventos de entrega/devolución
        'DELIVERED',            // Entregada a empleado
        'RETURNED',             // Devuelta por empleado
        'RETURN_ACCEPTED',      // Devolución aceptada
        'RETURN_REJECTED',      // Devolución rechazada (daño, etc.)
        
        // Eventos de estado
        'STATUS_CHANGED',       // Cambio de estado general
        'CONDITION_CHANGED',    // Cambio de condición física
        'DAMAGED',              // Marcada como dañada
        'REPAIRED',             // Reparada
        'LOST',                 // Reportada como perdida
        'FOUND',                // Encontrada después de perdida
        
        // Eventos de mantenimiento
        'MAINTENANCE_STARTED',  // Inicio de mantenimiento
        'MAINTENANCE_COMPLETED',// Mantenimiento completado
        
        // Eventos de baja
        'RETIRED',              // Dada de baja
        'DISPOSED',             // Desechada
        'SOLD',                 // Vendida
        'DONATED',              // Donada
        
        // Eventos de reserva
        'RESERVED',             // Reservada
        'RESERVATION_CANCELLED',// Reserva cancelada
        
        // Otros
        'NOTE_ADDED',           // Nota agregada
        'ADJUSTED',             // Ajuste de inventario
        'AUDITED'               // Auditada/verificada
      ),
      allowNull: false,
      field: 'event_type',
      comment: 'Tipo de evento',
    },
    // Fecha y hora del evento
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'event_date',
      comment: 'Fecha y hora del evento',
    },
    // Descripción del evento
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción detallada del evento',
    },
    // === DATOS DE UBICACIÓN ===
    // Almacén anterior
    fromWarehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'from_warehouse_id',
      comment: 'Almacén de origen',
    },
    // Almacén nuevo/destino
    toWarehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'to_warehouse_id',
      comment: 'Almacén de destino',
    },
    // Ubicación anterior dentro del almacén
    fromLocation: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'from_location',
    },
    // Ubicación nueva dentro del almacén
    toLocation: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'to_location',
    },
    
    // === DATOS DE ESTADO ===
    // Estado anterior
    fromStatus: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'from_status',
      comment: 'Estado anterior de la unidad',
    },
    // Estado nuevo
    toStatus: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'to_status',
      comment: 'Estado nuevo de la unidad',
    },
    // Condición anterior
    fromCondition: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'from_condition',
    },
    // Condición nueva
    toCondition: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'to_condition',
    },
    
    // === DATOS DE ASIGNACIÓN ===
    // Empleado anterior
    fromEmployeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'from_employee_id',
      comment: 'Empleado anterior',
    },
    // Empleado nuevo
    toEmployeeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'to_employee_id',
      comment: 'Empleado nuevo',
    },
    // Proyecto anterior
    fromProjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'from_project_id',
      comment: 'Proyecto anterior',
    },
    // Proyecto nuevo
    toProjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'to_project_id',
      comment: 'Proyecto nuevo',
    },
    
    // === PERSONAS INVOLUCRADAS ===
    // Quien realizó la acción
    performedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'performed_by',
      comment: 'Usuario que realizó la acción',
    },
    // Quien entregó (si aplica)
    deliveredBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'delivered_by',
      comment: 'Empleado que entregó la unidad',
    },
    // Quien recibió (si aplica)
    receivedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'received_by',
      comment: 'Empleado que recibió la unidad',
    },
    // Quien autorizó (si requiere autorización)
    authorizedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'authorized_by',
      comment: 'Usuario que autorizó la acción',
    },
    
    // === REFERENCIAS ===
    // Referencia a documento relacionado
    referenceType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'reference_type',
      comment: 'Tipo de documento de referencia (PurchaseOrder, Project, etc.)',
    },
    referenceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reference_id',
      comment: 'ID del documento de referencia',
    },
    referenceCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'reference_code',
      comment: 'Código del documento de referencia',
    },
    
    // === DATOS ADICIONALES ===
    // Razón del evento
    reason: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Razón o motivo del evento',
    },
    // Notas adicionales
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Datos adicionales en JSON
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Datos adicionales del evento',
    },
    // Firma digital o confirmación (para entregas)
    signatureUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'signature_url',
      comment: 'URL de firma digital de recepción',
    },
    // Fotos de evidencia
    photoUrls: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'photo_urls',
      comment: 'URLs de fotos de evidencia',
    },
    // Coordenadas GPS (para entregas en campo)
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
  }, {
    tableName: 'inventory_unit_history',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['unit_id'] },
      { fields: ['event_type'] },
      { fields: ['event_date'] },
      { fields: ['from_warehouse_id'] },
      { fields: ['to_warehouse_id'] },
      { fields: ['from_employee_id'] },
      { fields: ['to_employee_id'] },
      { fields: ['from_project_id'] },
      { fields: ['to_project_id'] },
      { fields: ['performed_by'] },
      { fields: ['reference_type', 'reference_id'] },
      // Índice compuesto para consultas de historial
      { fields: ['unit_id', 'event_date'] },
      { fields: ['unit_id', 'event_type'] },
    ],
  });

  return InventoryUnitHistory;
};
