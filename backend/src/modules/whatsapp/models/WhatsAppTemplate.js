const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WhatsAppTemplate = sequelize.define('WhatsAppTemplate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Unique code for template: VERIFY_CODE, WELCOME, REMINDER, etc.',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Message template with {{variable}} placeholders',
    },
    variables: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'List of available variables: [{name, description}]',
    },
    category: {
      type: DataTypes.ENUM('NOTIFICATION', 'REMINDER', 'VERIFICATION', 'MARKETING', 'TRANSACTIONAL', 'OTHER'),
      defaultValue: 'NOTIFICATION',
      comment: 'Template category for organization',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    isSystem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_system',
      comment: 'System templates cannot be deleted',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'updated_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'whatsapp_templates',
    timestamps: true,
    underscored: true,
  });

  return WhatsAppTemplate;
};
