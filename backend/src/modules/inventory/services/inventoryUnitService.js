const { Op } = require('sequelize');

class InventoryUnitService {
  /**
   * Genera código único para unidad de inventario
   */
  async generateUnitCode(productCode, transaction = null) {
    const { InventoryUnit } = require('../../../database/models');
    
    const prefix = productCode || 'UNIT';
    
    const lastUnit = await InventoryUnit.findOne({
      where: {
        code: { [Op.like]: `${prefix}-%` },
      },
      order: [['code', 'DESC']],
      paranoid: false, // Incluir eliminados para evitar duplicados
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined,
    });
    
    let nextNumber = 1;
    if (lastUnit && lastUnit.code) {
      const match = lastUnit.code.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `${prefix}-${String(nextNumber).padStart(5, '0')}`;
  }

  /**
   * Genera múltiples códigos únicos para unidades de inventario
   */
  async generateUnitCodes(productCode, quantity, transaction = null) {
    const { InventoryUnit } = require('../../../database/models');
    
    const prefix = productCode || 'UNIT';
    
    const lastUnit = await InventoryUnit.findOne({
      where: {
        code: { [Op.like]: `${prefix}-%` },
      },
      order: [['code', 'DESC']],
      paranoid: false,
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined,
    });
    
    let nextNumber = 1;
    if (lastUnit && lastUnit.code) {
      const match = lastUnit.code.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    const codes = [];
    for (let i = 0; i < quantity; i++) {
      codes.push(`${prefix}-${String(nextNumber + i).padStart(5, '0')}`);
    }
    
    return codes;
  }

  /**
   * Crear una o múltiples unidades de inventario
   */
  async createUnits(data, userId) {
    const { Product, InventoryUnit, InventoryUnitHistory, Warehouse } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    const productService = require('./productService');
    
    const t = await sequelize.transaction();
    
    try {
      const {
        productId,
        warehouseId,
        quantity = 1,
        serialNumbers = [],
        lotNumber,
        expiryDate,
        acquisitionCost,
        acquisitionDate,
        supplierId,
        purchaseOrderId,
        invoiceReference,
        warrantyExpiry,
        notes,
      } = data;
      
      // Validar producto
      const product = await Product.findByPk(productId, { transaction: t });
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      // Validar almacén
      if (warehouseId) {
        const warehouse = await Warehouse.findByPk(warehouseId, { transaction: t });
        if (!warehouse) {
          throw new Error('Almacén no encontrado');
        }
      }
      
      // Validar números de serie si el producto los requiere
      if (product.requiresSerialNumber && serialNumbers.length !== quantity) {
        throw new Error(`Se requieren ${quantity} números de serie únicos`);
      }
      
      // Generar todos los códigos de una vez dentro de la transacción
      const codes = await this.generateUnitCodes(product.code, quantity, t);
      
      const createdUnits = [];
      
      for (let i = 0; i < quantity; i++) {
        const code = codes[i];
        const serialNumber = serialNumbers[i] || null;
        
        // Verificar unicidad del número de serie
        if (serialNumber) {
          const existing = await InventoryUnit.findOne({
            where: { serialNumber },
            paranoid: false,
            transaction: t,
          });
          if (existing) {
            throw new Error(`El número de serie ${serialNumber} ya existe`);
          }
        }
        
        const unit = await InventoryUnit.create({
          code,
          productId,
          serialNumber,
          lotNumber,
          expiryDate,
          status: warehouseId ? 'AVAILABLE' : 'IN_TRANSIT',
          condition: 'NEW',
          warehouseId,
          acquisitionCost: acquisitionCost || product.unitCost,
          currency: product.currency,
          acquisitionDate: acquisitionDate || new Date(),
          supplierId,
          purchaseOrderId,
          invoiceReference,
          warrantyExpiry,
          notes,
          createdBy: userId,
        }, { transaction: t });
        
        // Crear registro de historial
        await InventoryUnitHistory.create({
          unitId: unit.id,
          eventType: 'CREATED',
          eventDate: new Date(),
          description: `Unidad creada e ingresada al inventario`,
          toWarehouseId: warehouseId,
          toStatus: unit.status,
          toCondition: unit.condition,
          performedBy: userId,
          referenceType: purchaseOrderId ? 'PurchaseOrder' : null,
          referenceId: purchaseOrderId,
          notes,
        }, { transaction: t });
        
        createdUnits.push(unit);
      }
      
      // Actualizar contadores del producto
      await productService.updateProductUnitCounts(productId, t);
      
      await t.commit();
      
      return createdUnits;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Transferir unidad entre almacenes
   */
  async transferUnit(unitId, data, userId) {
    const { InventoryUnit, InventoryUnitHistory, Warehouse } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const t = await sequelize.transaction();
    
    try {
      const { toWarehouseId, toLocation, reason, notes } = data;
      
      const unit = await InventoryUnit.findByPk(unitId, { transaction: t });
      if (!unit) {
        throw new Error('Unidad no encontrada');
      }
      
      if (!['AVAILABLE', 'RETURNED'].includes(unit.status)) {
        throw new Error(`No se puede transferir una unidad en estado ${unit.status}`);
      }
      
      const toWarehouse = await Warehouse.findByPk(toWarehouseId, { transaction: t });
      if (!toWarehouse) {
        throw new Error('Almacén destino no encontrado');
      }
      
      const fromWarehouseId = unit.warehouseId;
      const fromLocation = unit.warehouseLocation;
      
      // Actualizar unidad
      await unit.update({
        warehouseId: toWarehouseId,
        warehouseLocation: toLocation,
        status: 'AVAILABLE',
      }, { transaction: t });
      
      // Crear registro de historial
      await InventoryUnitHistory.create({
        unitId: unit.id,
        eventType: 'TRANSFERRED',
        eventDate: new Date(),
        description: `Transferida de almacén`,
        fromWarehouseId,
        toWarehouseId,
        fromLocation,
        toLocation,
        fromStatus: 'AVAILABLE',
        toStatus: 'AVAILABLE',
        performedBy: userId,
        reason,
        notes,
      }, { transaction: t });
      
      await t.commit();
      
      return unit;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Asignar unidad a empleado o proyecto
   */
  async assignUnit(unitId, data, userId) {
    const { InventoryUnit, InventoryUnitHistory, Employee, Project } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    const productService = require('./productService');
    
    const t = await sequelize.transaction();
    
    try {
      const {
        employeeId,
        projectId,
        expectedReturnDate,
        deliveredBy,
        receivedBy,
        reason,
        notes,
      } = data;
      
      if (!employeeId && !projectId) {
        throw new Error('Debe especificar empleado o proyecto');
      }
      
      const unit = await InventoryUnit.findByPk(unitId, { transaction: t });
      if (!unit) {
        throw new Error('Unidad no encontrada');
      }
      
      if (!['AVAILABLE', 'RETURNED'].includes(unit.status)) {
        throw new Error(`No se puede asignar una unidad en estado ${unit.status}`);
      }
      
      // Validar empleado
      if (employeeId) {
        const employee = await Employee.findByPk(employeeId, { transaction: t });
        if (!employee) {
          throw new Error('Empleado no encontrado');
        }
      }
      
      // Validar proyecto
      if (projectId) {
        const project = await Project.findByPk(projectId, { transaction: t });
        if (!project) {
          throw new Error('Proyecto no encontrado');
        }
      }
      
      const fromWarehouseId = unit.warehouseId;
      const fromStatus = unit.status;
      
      // Actualizar unidad
      await unit.update({
        status: 'ASSIGNED',
        assignedToEmployeeId: employeeId,
        assignedToProjectId: projectId,
        assignedAt: new Date(),
        expectedReturnDate,
        warehouseId: null, // Sale del almacén
        warehouseLocation: null,
      }, { transaction: t });
      
      // Crear registro de historial
      await InventoryUnitHistory.create({
        unitId: unit.id,
        eventType: 'ASSIGNED',
        eventDate: new Date(),
        description: `Asignada a ${employeeId ? 'empleado' : 'proyecto'}`,
        fromWarehouseId,
        fromStatus,
        toStatus: 'ASSIGNED',
        toEmployeeId: employeeId,
        toProjectId: projectId,
        performedBy: userId,
        deliveredBy,
        receivedBy,
        reason,
        notes,
      }, { transaction: t });
      
      // Actualizar contadores del producto
      await productService.updateProductUnitCounts(unit.productId, t);
      
      await t.commit();
      
      return unit;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Devolver unidad (retorno de empleado/proyecto)
   */
  async returnUnit(unitId, data, userId) {
    const { InventoryUnit, InventoryUnitHistory, Warehouse } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    const productService = require('./productService');
    
    const t = await sequelize.transaction();
    
    try {
      const {
        warehouseId,
        warehouseLocation,
        condition,
        returnedBy,
        receivedBy,
        reason,
        notes,
      } = data;
      
      const unit = await InventoryUnit.findByPk(unitId, { transaction: t });
      if (!unit) {
        throw new Error('Unidad no encontrada');
      }
      
      if (!['ASSIGNED', 'IN_USE'].includes(unit.status)) {
        throw new Error(`No se puede devolver una unidad en estado ${unit.status}`);
      }
      
      // Validar almacén
      const warehouse = await Warehouse.findByPk(warehouseId, { transaction: t });
      if (!warehouse) {
        throw new Error('Almacén no encontrado');
      }
      
      const fromEmployeeId = unit.assignedToEmployeeId;
      const fromProjectId = unit.assignedToProjectId;
      const fromStatus = unit.status;
      const fromCondition = unit.condition;
      
      // Determinar nuevo estado según condición
      let newStatus = 'AVAILABLE';
      if (condition === 'DAMAGED' || condition === 'UNUSABLE') {
        newStatus = 'DAMAGED';
      } else if (condition === 'POOR') {
        newStatus = 'RETURNED'; // Pendiente de revisión
      }
      
      // Actualizar unidad
      await unit.update({
        status: newStatus,
        condition: condition || unit.condition,
        warehouseId,
        warehouseLocation,
        assignedToEmployeeId: null,
        assignedToProjectId: null,
        assignedAt: null,
        expectedReturnDate: null,
      }, { transaction: t });
      
      // Crear registro de historial
      await InventoryUnitHistory.create({
        unitId: unit.id,
        eventType: 'RETURNED',
        eventDate: new Date(),
        description: `Devuelta por ${fromEmployeeId ? 'empleado' : 'proyecto'}`,
        toWarehouseId: warehouseId,
        toLocation: warehouseLocation,
        fromEmployeeId,
        fromProjectId,
        fromStatus,
        toStatus: newStatus,
        fromCondition,
        toCondition: condition || unit.condition,
        performedBy: userId,
        deliveredBy: returnedBy,
        receivedBy,
        reason,
        notes,
      }, { transaction: t });
      
      // Actualizar contadores del producto
      await productService.updateProductUnitCounts(unit.productId, t);
      
      await t.commit();
      
      return unit;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Cambiar estado de unidad
   */
  async changeStatus(unitId, data, userId) {
    const { InventoryUnit, InventoryUnitHistory } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    const productService = require('./productService');
    
    const t = await sequelize.transaction();
    
    try {
      const { status, condition, reason, notes, authorizedBy } = data;
      
      const unit = await InventoryUnit.findByPk(unitId, { transaction: t });
      if (!unit) {
        throw new Error('Unidad no encontrada');
      }
      
      const fromStatus = unit.status;
      const fromCondition = unit.condition;
      
      // Determinar tipo de evento
      let eventType = 'STATUS_CHANGED';
      if (status === 'DAMAGED') eventType = 'DAMAGED';
      if (status === 'LOST') eventType = 'LOST';
      if (status === 'RETIRED') eventType = 'RETIRED';
      if (status === 'MAINTENANCE') eventType = 'MAINTENANCE_STARTED';
      if (fromStatus === 'MAINTENANCE' && status === 'AVAILABLE') eventType = 'MAINTENANCE_COMPLETED';
      if (fromStatus === 'DAMAGED' && status === 'AVAILABLE') eventType = 'REPAIRED';
      if (condition && condition !== fromCondition) eventType = 'CONDITION_CHANGED';
      
      // Actualizar unidad
      const updateData = { status };
      if (condition) updateData.condition = condition;
      
      if (status === 'RETIRED') {
        updateData.retiredAt = new Date();
        updateData.retiredBy = userId;
        updateData.retiredReason = reason;
      }
      
      await unit.update(updateData, { transaction: t });
      
      // Crear registro de historial
      await InventoryUnitHistory.create({
        unitId: unit.id,
        eventType,
        eventDate: new Date(),
        description: `Estado cambiado de ${fromStatus} a ${status}`,
        fromStatus,
        toStatus: status,
        fromCondition,
        toCondition: condition || fromCondition,
        performedBy: userId,
        authorizedBy,
        reason,
        notes,
      }, { transaction: t });
      
      // Actualizar contadores del producto
      await productService.updateProductUnitCounts(unit.productId, t);
      
      await t.commit();
      
      return unit;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Obtener unidad con historial completo
   */
  async getUnitWithHistory(unitId) {
    const { 
      InventoryUnit, InventoryUnitHistory, Product, Warehouse, 
      Employee, Project, User, Contractor, PurchaseOrder 
    } = require('../../../database/models');
    
    const unit = await InventoryUnit.findByPk(unitId, {
      include: [
        { 
          model: Product, 
          as: 'product',
          attributes: ['id', 'code', 'name', 'productType', 'unit', 'brand', 'model'],
        },
        { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name'] },
        { model: Employee, as: 'assignedToEmployee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
        { model: Project, as: 'assignedToProject', attributes: ['id', 'code', 'name'] },
        { model: Contractor, as: 'supplier', attributes: ['id', 'code', 'companyName'] },
        { model: PurchaseOrder, as: 'purchaseOrder', attributes: ['id', 'code'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      paranoid: false,
    });
    
    if (!unit) {
      return null;
    }
    
    // Obtener historial completo
    const history = await InventoryUnitHistory.findAll({
      where: { unitId },
      include: [
        { model: Warehouse, as: 'fromWarehouse', attributes: ['id', 'code', 'name'] },
        { model: Warehouse, as: 'toWarehouse', attributes: ['id', 'code', 'name'] },
        { model: Employee, as: 'fromEmployee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Employee, as: 'toEmployee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Employee, as: 'deliveredByEmployee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Employee, as: 'receivedByEmployee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'fromProject', attributes: ['id', 'code', 'name'] },
        { model: Project, as: 'toProject', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'performer', attributes: ['id', 'username'] },
        { model: User, as: 'authorizer', attributes: ['id', 'username'] },
      ],
      order: [['eventDate', 'DESC'], ['createdAt', 'DESC']],
    });
    
    return {
      ...unit.toJSON(),
      history,
    };
  }

  /**
   * Listar unidades con filtros
   */
  async listUnits(filters = {}) {
    const { InventoryUnit, Product, Warehouse, Employee, Project, User } = require('../../../database/models');
    
    const {
      search,
      productId,
      warehouseId,
      status,
      condition,
      assignedToEmployeeId,
      assignedToProjectId,
      supplierId,
      expiringBefore,
      page = 1,
      limit = 20,
    } = filters;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { serialNumber: { [Op.iLike]: `%${search}%` } },
        { lotNumber: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (status) where.status = status;
    if (condition) where.condition = condition;
    if (assignedToEmployeeId) where.assignedToEmployeeId = assignedToEmployeeId;
    if (assignedToProjectId) where.assignedToProjectId = assignedToProjectId;
    if (supplierId) where.supplierId = supplierId;
    
    if (expiringBefore) {
      where.expiryDate = { [Op.lte]: expiringBefore };
    }
    
    const { count, rows } = await InventoryUnit.findAndCountAll({
      where,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'code', 'name', 'productType', 'unit'] },
        { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name'] },
        { model: Employee, as: 'assignedToEmployee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'assignedToProject', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    
    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  /**
   * Obtener unidades de un producto
   */
  async getProductUnits(productId, filters = {}) {
    const { InventoryUnit, Warehouse, Employee, Project } = require('../../../database/models');
    
    const { status, warehouseId, page = 1, limit = 50 } = filters;
    
    const where = { productId };
    if (status) where.status = status;
    if (warehouseId) where.warehouseId = warehouseId;
    
    const { count, rows } = await InventoryUnit.findAndCountAll({
      where,
      include: [
        { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name'] },
        { model: Employee, as: 'assignedToEmployee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'assignedToProject', attributes: ['id', 'code', 'name'] },
      ],
      order: [['code', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    
    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  /**
   * Obtener unidades asignadas a un empleado
   */
  async getEmployeeUnits(employeeId) {
    const { InventoryUnit, Product, Project } = require('../../../database/models');
    
    const units = await InventoryUnit.findAll({
      where: {
        assignedToEmployeeId: employeeId,
        status: { [Op.in]: ['ASSIGNED', 'IN_USE'] },
      },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'code', 'name', 'productType', 'unit', 'brand', 'model'] },
        { model: Project, as: 'assignedToProject', attributes: ['id', 'code', 'name'] },
      ],
      order: [['assignedAt', 'DESC']],
    });
    
    return units;
  }

  /**
   * Obtener unidades asignadas a un proyecto
   */
  async getProjectUnits(projectId) {
    const { InventoryUnit, Product, Employee } = require('../../../database/models');
    
    const units = await InventoryUnit.findAll({
      where: {
        assignedToProjectId: projectId,
        status: { [Op.in]: ['ASSIGNED', 'IN_USE'] },
      },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'code', 'name', 'productType', 'unit', 'brand', 'model'] },
        { model: Employee, as: 'assignedToEmployee', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['assignedAt', 'DESC']],
    });
    
    return units;
  }

  /**
   * Obtener catálogos para formularios
   */
  async getCatalogs() {
    const unitStatuses = [
      { value: 'AVAILABLE', label: 'Disponible' },
      { value: 'ASSIGNED', label: 'Asignada' },
      { value: 'IN_TRANSIT', label: 'En tránsito' },
      { value: 'IN_USE', label: 'En uso' },
      { value: 'MAINTENANCE', label: 'En mantenimiento' },
      { value: 'DAMAGED', label: 'Dañada' },
      { value: 'LOST', label: 'Perdida' },
      { value: 'RETIRED', label: 'Dada de baja' },
      { value: 'RETURNED', label: 'Devuelta' },
      { value: 'RESERVED', label: 'Reservada' },
    ];
    
    const conditions = [
      { value: 'NEW', label: 'Nueva' },
      { value: 'GOOD', label: 'Buena' },
      { value: 'FAIR', label: 'Regular' },
      { value: 'POOR', label: 'Mala' },
      { value: 'DAMAGED', label: 'Dañada' },
      { value: 'UNUSABLE', label: 'Inutilizable' },
    ];
    
    return {
      statuses: unitStatuses,
      conditions,
    };
  }
}

module.exports = new InventoryUnitService();
