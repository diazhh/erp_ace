const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WhatsAppLog = sequelize.define('WhatsAppLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'template_id',
      references: {
        model: 'whatsapp_templates',
        key: 'id',
      },
      comment: 'Template used (null if sent without template)',
    },
    templateCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'template_code',
    },
    toPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'to_phone',
    },
    toName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'to_name',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Final message sent (with variables replaced)',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'),
      defaultValue: 'PENDING',
    },
    messageId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'message_id',
      comment: 'WhatsApp message ID',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'sent_at',
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delivered_at',
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'read_at',
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional data: variables used, context, etc.',
    },
    sentBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'sent_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'whatsapp_logs',
    timestamps: true,
    underscored: true,
  });

  return WhatsAppLog;
};
