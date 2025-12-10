const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CrmQuote = sequelize.define('CrmQuote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único de la cotización (ej: COT-001)',
    },
    // Relaciones
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'client_id',
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    opportunityId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'opportunity_id',
      references: {
        model: 'opportunities',
        key: 'id',
      },
    },
    contactId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'contact_id',
      references: {
        model: 'client_contacts',
        key: 'id',
      },
    },
    // Información de la cotización
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Fechas
    quoteDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'quote_date',
    },
    validUntil: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'valid_until',
    },
    // Valores
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'discount_percent',
    },
    discountAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'discount_amount',
    },
    taxPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 16,
      field: 'tax_percent',
      comment: 'IVA u otro impuesto',
    },
    taxAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      field: 'tax_amount',
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    // Estado
    status: {
      type: DataTypes.ENUM(
        'DRAFT',      // Borrador
        'SENT',       // Enviada al cliente
        'VIEWED',     // Vista por el cliente
        'ACCEPTED',   // Aceptada
        'REJECTED',   // Rechazada
        'EXPIRED',    // Expirada
        'REVISED'     // Revisada (nueva versión)
      ),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    // Versión
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    parentQuoteId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'parent_quote_id',
      comment: 'Cotización padre (si es revisión)',
    },
    // Términos y condiciones
    termsAndConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'terms_and_conditions',
    },
    paymentTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'payment_terms',
    },
    deliveryTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'delivery_terms',
    },
    // Razón de rechazo
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason',
    },
    // Responsable
    assignedToId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    // Notas internas
    internalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'internal_notes',
    },
    // Auditoría
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'sent_at',
    },
    sentBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'sent_by',
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'accepted_at',
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'rejected_at',
    },
  }, {
    tableName: 'crm_quotes',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['client_id'] },
      { fields: ['opportunity_id'] },
      { fields: ['status'] },
      { fields: ['quote_date'] },
      { fields: ['valid_until'] },
    ],
    hooks: {
      beforeSave: (instance) => {
        // Calcular totales
        const subtotal = parseFloat(instance.subtotal) || 0;
        const discountPercent = parseFloat(instance.discountPercent) || 0;
        const taxPercent = parseFloat(instance.taxPercent) || 0;
        
        instance.discountAmount = subtotal * (discountPercent / 100);
        const afterDiscount = subtotal - instance.discountAmount;
        instance.taxAmount = afterDiscount * (taxPercent / 100);
        instance.total = afterDiscount + instance.taxAmount;
      },
    },
  });

  return CrmQuote;
};
