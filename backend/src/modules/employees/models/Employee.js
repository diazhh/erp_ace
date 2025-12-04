const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Datos personales
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
    },
    idType: {
      type: DataTypes.ENUM('V', 'E', 'P', 'J'),
      defaultValue: 'V',
      field: 'id_type',
      comment: 'V=Venezolano, E=Extranjero, P=Pasaporte, J=Jurídico',
    },
    idNumber: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
      field: 'id_number',
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      field: 'birth_date',
    },
    gender: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      comment: 'M=Masculino, F=Femenino, O=Otro',
    },
    maritalStatus: {
      type: DataTypes.ENUM('S', 'C', 'D', 'V', 'U'),
      field: 'marital_status',
      comment: 'S=Soltero, C=Casado, D=Divorciado, V=Viudo, U=Unión libre',
    },
    nationality: {
      type: DataTypes.STRING(50),
      defaultValue: 'Venezolana',
    },
    
    // Contacto
    email: {
      type: DataTypes.STRING(255),
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    mobilePhone: {
      type: DataTypes.STRING(20),
      field: 'mobile_phone',
    },
    address: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(100),
    },
    state: {
      type: DataTypes.STRING(100),
    },
    
    // Contacto de emergencia
    emergencyContactName: {
      type: DataTypes.STRING(200),
      field: 'emergency_contact_name',
    },
    emergencyContactPhone: {
      type: DataTypes.STRING(20),
      field: 'emergency_contact_phone',
    },
    emergencyContactRelation: {
      type: DataTypes.STRING(50),
      field: 'emergency_contact_relation',
    },
    
    // Datos laborales
    employeeCode: {
      type: DataTypes.STRING(20),
      unique: true,
      field: 'employee_code',
    },
    // Cargo (texto legacy, se mantiene por compatibilidad)
    position: {
      type: DataTypes.STRING(100),
    },
    // Departamento (texto legacy, se mantiene por compatibilidad)
    department: {
      type: DataTypes.STRING(100),
    },
    // Referencia al departamento (nueva estructura)
    departmentId: {
      type: DataTypes.UUID,
      field: 'department_id',
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    // Referencia al cargo (nueva estructura)
    positionId: {
      type: DataTypes.UUID,
      field: 'position_id',
      references: {
        model: 'positions',
        key: 'id',
      },
    },
    // Supervisor directo (para jerarquía)
    supervisorId: {
      type: DataTypes.UUID,
      field: 'supervisor_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'hire_date',
    },
    terminationDate: {
      type: DataTypes.DATEONLY,
      field: 'termination_date',
    },
    employmentType: {
      type: DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY'),
      defaultValue: 'FULL_TIME',
      field: 'employment_type',
    },
    workSchedule: {
      type: DataTypes.STRING(100),
      field: 'work_schedule',
      comment: 'Ej: Lunes a Viernes 8:00-17:00',
    },
    
    // Datos bancarios y nómina
    bankName: {
      type: DataTypes.STRING(100),
      field: 'bank_name',
    },
    bankAccountType: {
      type: DataTypes.ENUM('CHECKING', 'SAVINGS'),
      field: 'bank_account_type',
    },
    bankAccountNumber: {
      type: DataTypes.STRING(30),
      field: 'bank_account_number',
    },
    baseSalary: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      field: 'base_salary',
    },
    salaryCurrency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
      field: 'salary_currency',
    },
    paymentFrequency: {
      type: DataTypes.ENUM('WEEKLY', 'BIWEEKLY', 'MONTHLY'),
      defaultValue: 'MONTHLY',
      field: 'payment_frequency',
    },
    
    // Seguridad social
    socialSecurityNumber: {
      type: DataTypes.STRING(20),
      field: 'social_security_number',
    },
    taxId: {
      type: DataTypes.STRING(20),
      field: 'tax_id',
      comment: 'RIF personal',
    },
    
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'),
      defaultValue: 'ACTIVE',
    },
    
    // Foto
    photoUrl: {
      type: DataTypes.STRING(500),
      field: 'photo_url',
    },
    
    // Notas
    notes: {
      type: DataTypes.TEXT,
    },
    
    // Usuario vinculado (opcional)
    userId: {
      type: DataTypes.UUID,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    // Extensión telefónica
    extension: {
      type: DataTypes.STRING(10),
    },
    // Oficina/Ubicación
    officeLocation: {
      type: DataTypes.STRING(100),
      field: 'office_location',
    },
    // Habilidades/Skills
    skills: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  }, {
    tableName: 'employees',
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft delete
    // Índices se crean via migraciones para evitar conflictos
    // indexes: [
    //   { fields: ['id_number'] },
    //   { fields: ['employee_code'] },
    //   { fields: ['status'] },
    //   { fields: ['department'] },
    //   { fields: ['position'] },
    //   { fields: ['department_id'] },
    //   { fields: ['position_id'] },
    //   { fields: ['supervisor_id'] },
    // ],
  });

  // Método para obtener nombre completo
  Employee.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  return Employee;
};
