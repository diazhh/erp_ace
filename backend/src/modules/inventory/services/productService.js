const { Op } = require('sequelize');

class ProductService {
  /**
   * Genera código único para producto
   */
  async generateProductCode() {
    const { Product } = require('../../../database/models');
    
    const lastProduct = await Product.findOne({
      where: {
        code: { [Op.like]: 'PROD-%' },
      },
      order: [['code', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastProduct && lastProduct.code) {
      const match = lastProduct.code.match(/PROD-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    return `PROD-${String(nextNumber).padStart(5, '0')}`;
  }

  /**
   * Crear producto
   */
  async createProduct(data, userId) {
    const { Product } = require('../../../database/models');
    
    const code = data.code || await this.generateProductCode();
    
    const product = await Product.create({
      ...data,
      code,
      createdBy: userId,
    });
    
    return product;
  }

  /**
   * Actualizar producto
   */
  async updateProduct(id, data) {
    const { Product } = require('../../../database/models');
    
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    await product.update(data);
    return product;
  }

  /**
   * Obtener producto con estadísticas
   */
  async getProductWithStats(id) {
    const { Product, InventoryCategory, Contractor, User, InventoryUnit, Warehouse } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const product = await Product.findByPk(id, {
      include: [
        { model: InventoryCategory, as: 'category' },
        { model: Contractor, as: 'preferredSupplier', attributes: ['id', 'companyName', 'code'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });
    
    if (!product) {
      return null;
    }
    
    // Obtener estadísticas de unidades por estado
    const unitStats = await InventoryUnit.findAll({
      where: { productId: id },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });
    
    // Obtener distribución por almacén
    const warehouseDistribution = await InventoryUnit.findAll({
      where: { 
        productId: id,
        warehouseId: { [Op.ne]: null },
      },
      attributes: [
        'warehouseId',
        [sequelize.fn('COUNT', sequelize.col('InventoryUnit.id')), 'count'],
      ],
      include: [
        { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name'] },
      ],
      group: ['warehouseId', 'warehouse.id'],
      raw: true,
      nest: true,
    });
    
    return {
      ...product.toJSON(),
      unitStats,
      warehouseDistribution,
    };
  }

  /**
   * Listar productos con filtros
   */
  async listProducts(filters = {}) {
    const { Product, InventoryCategory, Contractor, User } = require('../../../database/models');
    
    const {
      search,
      categoryId,
      productType,
      status,
      lowStock,
      page = 1,
      limit = 20,
    } = filters;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    if (categoryId) where.categoryId = categoryId;
    if (productType) where.productType = productType;
    if (status) where.status = status;
    
    if (lowStock === 'true' || lowStock === true) {
      where.availableUnits = {
        [Op.lte]: sequelize.col('min_stock'),
      };
    }
    
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: InventoryCategory, as: 'category', attributes: ['id', 'name', 'color'] },
        { model: Contractor, as: 'preferredSupplier', attributes: ['id', 'companyName'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['name', 'ASC']],
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
   * Actualizar contadores de unidades del producto
   */
  async updateProductUnitCounts(productId, transaction = null) {
    const { Product, InventoryUnit } = require('../../../database/models');
    const { sequelize } = require('../../../database');
    
    const counts = await InventoryUnit.findAll({
      where: { productId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
      transaction,
    });
    
    const statusCounts = {};
    counts.forEach(c => {
      statusCounts[c.status] = parseInt(c.count);
    });
    
    const totalUnits = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    const availableUnits = statusCounts['AVAILABLE'] || 0;
    const assignedUnits = (statusCounts['ASSIGNED'] || 0) + (statusCounts['IN_USE'] || 0);
    const inTransitUnits = statusCounts['IN_TRANSIT'] || 0;
    const damagedUnits = statusCounts['DAMAGED'] || 0;
    const retiredUnits = (statusCounts['RETIRED'] || 0) + (statusCounts['LOST'] || 0);
    
    await Product.update({
      totalUnits,
      availableUnits,
      assignedUnits,
      inTransitUnits,
      damagedUnits,
      retiredUnits,
    }, {
      where: { id: productId },
      transaction,
    });
  }

  /**
   * Obtener catálogos para formularios
   */
  async getCatalogs() {
    const { InventoryCategory, Contractor, Warehouse } = require('../../../database/models');
    
    const [categories, suppliers, warehouses] = await Promise.all([
      InventoryCategory.findAll({
        where: { status: 'ACTIVE' },
        attributes: ['id', 'code', 'name', 'color'],
        order: [['name', 'ASC']],
      }),
      Contractor.findAll({
        where: { status: 'ACTIVE' },
        attributes: ['id', 'code', 'companyName'],
        order: [['companyName', 'ASC']],
      }),
      Warehouse.findAll({
        where: { status: 'ACTIVE' },
        attributes: ['id', 'code', 'name', 'warehouseType'],
        order: [['name', 'ASC']],
      }),
    ]);
    
    const productTypes = [
      { value: 'PRODUCT', label: 'Producto' },
      { value: 'MATERIAL', label: 'Material' },
      { value: 'TOOL', label: 'Herramienta' },
      { value: 'EQUIPMENT', label: 'Equipo' },
      { value: 'CONSUMABLE', label: 'Consumible' },
      { value: 'SPARE_PART', label: 'Repuesto' },
    ];
    
    const statuses = [
      { value: 'ACTIVE', label: 'Activo' },
      { value: 'INACTIVE', label: 'Inactivo' },
      { value: 'DISCONTINUED', label: 'Descontinuado' },
    ];
    
    return {
      categories,
      suppliers,
      warehouses,
      productTypes,
      statuses,
    };
  }
}

module.exports = new ProductService();
