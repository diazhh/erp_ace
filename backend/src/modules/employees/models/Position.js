const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Position = sequelize.define('Position', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    // Departamento al que pertenece
    departmentId: {
      type: DataTypes.UUID,
      field: 'department_id',
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    // Nivel jerárquico (para organigrama)
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '0=CEO, 1=Director, 2=Gerente, 3=Coordinador, 4=Analista, 5=Asistente',
    },
    // Rango salarial
    minSalary: {
      type: DataTypes.DECIMAL(15, 2),
      field: 'min_salary',
    },
    maxSalary: {
      type: DataTypes.DECIMAL(15, 2),
      field: 'max_salary',
    },
    salaryCurrency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
      field: 'salary_currency',
    },
    // Requisitos
    requirements: {
      type: DataTypes.TEXT,
    },
    // Responsabilidades
    responsibilities: {
      type: DataTypes.TEXT,
    },
    // Competencias requeridas
    competencies: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    // Es posición de supervisión
    isSupervisory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_supervisory',
    },
    // Cantidad máxima de posiciones
    maxHeadcount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'max_headcount',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'ACTIVE',
    },
  }, {
    tableName: 'positions',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['department_id'] },
      { fields: ['level'] },
      { fields: ['status'] },
    ],
  });

  return Position;
};
