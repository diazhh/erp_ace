const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WellLog = sequelize.define('WellLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    well_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'wells',
        key: 'id',
      },
    },
    log_type: {
      type: DataTypes.ENUM(
        'MAINTENANCE',      // Mantenimiento preventivo/correctivo
        'WORKOVER',         // Intervención mayor
        'INCIDENT',         // Incidente/problema
        'INSPECTION',       // Inspección
        'PRODUCTION_TEST',  // Prueba de producción
        'EQUIPMENT_CHANGE', // Cambio de equipo
        'STIMULATION',      // Estimulación
        'COMPLETION',       // Completación
        'PERFORATION',      // Perforación/reperforación
        'GENERAL'           // Nota general
      ),
      allowNull: false,
      defaultValue: 'GENERAL',
    },
    log_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'OPEN',
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    downtime_hours: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    cost_estimated: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    cost_actual: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    contractor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contractors',
        key: 'id',
      },
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    purchase_order_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'purchase_orders',
        key: 'id',
      },
    },
    findings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actions_taken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    next_action_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    responsible_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'well_logs',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['well_id'] },
      { fields: ['log_type'] },
      { fields: ['log_date'] },
      { fields: ['status'] },
      { fields: ['project_id'] },
      { fields: ['contractor_id'] },
    ],
  });

  return WellLog;
};
