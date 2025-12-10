const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QualityInspection = sequelize.define('QualityInspection', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único de la inspección (ej: QI-001)',
    },
    // Relaciones
    qualityPlanId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'quality_plan_id',
      references: {
        model: 'quality_plans',
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    // Tipo de inspección
    inspectionType: {
      type: DataTypes.ENUM(
        'RECEIVING',      // Inspección de recepción (materiales)
        'IN_PROCESS',     // Inspección en proceso
        'FINAL',          // Inspección final
        'DIMENSIONAL',    // Inspección dimensional
        'VISUAL',         // Inspección visual
        'FUNCTIONAL',     // Prueba funcional
        'DESTRUCTIVE',    // Prueba destructiva
        'NON_DESTRUCTIVE' // Prueba no destructiva (NDT)
      ),
      allowNull: false,
      field: 'inspection_type',
    },
    // Información de la inspección
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Elemento inspeccionado
    inspectedItem: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'inspected_item',
      comment: 'Elemento/material/trabajo inspeccionado',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Ubicación de la inspección',
    },
    // Fechas
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'scheduled_date',
    },
    inspectionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'inspection_date',
    },
    // Resultado
    result: {
      type: DataTypes.ENUM('PENDING', 'PASS', 'FAIL', 'CONDITIONAL'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    // Criterios de aceptación específicos
    acceptanceCriteria: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'acceptance_criteria',
    },
    // Hallazgos
    findings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Mediciones/Datos
    measurementData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'measurement_data',
      comment: 'Datos de mediciones en formato JSON',
    },
    // Inspector
    inspectorId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'inspector_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    // Testigo del cliente (si aplica)
    clientWitness: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'client_witness',
    },
    // Equipos utilizados
    equipmentUsed: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'equipment_used',
    },
    // Referencia a documentos/procedimientos
    procedureReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'procedure_reference',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
  }, {
    tableName: 'quality_inspections',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['project_id'] },
      { fields: ['quality_plan_id'] },
      { fields: ['inspection_type'] },
      { fields: ['result'] },
      { fields: ['inspection_date'] },
      { fields: ['inspector_id'] },
    ],
  });

  return QualityInspection;
};
