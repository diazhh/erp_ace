const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TrainingAttendance = sequelize.define('TrainingAttendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trainingId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'training_id',
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'employee_id',
    },
    // Estado de asistencia
    status: {
      type: DataTypes.ENUM(
        'REGISTERED',   // Registrado
        'CONFIRMED',    // Confirmado
        'ATTENDED',     // Asistió
        'ABSENT',       // Ausente
        'CANCELLED'     // Cancelado
      ),
      allowNull: false,
      defaultValue: 'REGISTERED',
    },
    // Evaluación
    evaluationScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'evaluation_score',
      comment: 'Puntuación obtenida en la evaluación',
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Aprobó la capacitación',
    },
    // Certificado
    certificateIssued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'certificate_issued',
    },
    certificateNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'certificate_number',
    },
    certificateExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'certificate_expiry_date',
    },
    certificateUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'certificate_url',
    },
    // Observaciones
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'training_attendances',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['training_id'] },
      { fields: ['employee_id'] },
      { fields: ['status'] },
      { fields: ['training_id', 'employee_id'], unique: true },
    ],
  });

  TrainingAttendance.associate = (models) => {
    TrainingAttendance.belongsTo(models.Training, {
      as: 'training',
      foreignKey: 'trainingId',
    });
    TrainingAttendance.belongsTo(models.Employee, {
      as: 'employee',
      foreignKey: 'employeeId',
    });
  };

  return TrainingAttendance;
};
