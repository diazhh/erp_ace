const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Certification = sequelize.define('Certification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('ISO_9001', 'ISO_14001', 'ISO_45001', 'ISO_27001', 'API', 'ASME', 'OHSAS', 'HACCP', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    type_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Custom type name if OTHER',
    },
    issuing_body: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    certificate_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Certification scope',
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    last_audit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    next_audit_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'SUSPENDED', 'WITHDRAWN', 'PENDING'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    surveillance_frequency: {
      type: DataTypes.ENUM('ANNUAL', 'SEMI_ANNUAL', 'QUARTERLY', 'OTHER'),
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    responsible_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id',
      },
      comment: 'Person responsible for maintaining certification',
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'certifications',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['expiry_date'] },
      { fields: ['next_audit_date'] },
      { fields: ['department_id'] },
      { fields: ['responsible_id'] },
    ],
  });

  return Certification;
};
