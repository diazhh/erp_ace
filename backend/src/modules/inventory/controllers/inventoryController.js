const { Op } = require('sequelize');
const inventoryService = require('../services/inventoryService');

// ==================== ALMACENES ====================

/**
 * Listar almacenes
 */
exports.listWarehouses = async (req, res, next) => {
  try {
    const { Warehouse, Employee, Project } = require('../../../database/models');
    
    const {
      page = 1,
      limit = 10,
      search,
      warehouseType,
      status,
      projectId,
    } = req.query;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (warehouseType) where.warehouseType = warehouseType;
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;
    
    const { count, rows } = await Warehouse.findAndCountAll({
      where,
      include: [
        { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] },
        { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
      ],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    
    res.json({
      success: true,
      data: {
        warehouses: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener almacén por ID
 */
exports.getWarehouseById = async (req, res, next) => {
  try {
    const { Warehouse, Employee, Project, User } = require('../../../database/models');
    
    const warehouse = await Warehouse.findByPk(req.params.id, {
      include: [
        { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'code', 'name', 'status'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });
    
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Almacén no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener almacén con trazabilidad completa
 */
exports.getWarehouseFull = async (req, res, next) => {
  try {
    const { 
      Warehouse, Employee, Project, User, WarehouseStock, 
      InventoryItem, InventoryMovement, InventoryCategory 
    } = require('../../../database/models');
    
    const warehouse = await Warehouse.findByPk(req.params.id, {
      include: [
        { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'code', 'name', 'status'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        {
          model: WarehouseStock,
          as: 'stocks',
          include: [{
            model: InventoryItem,
            as: 'item',
            attributes: ['id', 'code', 'name', 'unit', 'unitCost', 'itemType'],
            include: [{ model: InventoryCategory, as: 'category', attributes: ['id', 'name'] }],
          }],
        },
      ],
    });
    
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Almacén no encontrado',
      });
    }
    
    // Obtener estadísticas
    const stats = await inventoryService.getWarehouseStats(warehouse.id);
    
    // Obtener movimientos recientes
    const recentMovements = await InventoryMovement.findAll({
      where: {
        [Op.or]: [
          { sourceWarehouseId: warehouse.id },
          { destinationWarehouseId: warehouse.id },
        ],
      },
      include: [
        { model: InventoryItem, as: 'item', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['movementDate', 'DESC'], ['createdAt', 'DESC']],
      limit: 20,
    });
    
    res.json({
      success: true,
      data: {
        ...warehouse.toJSON(),
        stats,
        recentMovements,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear almacén
 */
exports.createWarehouse = async (req, res, next) => {
  try {
    const { Warehouse } = require('../../../database/models');
    
    const code = await inventoryService.generateWarehouseCode();
    
    const warehouse = await Warehouse.create({
      ...req.body,
      code,
      createdBy: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      message: 'Almacén creado exitosamente',
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar almacén
 */
exports.updateWarehouse = async (req, res, next) => {
  try {
    const { Warehouse } = require('../../../database/models');
    
    const warehouse = await Warehouse.findByPk(req.params.id);
    
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Almacén no encontrado',
      });
    }
    
    // No permitir cambiar el código
    delete req.body.code;
    delete req.body.createdBy;
    
    await warehouse.update(req.body);
    
    res.json({
      success: true,
      message: 'Almacén actualizado exitosamente',
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar almacén
 */
exports.deleteWarehouse = async (req, res, next) => {
  try {
    const { Warehouse, WarehouseStock } = require('../../../database/models');
    
    const warehouse = await Warehouse.findByPk(req.params.id);
    
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Almacén no encontrado',
      });
    }
    
    // Verificar que no tenga stock
    const hasStock = await WarehouseStock.findOne({
      where: {
        warehouseId: warehouse.id,
        quantity: { [Op.gt]: 0 },
      },
    });
    
    if (hasStock) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un almacén con stock',
      });
    }
    
    await warehouse.destroy();
    
    res.json({
      success: true,
      message: 'Almacén eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CATEGORÍAS ====================

/**
 * Listar categorías
 */
exports.listCategories = async (req, res, next) => {
  try {
    const { InventoryCategory } = require('../../../database/models');
    
    const { status, parentId, flat } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (parentId === 'null') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }
    
    const categories = await InventoryCategory.findAll({
      where,
      include: flat !== 'true' ? [
        { model: InventoryCategory, as: 'children' },
        { model: InventoryCategory, as: 'parent', attributes: ['id', 'name'] },
      ] : [],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    });
    
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener categoría por ID
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const { InventoryCategory, InventoryItem } = require('../../../database/models');
    
    const category = await InventoryCategory.findByPk(req.params.id, {
      include: [
        { model: InventoryCategory, as: 'parent', attributes: ['id', 'name'] },
        { model: InventoryCategory, as: 'children' },
        { model: InventoryItem, as: 'items', attributes: ['id', 'code', 'name', 'totalStock'] },
      ],
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      });
    }
    
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear categoría
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { InventoryCategory } = require('../../../database/models');
    
    const code = await inventoryService.generateCategoryCode();
    
    // Calcular nivel
    let level = 0;
    if (req.body.parentId) {
      const parent = await InventoryCategory.findByPk(req.body.parentId);
      if (parent) {
        level = parent.level + 1;
      }
    }
    
    const category = await InventoryCategory.create({
      ...req.body,
      code,
      level,
      createdBy: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar categoría
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { InventoryCategory } = require('../../../database/models');
    
    const category = await InventoryCategory.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      });
    }
    
    delete req.body.code;
    delete req.body.createdBy;
    
    // Recalcular nivel si cambia el padre
    if (req.body.parentId !== undefined) {
      if (req.body.parentId) {
        const parent = await InventoryCategory.findByPk(req.body.parentId);
        req.body.level = parent ? parent.level + 1 : 0;
      } else {
        req.body.level = 0;
      }
    }
    
    await category.update(req.body);
    
    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar categoría
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { InventoryCategory, InventoryItem } = require('../../../database/models');
    
    const category = await InventoryCategory.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      });
    }
    
    // Verificar que no tenga subcategorías
    const hasChildren = await InventoryCategory.findOne({
      where: { parentId: category.id },
    });
    
    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar una categoría con subcategorías',
      });
    }
    
    // Verificar que no tenga items
    const hasItems = await InventoryItem.findOne({
      where: { categoryId: category.id },
    });
    
    if (hasItems) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar una categoría con items asociados',
      });
    }
    
    await category.destroy();
    
    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ITEMS ====================

/**
 * Listar items
 */
exports.listItems = async (req, res, next) => {
  try {
    const { InventoryItem, InventoryCategory, Contractor } = require('../../../database/models');
    
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      itemType,
      status,
      lowStock,
      outOfStock,
    } = req.query;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (categoryId) where.categoryId = categoryId;
    if (itemType) where.itemType = itemType;
    if (status) where.status = status;
    
    if (lowStock === 'true') {
      where.minStock = { [Op.ne]: null };
      where[Op.and] = require('sequelize').literal('total_stock <= min_stock');
    }
    
    if (outOfStock === 'true') {
      where.totalStock = 0;
    }
    
    const { count, rows } = await InventoryItem.findAndCountAll({
      where,
      include: [
        { model: InventoryCategory, as: 'category', attributes: ['id', 'name', 'color'] },
        { model: Contractor, as: 'preferredSupplier', attributes: ['id', 'companyName'] },
      ],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    
    res.json({
      success: true,
      data: {
        items: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener item por ID
 */
exports.getItemById = async (req, res, next) => {
  try {
    const { InventoryItem, InventoryCategory, Contractor, User } = require('../../../database/models');
    
    const item = await InventoryItem.findByPk(req.params.id, {
      include: [
        { model: InventoryCategory, as: 'category' },
        { model: Contractor, as: 'preferredSupplier', attributes: ['id', 'companyName', 'contactEmail', 'contactPhone'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener item con trazabilidad completa
 */
exports.getItemFull = async (req, res, next) => {
  try {
    const { 
      InventoryItem, InventoryCategory, Contractor, User, 
      WarehouseStock, Warehouse, InventoryMovement, Project, Employee 
    } = require('../../../database/models');
    
    const item = await InventoryItem.findByPk(req.params.id, {
      include: [
        { model: InventoryCategory, as: 'category' },
        { model: Contractor, as: 'preferredSupplier', attributes: ['id', 'companyName', 'contactEmail', 'contactPhone'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        {
          model: WarehouseStock,
          as: 'warehouseStocks',
          include: [{ model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name', 'warehouseType'] }],
        },
      ],
    });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado',
      });
    }
    
    // Obtener estadísticas
    const stats = await inventoryService.getItemStats(item.id);
    
    // Obtener movimientos recientes
    const recentMovements = await InventoryMovement.findAll({
      where: { itemId: item.id },
      include: [
        { model: Warehouse, as: 'sourceWarehouse', attributes: ['id', 'code', 'name'] },
        { model: Warehouse, as: 'destinationWarehouse', attributes: ['id', 'code', 'name'] },
        { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
        { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['movementDate', 'DESC'], ['createdAt', 'DESC']],
      limit: 50,
    });
    
    res.json({
      success: true,
      data: {
        ...item.toJSON(),
        stats,
        recentMovements,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear item
 */
exports.createItem = async (req, res, next) => {
  try {
    const { InventoryItem } = require('../../../database/models');
    
    const code = await inventoryService.generateItemCode();
    
    const item = await InventoryItem.create({
      ...req.body,
      code,
      totalStock: 0,
      reservedStock: 0,
      availableStock: 0,
      createdBy: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      message: 'Item creado exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar item
 */
exports.updateItem = async (req, res, next) => {
  try {
    const { InventoryItem } = require('../../../database/models');
    
    const item = await InventoryItem.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado',
      });
    }
    
    // No permitir cambiar campos calculados
    delete req.body.code;
    delete req.body.totalStock;
    delete req.body.reservedStock;
    delete req.body.availableStock;
    delete req.body.createdBy;
    
    await item.update(req.body);
    
    res.json({
      success: true,
      message: 'Item actualizado exitosamente',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar item
 */
exports.deleteItem = async (req, res, next) => {
  try {
    const { InventoryItem, WarehouseStock } = require('../../../database/models');
    
    const item = await InventoryItem.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado',
      });
    }
    
    // Verificar que no tenga stock
    if (parseFloat(item.totalStock) > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un item con stock',
      });
    }
    
    // Eliminar registros de stock vacíos
    await WarehouseStock.destroy({ where: { itemId: item.id } });
    
    await item.destroy();
    
    res.json({
      success: true,
      message: 'Item eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== MOVIMIENTOS ====================

/**
 * Listar movimientos
 */
exports.listMovements = async (req, res, next) => {
  try {
    const { 
      InventoryMovement, InventoryItem, Warehouse, Project, Employee, User, Contractor 
    } = require('../../../database/models');
    
    const {
      page = 1,
      limit = 20,
      search,
      movementType,
      reason,
      itemId,
      warehouseId,
      projectId,
      employeeId,
      startDate,
      endDate,
      status,
    } = req.query;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { referenceCode: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (movementType) where.movementType = movementType;
    if (reason) where.reason = reason;
    if (itemId) where.itemId = itemId;
    if (projectId) where.projectId = projectId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    if (warehouseId) {
      where[Op.or] = [
        { sourceWarehouseId: warehouseId },
        { destinationWarehouseId: warehouseId },
      ];
    }
    
    if (startDate) {
      where.movementDate = { ...where.movementDate, [Op.gte]: startDate };
    }
    if (endDate) {
      where.movementDate = { ...where.movementDate, [Op.lte]: endDate };
    }
    
    const { count, rows } = await InventoryMovement.findAndCountAll({
      where,
      include: [
        { model: InventoryItem, as: 'item', attributes: ['id', 'code', 'name', 'unit'] },
        { model: Warehouse, as: 'sourceWarehouse', attributes: ['id', 'code', 'name'] },
        { model: Warehouse, as: 'destinationWarehouse', attributes: ['id', 'code', 'name'] },
        { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
        { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contractor, as: 'supplier', attributes: ['id', 'companyName'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['movementDate', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    
    res.json({
      success: true,
      data: {
        movements: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener movimiento por ID
 */
exports.getMovementById = async (req, res, next) => {
  try {
    const { 
      InventoryMovement, InventoryItem, Warehouse, Project, Employee, User, Contractor 
    } = require('../../../database/models');
    
    const movement = await InventoryMovement.findByPk(req.params.id, {
      include: [
        { model: InventoryItem, as: 'item' },
        { model: Warehouse, as: 'sourceWarehouse' },
        { model: Warehouse, as: 'destinationWarehouse' },
        { model: Project, as: 'project' },
        { model: Employee, as: 'employee' },
        { model: Contractor, as: 'supplier' },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
      ],
    });
    
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: movement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear movimiento
 */
exports.createMovement = async (req, res, next) => {
  try {
    const movement = await inventoryService.processMovement(
      {
        ...req.body,
        movementDate: req.body.movementDate || new Date().toISOString().split('T')[0],
      },
      req.user.id
    );
    
    res.status(201).json({
      success: true,
      message: 'Movimiento registrado exitosamente',
      data: movement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancelar movimiento
 */
exports.cancelMovement = async (req, res, next) => {
  try {
    const { InventoryMovement } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const movement = await InventoryMovement.findByPk(req.params.id);
    
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado',
      });
    }
    
    if (movement.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'El movimiento ya está cancelado',
      });
    }
    
    const t = await sequelize.transaction();
    
    try {
      // Revertir el movimiento
      const { movementType, itemId, sourceWarehouseId, destinationWarehouseId, quantity } = movement;
      
      switch (movementType) {
        case 'ENTRY':
        case 'ADJUSTMENT_IN':
        case 'RETURN':
          await inventoryService.updateWarehouseStock(destinationWarehouseId, itemId, -quantity, t);
          break;
          
        case 'EXIT':
        case 'ADJUSTMENT_OUT':
          await inventoryService.updateWarehouseStock(sourceWarehouseId, itemId, quantity, t);
          break;
          
        case 'TRANSFER':
          await inventoryService.updateWarehouseStock(destinationWarehouseId, itemId, -quantity, t);
          await inventoryService.updateWarehouseStock(sourceWarehouseId, itemId, quantity, t);
          break;
          
        case 'RESERVATION':
          await inventoryService.releaseStock(sourceWarehouseId, itemId, quantity, t);
          break;
          
        case 'RELEASE':
          await inventoryService.reserveStock(sourceWarehouseId, itemId, quantity, t);
          break;
      }
      
      await movement.update({ status: 'CANCELLED' }, { transaction: t });
      
      await t.commit();
      
      res.json({
        success: true,
        message: 'Movimiento cancelado exitosamente',
        data: movement,
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// ==================== STOCK ====================

/**
 * Obtener stock de un item en todos los almacenes
 */
exports.getItemStock = async (req, res, next) => {
  try {
    const { WarehouseStock, Warehouse, InventoryItem } = require('../../../database/models');
    
    const { itemId } = req.params;
    
    const item = await InventoryItem.findByPk(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado',
      });
    }
    
    const stocks = await WarehouseStock.findAll({
      where: { itemId },
      include: [
        { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name', 'warehouseType', 'status'] },
      ],
    });
    
    res.json({
      success: true,
      data: {
        item: {
          id: item.id,
          code: item.code,
          name: item.name,
          unit: item.unit,
          totalStock: item.totalStock,
          reservedStock: item.reservedStock,
          availableStock: item.availableStock,
        },
        stocks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener stock de un almacén
 */
exports.getWarehouseStock = async (req, res, next) => {
  try {
    const { WarehouseStock, Warehouse, InventoryItem, InventoryCategory } = require('../../../database/models');
    
    const { warehouseId } = req.params;
    const { search, categoryId, itemType, lowStock } = req.query;
    
    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Almacén no encontrado',
      });
    }
    
    const itemWhere = {};
    if (search) {
      itemWhere[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (categoryId) itemWhere.categoryId = categoryId;
    if (itemType) itemWhere.itemType = itemType;
    
    const stockWhere = { warehouseId };
    if (lowStock === 'true') {
      stockWhere[Op.and] = require('sequelize').literal('quantity <= min_stock');
    }
    
    const stocks = await WarehouseStock.findAll({
      where: stockWhere,
      include: [
        {
          model: InventoryItem,
          as: 'item',
          where: Object.keys(itemWhere).length > 0 ? itemWhere : undefined,
          include: [{ model: InventoryCategory, as: 'category', attributes: ['id', 'name', 'color'] }],
        },
      ],
      order: [[{ model: InventoryItem, as: 'item' }, 'name', 'ASC']],
    });
    
    res.json({
      success: true,
      data: {
        warehouse: {
          id: warehouse.id,
          code: warehouse.code,
          name: warehouse.name,
        },
        stocks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ESTADÍSTICAS Y CATÁLOGOS ====================

/**
 * Obtener estadísticas generales
 */
exports.getStats = async (req, res, next) => {
  try {
    const stats = await inventoryService.getStats();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener tipos de almacén
 */
exports.getWarehouseTypes = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: inventoryService.getWarehouseTypes(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener tipos de item
 */
exports.getItemTypes = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: inventoryService.getItemTypes(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener tipos de movimiento
 */
exports.getMovementTypes = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: inventoryService.getMovementTypes(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener razones de movimiento
 */
exports.getMovementReasons = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: inventoryService.getMovementReasons(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidades de medida
 */
exports.getUnits = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: inventoryService.getUnits(),
    });
  } catch (error) {
    next(error);
  }
};
