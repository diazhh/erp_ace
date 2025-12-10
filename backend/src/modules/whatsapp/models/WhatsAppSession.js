const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WhatsAppSession = sequelize.define('WhatsAppSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      field: 'session_id',
      defaultValue: 'main',
    },
    status: {
      type: DataTypes.ENUM('disconnected', 'connecting', 'connected', 'qr_pending'),
      defaultValue: 'disconnected',
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone_number',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lastConnected: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_connected',
    },
    lastDisconnected: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_disconnected',
    },
    authData: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'auth_data',
      comment: 'JSON serialized auth state',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  }, {
    tableName: 'whatsapp_sessions',
    timestamps: true,
    underscored: true,
  });

  return WhatsAppSession;
};
