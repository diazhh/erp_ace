const { Op } = require('sequelize');

class InventoryService {
  /**
   * Genera código único para almacén
   */
  async generateWarehouseCode() {
    const { Warehouse } = require('../../../database/models');
    
    const lastWarehouse = await Warehouse.findOne({
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastWarehouse && lastWarehouse.code) {
      const match = lastWarehouse.code.match(/ALM-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `ALM-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Genera código único para categoría
   */
  async generateCategoryCode() {
    const { InventoryCategory } = require('../../../database/models');
    
    const lastCategory = await InventoryCategory.findOne({
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastCategory && lastCategory.code) {
      const match = lastCategory.code.match(/CAT-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `CAT-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Genera código único para item
   */
  async generateItemCode() {
    const { InventoryItem } = require('../../../database/models');
    
    const lastItem = await InventoryItem.findOne({
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastItem && lastItem.code) {
      const match = lastItem.code.match(/ITM-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `ITM-${String(nextNumber).padStart(5, '0')}`;
  }

  /**
   * Genera código único para movimiento
   */
  async generateMovementCode() {
    const { InventoryMovement } = require('../../../database/models');
    
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const prefix = `MOV-${year}${month}`;
    
    const lastMovement = await InventoryMovement.findOne({
      where: {
        code: { [Op.like]: `${prefix}%` },
      },
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastMovement && lastMovement.code) {
      const match = lastMovement.code.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
  }

  /**
   * Actualiza el stock de un item en un almacén
   */
  async updateWarehouseStock(warehouseId, itemId, quantityChange, transaction = null) {
    const { WarehouseStock, InventoryItem } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const t = transaction || await sequelize.transaction();
    
    try {
      // Buscar o crear el registro de stock
      let stock = await WarehouseStock.findOne({
        where: { warehouseId, itemId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      
      if (!stock) {
        stock = await WarehouseStock.create({
          warehouseId,
          itemId,
          quantity: 0,
          reservedQuantity: 0,
          availableQuantity: 0,
        }, { transaction: t });
      }
      
      // Actualizar cantidad
      const newQuantity = parseFloat(stock.quantity) + quantityChange;
      if (newQuantity < 0) {
        throw new Error('Stock insuficiente en el almacén');
      }
      
      const newAvailable = newQuantity - parseFloat(stock.reservedQuantity);
      
      await stock.update({
        quantity: newQuantity,
        availableQuantity: newAvailable,
      }, { transaction: t });
      
      // Actualizar stock total del item
      await this.updateItemTotalStock(itemId, t);
      
      if (!transaction) {
        await t.commit();
      }
      
      return stock;
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  /**
   * Actualiza el stock total de un item (suma de todos los almacenes)
   */
  async updateItemTotalStock(itemId, transaction = null) {
    const { WarehouseStock, InventoryItem } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const result = await WarehouseStock.findOne({
      where: { itemId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalStock'],
        [sequelize.fn('SUM', sequelize.col('reserved_quantity')), 'reservedStock'],
        [sequelize.fn('SUM', sequelize.col('available_quantity')), 'availableStock'],
      ],
      raw: true,
      transaction,
    });
    
    await InventoryItem.update({
      totalStock: parseFloat(result?.totalStock || 0),
      reservedStock: parseFloat(result?.reservedStock || 0),
      availableStock: parseFloat(result?.availableStock || 0),
    }, {
      where: { id: itemId },
      transaction,
    });
  }

  /**
   * Reserva stock para un proyecto
   */
  async reserveStock(warehouseId, itemId, quantity, transaction = null) {
    const { WarehouseStock } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const t = transaction || await sequelize.transaction();
    
    try {
      const stock = await WarehouseStock.findOne({
        where: { warehouseId, itemId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      
      if (!stock) {
        throw new Error('No hay stock de este item en el almacén');
      }
      
      if (parseFloat(stock.availableQuantity) < quantity) {
        throw new Error('Stock disponible insuficiente');
      }
      
      const newReserved = parseFloat(stock.reservedQuantity) + quantity;
      const newAvailable = parseFloat(stock.quantity) - newReserved;
      
      await stock.update({
        reservedQuantity: newReserved,
        availableQuantity: newAvailable,
      }, { transaction: t });
      
      await this.updateItemTotalStock(itemId, t);
      
      if (!transaction) {
        await t.commit();
      }
      
      return stock;
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  /**
   * Libera stock reservado
   */
  async releaseStock(warehouseId, itemId, quantity, transaction = null) {
    const { WarehouseStock } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const t = transaction || await sequelize.transaction();
    
    try {
      const stock = await WarehouseStock.findOne({
        where: { warehouseId, itemId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      
      if (!stock) {
        throw new Error('No hay stock de este item en el almacén');
      }
      
      const newReserved = Math.max(0, parseFloat(stock.reservedQuantity) - quantity);
      const newAvailable = parseFloat(stock.quantity) - newReserved;
      
      await stock.update({
        reservedQuantity: newReserved,
        availableQuantity: newAvailable,
      }, { transaction: t });
      
      await this.updateItemTotalStock(itemId, t);
      
      if (!transaction) {
        await t.commit();
      }
      
      return stock;
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  /**
   * Procesa un movimiento de inventario
   */
  async processMovement(movementData, userId, transaction = null) {
    const { InventoryMovement, InventoryItem } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const t = transaction || await sequelize.transaction();
    
    try {
      const {
        movementType,
        itemId,
        sourceWarehouseId,
        destinationWarehouseId,
        quantity,
        ...rest
      } = movementData;
      
      // Validar item
      const item = await InventoryItem.findByPk(itemId, { transaction: t });
      if (!item) {
        throw new Error('Item no encontrado');
      }
      
      // Generar código
      const code = await this.generateMovementCode();
      
      // Calcular costo total
      const unitCost = rest.unitCost || parseFloat(item.unitCost);
      const totalCost = unitCost * quantity;
      
      // Crear movimiento
      const movement = await InventoryMovement.create({
        code,
        movementType,
        itemId,
        sourceWarehouseId,
        destinationWarehouseId,
        quantity,
        unitCost,
        totalCost,
        currency: item.currency,
        createdBy: userId,
        ...rest,
      }, { transaction: t });
      
      // Actualizar stocks según tipo de movimiento
      switch (movementType) {
        case 'ENTRY':
        case 'ADJUSTMENT_IN':
        case 'RETURN':
          if (!destinationWarehouseId) {
            throw new Error('Se requiere almacén destino para entrada');
          }
          await this.updateWarehouseStock(destinationWarehouseId, itemId, quantity, t);
          break;
          
        case 'EXIT':
        case 'ADJUSTMENT_OUT':
          if (!sourceWarehouseId) {
            throw new Error('Se requiere almacén origen para salida');
          }
          await this.updateWarehouseStock(sourceWarehouseId, itemId, -quantity, t);
          break;
          
        case 'TRANSFER':
          if (!sourceWarehouseId || !destinationWarehouseId) {
            throw new Error('Se requieren ambos almacenes para transferencia');
          }
          await this.updateWarehouseStock(sourceWarehouseId, itemId, -quantity, t);
          await this.updateWarehouseStock(destinationWarehouseId, itemId, quantity, t);
          break;
          
        case 'RESERVATION':
          if (!sourceWarehouseId) {
            throw new Error('Se requiere almacén para reserva');
          }
          await this.reserveStock(sourceWarehouseId, itemId, quantity, t);
          break;
          
        case 'RELEASE':
          if (!sourceWarehouseId) {
            throw new Error('Se requiere almacén para liberación');
          }
          await this.releaseStock(sourceWarehouseId, itemId, quantity, t);
          break;
      }
      
      // Actualizar costo promedio del item si es entrada
      if (['ENTRY', 'RETURN'].includes(movementType) && unitCost > 0) {
        await this.updateAverageCost(itemId, quantity, unitCost, t);
      }
      
      // Integración con Finanzas: Crear transacción si es compra
      if (rest.reason === 'PURCHASE' && rest.accountId) {
        await this.createPurchaseTransaction(movement, item, rest.accountId, userId, t);
      }
      
      if (!transaction) {
        await t.commit();
      }
      
      return movement;
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  /**
   * Crea una transacción de compra en Finanzas
   */
  async createPurchaseTransaction(movement, item, accountId, userId, transaction = null) {
    const { Transaction, BankAccount } = require('../../../database/models');
    const financeService = require('../../finance/services/financeService');
    
    // Verificar que la cuenta existe
    const account = await BankAccount.findByPk(accountId, { transaction });
    if (!account) {
      throw new Error('Cuenta bancaria no encontrada');
    }
    
    // Generar código de transacción
    const transactionCode = await financeService.generateTransactionCode();
    
    // Crear transacción de gasto
    const financeTransaction = await Transaction.create({
      code: transactionCode,
      transactionType: 'EXPENSE',
      accountId,
      amount: parseFloat(movement.totalCost),
      currency: movement.currency,
      category: 'INVENTORY_PURCHASE',
      description: `Compra de inventario: ${item.name} (${movement.quantity} ${item.unit})`,
      transactionDate: movement.movementDate,
      referenceType: 'InventoryMovement',
      referenceId: movement.id,
      referenceCode: movement.code,
      status: 'COMPLETED',
      createdBy: userId,
    }, { transaction });
    
    // Actualizar saldo de la cuenta
    await financeService.updateAccountBalance(accountId, -parseFloat(movement.totalCost), transaction);
    
    return financeTransaction;
  }

  /**
   * Actualiza el costo promedio de un item
   */
  async updateAverageCost(itemId, newQuantity, newUnitCost, transaction = null) {
    const { InventoryItem } = require('../../../database/models');
    
    const item = await InventoryItem.findByPk(itemId, { transaction });
    if (!item) return;
    
    const currentStock = parseFloat(item.totalStock) - newQuantity;
    const currentCost = parseFloat(item.unitCost);
    
    // Costo promedio ponderado
    let newAverageCost;
    if (currentStock <= 0) {
      newAverageCost = newUnitCost;
    } else {
      const totalValue = (currentStock * currentCost) + (newQuantity * newUnitCost);
      const totalQuantity = currentStock + newQuantity;
      newAverageCost = totalValue / totalQuantity;
    }
    
    await item.update({ unitCost: newAverageCost }, { transaction });
  }

  /**
   * Obtiene estadísticas de inventario
   */
  async getStats() {
    const { 
      Warehouse, InventoryItem, InventoryCategory, InventoryMovement, WarehouseStock 
    } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    // Almacenes activos
    const activeWarehouses = await Warehouse.count({
      where: { status: 'ACTIVE' },
    });
    
    // Items activos
    const activeItems = await InventoryItem.count({
      where: { status: 'ACTIVE' },
    });
    
    // Items por tipo
    const itemsByType = await InventoryItem.findAll({
      where: { status: 'ACTIVE' },
      attributes: [
        'itemType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['itemType'],
      raw: true,
    });
    
    // Valor total del inventario
    const inventoryValue = await WarehouseStock.findOne({
      include: [{
        model: InventoryItem,
        as: 'item',
        attributes: [],
      }],
      attributes: [
        [sequelize.literal('SUM(quantity * item.unit_cost)'), 'totalValue'],
      ],
      raw: true,
    });
    
    // Items con stock bajo
    const lowStockItems = await InventoryItem.count({
      where: {
        status: 'ACTIVE',
        minStock: { [Op.ne]: null },
        [Op.and]: sequelize.literal('total_stock <= min_stock'),
      },
    });
    
    // Items sin stock
    const outOfStockItems = await InventoryItem.count({
      where: {
        status: 'ACTIVE',
        totalStock: 0,
      },
    });
    
    // Movimientos del mes
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyMovements = await InventoryMovement.findAll({
      where: {
        movementDate: { [Op.gte]: startOfMonth },
        status: 'COMPLETED',
      },
      attributes: [
        'movementType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_cost')), 'totalValue'],
      ],
      group: ['movementType'],
      raw: true,
    });
    
    // Categorías
    const totalCategories = await InventoryCategory.count({
      where: { status: 'ACTIVE' },
    });
    
    return {
      warehouses: {
        active: activeWarehouses,
      },
      items: {
        total: activeItems,
        byType: itemsByType,
        lowStock: lowStockItems,
        outOfStock: outOfStockItems,
      },
      categories: {
        total: totalCategories,
      },
      value: {
        total: parseFloat(inventoryValue?.totalValue || 0),
      },
      movements: {
        monthly: monthlyMovements,
      },
    };
  }

  /**
   * Obtiene estadísticas de un almacén específico
   */
  async getWarehouseStats(warehouseId) {
    const { Warehouse, WarehouseStock, InventoryItem, InventoryMovement } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) {
      throw new Error('Almacén no encontrado');
    }
    
    // Total de items diferentes
    const totalItems = await WarehouseStock.count({
      where: { 
        warehouseId,
        quantity: { [Op.gt]: 0 },
      },
    });
    
    // Valor del inventario en este almacén
    const stockValue = await WarehouseStock.findOne({
      where: { warehouseId },
      include: [{
        model: InventoryItem,
        as: 'item',
        attributes: [],
      }],
      attributes: [
        [sequelize.literal('SUM(quantity * item.unit_cost)'), 'totalValue'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
      ],
      raw: true,
    });
    
    // Movimientos recientes
    const recentMovements = await InventoryMovement.count({
      where: {
        [Op.or]: [
          { sourceWarehouseId: warehouseId },
          { destinationWarehouseId: warehouseId },
        ],
        movementDate: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
    
    return {
      warehouse: {
        id: warehouse.id,
        code: warehouse.code,
        name: warehouse.name,
        type: warehouse.warehouseType,
        status: warehouse.status,
      },
      stock: {
        totalItems,
        totalQuantity: parseFloat(stockValue?.totalQuantity || 0),
        totalValue: parseFloat(stockValue?.totalValue || 0),
      },
      activity: {
        recentMovements,
      },
    };
  }

  /**
   * Obtiene estadísticas de un item específico
   */
  async getItemStats(itemId) {
    const { InventoryItem, WarehouseStock, InventoryMovement, Warehouse } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const item = await InventoryItem.findByPk(itemId);
    if (!item) {
      throw new Error('Item no encontrado');
    }
    
    // Stock por almacén
    const stockByWarehouse = await WarehouseStock.findAll({
      where: { 
        itemId,
        quantity: { [Op.gt]: 0 },
      },
      include: [{
        model: Warehouse,
        as: 'warehouse',
        attributes: ['id', 'code', 'name'],
      }],
    });
    
    // Movimientos del último mes
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    
    const monthlyMovements = await InventoryMovement.findAll({
      where: {
        itemId,
        movementDate: { [Op.gte]: startOfMonth },
        status: 'COMPLETED',
      },
      attributes: [
        'movementType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
      ],
      group: ['movementType'],
      raw: true,
    });
    
    // Valor total del stock
    const totalValue = parseFloat(item.totalStock) * parseFloat(item.unitCost);
    
    // Alertas
    const alerts = [];
    if (item.minStock && parseFloat(item.totalStock) <= parseFloat(item.minStock)) {
      alerts.push({ type: 'LOW_STOCK', message: 'Stock por debajo del mínimo' });
    }
    if (parseFloat(item.totalStock) === 0) {
      alerts.push({ type: 'OUT_OF_STOCK', message: 'Sin stock' });
    }
    if (item.reorderPoint && parseFloat(item.availableStock) <= parseFloat(item.reorderPoint)) {
      alerts.push({ type: 'REORDER', message: 'Alcanzó punto de reorden' });
    }
    
    return {
      item: {
        id: item.id,
        code: item.code,
        name: item.name,
        type: item.itemType,
        unit: item.unit,
        status: item.status,
      },
      stock: {
        total: parseFloat(item.totalStock),
        reserved: parseFloat(item.reservedStock),
        available: parseFloat(item.availableStock),
        byWarehouse: stockByWarehouse,
      },
      cost: {
        unitCost: parseFloat(item.unitCost),
        totalValue,
      },
      levels: {
        min: parseFloat(item.minStock || 0),
        max: parseFloat(item.maxStock || 0),
        reorderPoint: parseFloat(item.reorderPoint || 0),
      },
      activity: {
        monthlyMovements,
      },
      alerts,
    };
  }

  /**
   * Tipos de almacén
   */
  getWarehouseTypes() {
    return [
      { code: 'MAIN', name: 'Principal', icon: 'warehouse', color: '#1976d2' },
      { code: 'SECONDARY', name: 'Secundario', icon: 'store', color: '#388e3c' },
      { code: 'TRANSIT', name: 'Tránsito', icon: 'local_shipping', color: '#f57c00' },
      { code: 'PROJECT', name: 'Proyecto', icon: 'construction', color: '#7b1fa2' },
    ];
  }

  /**
   * Tipos de item
   */
  getItemTypes() {
    return [
      { code: 'PRODUCT', name: 'Producto', icon: 'inventory_2' },
      { code: 'MATERIAL', name: 'Material', icon: 'category' },
      { code: 'TOOL', name: 'Herramienta', icon: 'build' },
      { code: 'EQUIPMENT', name: 'Equipo', icon: 'precision_manufacturing' },
      { code: 'CONSUMABLE', name: 'Consumible', icon: 'water_drop' },
      { code: 'SPARE_PART', name: 'Repuesto', icon: 'settings' },
    ];
  }

  /**
   * Tipos de movimiento
   */
  getMovementTypes() {
    return [
      { code: 'ENTRY', name: 'Entrada', icon: 'add_circle', color: '#4caf50' },
      { code: 'EXIT', name: 'Salida', icon: 'remove_circle', color: '#f44336' },
      { code: 'TRANSFER', name: 'Transferencia', icon: 'swap_horiz', color: '#2196f3' },
      { code: 'ADJUSTMENT_IN', name: 'Ajuste (+)', icon: 'add_box', color: '#8bc34a' },
      { code: 'ADJUSTMENT_OUT', name: 'Ajuste (-)', icon: 'indeterminate_check_box', color: '#ff9800' },
      { code: 'RETURN', name: 'Devolución', icon: 'undo', color: '#9c27b0' },
      { code: 'RESERVATION', name: 'Reserva', icon: 'bookmark', color: '#607d8b' },
      { code: 'RELEASE', name: 'Liberación', icon: 'bookmark_remove', color: '#795548' },
    ];
  }

  /**
   * Razones de movimiento
   */
  getMovementReasons() {
    return [
      { code: 'PURCHASE', name: 'Compra', forTypes: ['ENTRY'] },
      { code: 'PROJECT_USE', name: 'Uso en Proyecto', forTypes: ['EXIT'] },
      { code: 'SALE', name: 'Venta', forTypes: ['EXIT'] },
      { code: 'DAMAGE', name: 'Daño', forTypes: ['ADJUSTMENT_OUT'] },
      { code: 'LOSS', name: 'Pérdida', forTypes: ['ADJUSTMENT_OUT'] },
      { code: 'THEFT', name: 'Robo', forTypes: ['ADJUSTMENT_OUT'] },
      { code: 'EXPIRY', name: 'Vencimiento', forTypes: ['ADJUSTMENT_OUT'] },
      { code: 'COUNT_ADJUSTMENT', name: 'Ajuste por Conteo', forTypes: ['ADJUSTMENT_IN', 'ADJUSTMENT_OUT'] },
      { code: 'TRANSFER', name: 'Transferencia', forTypes: ['TRANSFER'] },
      { code: 'RETURN_SUPPLIER', name: 'Devolución a Proveedor', forTypes: ['EXIT'] },
      { code: 'RETURN_PROJECT', name: 'Devolución de Proyecto', forTypes: ['RETURN'] },
      { code: 'DONATION', name: 'Donación', forTypes: ['ENTRY'] },
      { code: 'OTHER', name: 'Otro', forTypes: ['ENTRY', 'EXIT', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT'] },
    ];
  }

  /**
   * Unidades de medida
   */
  getUnits() {
    return [
      { code: 'UND', name: 'Unidad', symbol: 'und' },
      { code: 'KG', name: 'Kilogramo', symbol: 'kg' },
      { code: 'G', name: 'Gramo', symbol: 'g' },
      { code: 'LB', name: 'Libra', symbol: 'lb' },
      { code: 'M', name: 'Metro', symbol: 'm' },
      { code: 'CM', name: 'Centímetro', symbol: 'cm' },
      { code: 'M2', name: 'Metro Cuadrado', symbol: 'm²' },
      { code: 'M3', name: 'Metro Cúbico', symbol: 'm³' },
      { code: 'L', name: 'Litro', symbol: 'L' },
      { code: 'ML', name: 'Mililitro', symbol: 'mL' },
      { code: 'GAL', name: 'Galón', symbol: 'gal' },
      { code: 'PZA', name: 'Pieza', symbol: 'pza' },
      { code: 'PAR', name: 'Par', symbol: 'par' },
      { code: 'CAJA', name: 'Caja', symbol: 'caja' },
      { code: 'PAQUETE', name: 'Paquete', symbol: 'paq' },
      { code: 'ROLLO', name: 'Rollo', symbol: 'rollo' },
      { code: 'BOLSA', name: 'Bolsa', symbol: 'bolsa' },
    ];
  }
}

module.exports = new InventoryService();
