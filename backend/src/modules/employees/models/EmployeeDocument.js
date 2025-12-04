const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmployeeDocument = sequelize.define('EmployeeDocument', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'employee_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    documentType: {
      type: DataTypes.ENUM(
        'ID_CARD',           // Cédula
        'PASSPORT',          // Pasaporte
        'DRIVER_LICENSE',    // Licencia de conducir
        'MEDICAL_CERT',      // Certificado médico
        'CRIMINAL_RECORD',   // Antecedentes penales
        'EDUCATION_CERT',    // Certificado de estudios
        'WORK_CERT',         // Certificado de trabajo
        'BANK_CERT',         // Certificación bancaria
        'RIF',               // RIF
        'PHOTO',             // Foto carnet
        'CONTRACT',          // Contrato de trabajo
        'OTHER'              // Otro
      ),
      allowNull: false,
      field: 'document_type',
    },
    documentName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'document_name',
    },
    documentNumber: {
      type: DataTypes.STRING(50),
      field: 'document_number',
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      field: 'issue_date',
    },
    expirationDate: {
      type: DataTypes.DATEONLY,
      field: 'expiration_date',
    },
    issuingAuthority: {
      type: DataTypes.STRING(200),
      field: 'issuing_authority',
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      field: 'file_url',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      field: 'file_size',
      comment: 'Tamaño en bytes',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      field: 'mime_type',
    },
    status: {
      type: DataTypes.ENUM('VALID', 'EXPIRED', 'PENDING', 'REJECTED'),
      defaultValue: 'VALID',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    // Alertas
    alertDaysBefore: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      field: 'alert_days_before',
      comment: 'Días antes del vencimiento para alertar',
    },
    alertSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'alert_sent',
    },
  }, {
    tableName: 'employee_documents',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['document_type'] },
      { fields: ['expiration_date'] },
      { fields: ['status'] },
    ],
  });

  // Método para verificar si está por vencer
  EmployeeDocument.prototype.isExpiringSoon = function() {
    if (!this.expirationDate) return false;
    const today = new Date();
    const expDate = new Date(this.expirationDate);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= this.alertDaysBefore && diffDays > 0;
  };

  // Método para verificar si está vencido
  EmployeeDocument.prototype.isExpired = function() {
    if (!this.expirationDate) return false;
    return new Date(this.expirationDate) < new Date();
  };

  return EmployeeDocument;
};
