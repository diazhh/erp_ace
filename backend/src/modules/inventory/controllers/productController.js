const productService = require('../services/productService');

/**
 * Listar productos
 */
exports.listProducts = async (req, res, next) => {
  try {
    const result = await productService.listProducts(req.query);
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener producto por ID
 */
exports.getProduct = async (req, res, next) => {
  try {
    const { Product, InventoryCategory, Contractor, User } = require('../../../database/models');
    
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: InventoryCategory, as: 'category' },
        { model: Contractor, as: 'preferredSupplier', attributes: ['id', 'code', 'companyName'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener producto con estadísticas completas
 */
exports.getProductFull = async (req, res, next) => {
  try {
    const product = await productService.getProductWithStats(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear producto
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.user.id);
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar producto
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar producto (soft delete)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { Product, InventoryUnit } = require('../../../database/models');
    
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }
    
    // Verificar si tiene unidades activas
    const activeUnits = await InventoryUnit.count({
      where: {
        productId: req.params.id,
        status: { [require('sequelize').Op.notIn]: ['RETIRED', 'LOST'] },
      },
    });
    
    if (activeUnits > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el producto porque tiene ${activeUnits} unidades activas`,
      });
    }
    
    await product.update({ status: 'INACTIVE' });
    
    res.json({
      success: true,
      message: 'Producto desactivado exitosamente',
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
    const catalogs = await productService.getCatalogs();
    
    res.json({
      success: true,
      data: catalogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener unidades de un producto
 */
exports.getProductUnits = async (req, res, next) => {
  try {
    const inventoryUnitService = require('../services/inventoryUnitService');
    const result = await inventoryUnitService.getProductUnits(req.params.id, req.query);
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
