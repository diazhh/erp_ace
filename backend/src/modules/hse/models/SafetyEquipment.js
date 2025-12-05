const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SafetyEquipment = sequelize.define('SafetyEquipment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Código del equipo (ej: EPP-2025-001)',
    },
    // Tipo de equipo
    equipmentType: {
      type: DataTypes.ENUM(
        'HELMET',             // Casco
        'SAFETY_GLASSES',     // Lentes de seguridad
        'FACE_SHIELD',        // Careta
        'EAR_PLUGS',          // Tapones auditivos
        'EAR_MUFFS',          // Orejeras
        'RESPIRATOR',         // Respirador
        'DUST_MASK',          // Mascarilla
        'GLOVES',             // Guantes
        'SAFETY_BOOTS',       // Botas de seguridad
        'SAFETY_VEST',        // Chaleco reflectivo
        'HARNESS',            // Arnés
        'LANYARD',            // Línea de vida
        'FIRE_EXTINGUISHER',  // Extintor
        'FIRST_AID_KIT',      // Botiquín
        'SAFETY_CONE',        // Cono de seguridad
        'SAFETY_TAPE',        // Cinta de seguridad
        'EMERGENCY_LIGHT',    // Luz de emergencia
        'SPILL_KIT',          // Kit de derrames
        'OTHER'
      ),
      allowNull: false,
      field: 'equipment_type',
    },
    // Información del equipo
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'serial_number',
    },
    // Fechas
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'purchase_date',
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
      comment: 'Fecha de vencimiento (si aplica)',
    },
    lastInspectionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'last_inspection_date',
    },
    nextInspectionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'next_inspection_date',
    },
    // Asignación
    assignedToId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_id',
      comment: 'Empleado al que está asignado',
    },
    assignedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'assigned_date',
    },
    // Ubicación
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Ubicación del equipo (si no está asignado)',
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'warehouse_id',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'project_id',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'AVAILABLE',    // Disponible
        'ASSIGNED',     // Asignado
        'IN_USE',       // En uso
        'MAINTENANCE',  // En mantenimiento
        'EXPIRED',      // Vencido
        'DAMAGED',      // Dañado
        'DISPOSED'      // Descartado
      ),
      allowNull: false,
      defaultValue: 'AVAILABLE',
    },
    condition: {
      type: DataTypes.ENUM('NEW', 'GOOD', 'FAIR', 'POOR'),
      allowNull: false,
      defaultValue: 'NEW',
    },
    // Cantidad (para items consumibles)
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    // Certificaciones
    certificationRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'certification_required',
    },
    certificationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'certification_number',
    },
    certificationExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'certification_expiry_date',
    },
    // Costo
    cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'safety_equipment',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['equipment_type'] },
      { fields: ['status'] },
      { fields: ['assigned_to_id'] },
      { fields: ['expiry_date'] },
      { fields: ['next_inspection_date'] },
    ],
  });

  SafetyEquipment.associate = (models) => {
    SafetyEquipment.belongsTo(models.Employee, {
      as: 'assignedTo',
      foreignKey: 'assignedToId',
    });
    SafetyEquipment.belongsTo(models.Warehouse, {
      as: 'warehouse',
      foreignKey: 'warehouseId',
    });
    SafetyEquipment.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId',
    });
    SafetyEquipment.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy',
    });
  };

  return SafetyEquipment;
};
