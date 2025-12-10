const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Unique code for template: VERIFY_EMAIL, WELCOME, PASSWORD_RESET',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bodyHtml: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'body_html',
    },
    bodyText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'body_text',
    },
    variables: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'List of available variables: [{name, description}]',
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
    tableName: 'email_templates',
    timestamps: true,
    underscored: true,
  });

  return EmailTemplate;
};
