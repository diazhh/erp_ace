const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PayrollPeriod = sequelize.define('PayrollPeriod', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Identificación del período
    code: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
      comment: 'Ej: NOM-2024-12-Q1 (Quincena 1 de Dic 2024)',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Ej: Nómina Diciembre 2024 - Quincena 1',
    },
    // Tipo de período
    periodType: {
      type: DataTypes.ENUM('WEEKLY', 'BIWEEKLY', 'MONTHLY'),
      defaultValue: 'BIWEEKLY',
      field: 'period_type',
    },
    // Fechas del período
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'end_date',
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'payment_date',
      comment: 'Fecha programada de pago',
    },
    // Totales calculados
    totalGross: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'total_gross',
      comment: 'Total bruto de la nómina',
    },
    totalDeductions: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'total_deductions',
      comment: 'Total deducciones',
    },
    totalNet: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'total_net',
      comment: 'Total neto a pagar',
    },
    totalEmployees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_employees',
    },
    // Moneda base
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    // Tasa de cambio del día (para conversiones)
    exchangeRate: {
      type: DataTypes.DECIMAL(15, 4),
      defaultValue: 1,
      field: 'exchange_rate',
      comment: 'Tasa USD/Bs del período',
    },
    // Estado del período
    status: {
      type: DataTypes.ENUM('DRAFT', 'CALCULATING', 'PENDING_APPROVAL', 'APPROVED', 'PAID', 'CANCELLED'),
      defaultValue: 'DRAFT',
      comment: 'DRAFT=Borrador, CALCULATING=Calculando, PENDING_APPROVAL=Pendiente aprobación, APPROVED=Aprobado, PAID=Pagado, CANCELLED=Cancelado',
    },
    // Aprobación
    approvedBy: {
      type: DataTypes.UUID,
      field: 'approved_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approvedAt: {
      type: DataTypes.DATE,
      field: 'approved_at',
    },
    // Notas
    notes: {
      type: DataTypes.TEXT,
    },
    // Usuario que creó
    createdBy: {
      type: DataTypes.UUID,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'payroll_periods',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['status'] },
      { fields: ['start_date', 'end_date'] },
      { fields: ['payment_date'] },
    ],
  });

  return PayrollPeriod;
};
