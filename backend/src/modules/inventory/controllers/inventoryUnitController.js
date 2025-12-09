const inventoryUnitService = require('../services/inventoryUnitService');

/**
 * Listar unidades de inventario
 */
exports.listUnits = async (req, res, next) => {
  try {
    const result = await inventoryUnitService.listUnits(req.query);
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidad por ID
 */
exports.getUnit = async (req, res, next) => {
  try {
    const { InventoryUnit, Product, Warehouse, Employee, Project, User } = require('../../../database/models');
    
    const unit = await InventoryUnit.findByPk(req.params.id, {
      include: [
        { model: Product, as: 'product', attributes: ['id', 'code', 'name', 'productType', 'unit', 'brand', 'model'] },
        { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name'] },
        { model: Employee, as: 'assignedToEmployee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
        { model: Project, as: 'assignedToProject', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });
    
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada',
      });
    }
    
    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidad con historial completo
 */
exports.getUnitFull = async (req, res, next) => {
  try {
    const unit = await inventoryUnitService.getUnitWithHistory(req.params.id);
    
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada',
      });
    }
    
    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear unidades de inventario
 */
exports.createUnits = async (req, res, next) => {
  try {
    const units = await inventoryUnitService.createUnits(req.body, req.user.id);
    
    res.status(201).json({
      success: true,
      message: `${units.length} unidad(es) creada(s) exitosamente`,
      data: units,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Transferir unidad entre almacenes
 */
exports.transferUnit = async (req, res, next) => {
  try {
    const unit = await inventoryUnitService.transferUnit(req.params.id, req.body, req.user.id);
    
    res.json({
      success: true,
      message: 'Unidad transferida exitosamente',
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Asignar unidad a empleado o proyecto
 */
exports.assignUnit = async (req, res, next) => {
  try {
    const unit = await inventoryUnitService.assignUnit(req.params.id, req.body, req.user.id);
    
    res.json({
      success: true,
      message: 'Unidad asignada exitosamente',
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devolver unidad
 */
exports.returnUnit = async (req, res, next) => {
  try {
    const unit = await inventoryUnitService.returnUnit(req.params.id, req.body, req.user.id);
    
    res.json({
      success: true,
      message: 'Unidad devuelta exitosamente',
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cambiar estado de unidad
 */
exports.changeStatus = async (req, res, next) => {
  try {
    const unit = await inventoryUnitService.changeStatus(req.params.id, req.body, req.user.id);
    
    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar unidad
 */
exports.updateUnit = async (req, res, next) => {
  try {
    const { InventoryUnit } = require('../../../database/models');
    
    const unit = await InventoryUnit.findByPk(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada',
      });
    }
    
    // Solo permitir actualizar ciertos campos
    const allowedFields = [
      'serialNumber', 'lotNumber', 'expiryDate', 'warehouseLocation',
      'acquisitionCost', 'acquisitionDate', 'invoiceReference',
      'warrantyExpiry', 'lastMaintenanceDate', 'nextMaintenanceDate',
      'notes', 'metadata',
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    await unit.update(updateData);
    
    res.json({
      success: true,
      message: 'Unidad actualizada exitosamente',
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener historial de una unidad
 */
exports.getUnitHistory = async (req, res, next) => {
  try {
    const { InventoryUnitHistory, Warehouse, Employee, Project, User } = require('../../../database/models');
    
    const { page = 1, limit = 50 } = req.query;
    
    const { count, rows } = await InventoryUnitHistory.findAndCountAll({
      where: { unitId: req.params.id },
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
      ],
      order: [['eventDate', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidades asignadas a un empleado
 */
exports.getEmployeeUnits = async (req, res, next) => {
  try {
    const units = await inventoryUnitService.getEmployeeUnits(req.params.employeeId);
    
    res.json({
      success: true,
      data: units,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidades asignadas a un proyecto
 */
exports.getProjectUnits = async (req, res, next) => {
  try {
    const units = await inventoryUnitService.getProjectUnits(req.params.projectId);
    
    res.json({
      success: true,
      data: units,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener catálogos para formularios
 */
exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await inventoryUnitService.getCatalogs();
    
    res.json({
      success: true,
      data: catalogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Asignación masiva de unidades
 */
exports.bulkAssign = async (req, res, next) => {
  try {
    const { unitIds, employeeId, projectId, expectedReturnDate, deliveredBy, receivedBy, reason, notes } = req.body;
    
    if (!unitIds || !Array.isArray(unitIds) || unitIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos una unidad',
      });
    }
    
    const results = [];
    const errors = [];
    
    for (const unitId of unitIds) {
      try {
        const unit = await inventoryUnitService.assignUnit(unitId, {
          employeeId,
          projectId,
          expectedReturnDate,
          deliveredBy,
          receivedBy,
          reason,
          notes,
        }, req.user.id);
        results.push(unit);
      } catch (error) {
        errors.push({ unitId, error: error.message });
      }
    }
    
    res.json({
      success: true,
      message: `${results.length} unidad(es) asignada(s) exitosamente`,
      data: {
        assigned: results,
        errors,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Devolución masiva de unidades
 */
exports.bulkReturn = async (req, res, next) => {
  try {
    const { unitIds, warehouseId, warehouseLocation, condition, returnedBy, receivedBy, reason, notes } = req.body;
    
    if (!unitIds || !Array.isArray(unitIds) || unitIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos una unidad',
      });
    }
    
    const results = [];
    const errors = [];
    
    for (const unitId of unitIds) {
      try {
        const unit = await inventoryUnitService.returnUnit(unitId, {
          warehouseId,
          warehouseLocation,
          condition,
          returnedBy,
          receivedBy,
          reason,
          notes,
        }, req.user.id);
        results.push(unit);
      } catch (error) {
        errors.push({ unitId, error: error.message });
      }
    }
    
    res.json({
      success: true,
      message: `${results.length} unidad(es) devuelta(s) exitosamente`,
      data: {
        returned: results,
        errors,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar unidad por código o número de serie (para escaneo)
 */
exports.findByCodeOrSerial = async (req, res, next) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un código o número de serie',
      });
    }
    
    const unit = await inventoryUnitService.findUnitByCodeOrSerial(search);
    
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada',
      });
    }
    
    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidades disponibles para asignación
 */
exports.getAvailableForAssignment = async (req, res, next) => {
  try {
    const { productId, warehouseId, search } = req.query;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar el ID del producto',
      });
    }
    
    const units = await inventoryUnitService.getAvailableUnitsForSelection(productId, warehouseId, search);
    
    res.json({
      success: true,
      data: units,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidades para devolución
 */
exports.getForReturn = async (req, res, next) => {
  try {
    const { employeeId, projectId, search } = req.query;
    
    const units = await inventoryUnitService.getUnitsForReturn(employeeId, projectId, search);
    
    res.json({
      success: true,
      data: units,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidades para transferencia
 */
exports.getForTransfer = async (req, res, next) => {
  try {
    const { warehouseId, productId, search } = req.query;
    
    if (!warehouseId) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar el ID del almacén de origen',
      });
    }
    
    const units = await inventoryUnitService.getUnitsForTransfer(warehouseId, productId, search);
    
    res.json({
      success: true,
      data: units,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Estadísticas de inventario
 */
exports.getStats = async (req, res, next) => {
  try {
    const { InventoryUnit, Product } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    const { Op } = require('sequelize');
    
    // Estadísticas por estado
    const byStatus = await InventoryUnit.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });
    
    // Estadísticas por condición
    const byCondition = await InventoryUnit.findAll({
      attributes: [
        'condition',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['condition'],
      raw: true,
    });
    
    // Total de productos
    const totalProducts = await Product.count({ where: { status: 'ACTIVE' } });
    
    // Total de unidades
    const totalUnits = await InventoryUnit.count();
    
    // Unidades por vencer (próximos 30 días)
    const expiringUnits = await InventoryUnit.count({
      where: {
        expiryDate: {
          [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)],
        },
        status: { [Op.notIn]: ['RETIRED', 'LOST'] },
      },
    });
    
    // Unidades con garantía por vencer (próximos 30 días)
    const warrantyExpiring = await InventoryUnit.count({
      where: {
        warrantyExpiry: {
          [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)],
        },
        status: { [Op.notIn]: ['RETIRED', 'LOST'] },
      },
    });
    
    // Productos con stock bajo
    const lowStockProducts = await Product.count({
      where: {
        status: 'ACTIVE',
        availableUnits: {
          [Op.lte]: sequelize.col('min_stock'),
        },
        minStock: { [Op.ne]: null },
      },
    });
    
    res.json({
      success: true,
      data: {
        totalProducts,
        totalUnits,
        byStatus,
        byCondition,
        expiringUnits,
        warrantyExpiring,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
