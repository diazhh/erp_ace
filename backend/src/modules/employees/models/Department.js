const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Department = sequelize.define('Department', {
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
    // Tipo de unidad organizacional
    type: {
      type: DataTypes.ENUM('DIRECTION', 'MANAGEMENT', 'DEPARTMENT', 'AREA', 'UNIT'),
      defaultValue: 'DEPARTMENT',
      comment: 'DIRECTION=Dirección, MANAGEMENT=Gerencia, DEPARTMENT=Departamento, AREA=Área, UNIT=Unidad',
    },
    // Jerarquía - referencia al padre
    parentId: {
      type: DataTypes.UUID,
      field: 'parent_id',
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    // Nivel en la jerarquía (calculado)
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Responsable del departamento
    managerId: {
      type: DataTypes.UUID,
      field: 'manager_id',
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    // Ubicación
    location: {
      type: DataTypes.STRING(200),
    },
    // Presupuesto asignado
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    budgetCurrency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
      field: 'budget_currency',
    },
    // Centro de costo
    costCenter: {
      type: DataTypes.STRING(20),
      field: 'cost_center',
    },
    // Estado
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'ACTIVE',
    },
    // Orden para visualización
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order',
    },
    // Color para organigrama
    color: {
      type: DataTypes.STRING(7),
      defaultValue: '#1976d2',
    },
  }, {
    tableName: 'departments',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['code'] },
      { fields: ['parent_id'] },
      { fields: ['manager_id'] },
      { fields: ['type'] },
      { fields: ['status'] },
    ],
  });

  // Método para obtener la ruta completa (breadcrumb)
  Department.prototype.getFullPath = async function() {
    const path = [this.name];
    let current = this;
    
    while (current.parentId) {
      current = await Department.findByPk(current.parentId);
      if (current) {
        path.unshift(current.name);
      } else {
        break;
      }
    }
    
    return path.join(' > ');
  };

  return Department;
};
