const assetService = require('../services/assetService');

// ========== CATÁLOGOS ==========

exports.getCatalogs = async (req, res) => {
  try {
    const catalogs = assetService.getCatalogs();
    res.json({ success: true, data: catalogs });
  } catch (error) {
    console.error('Error getting catalogs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== CATEGORÍAS ==========

exports.getCategories = async (req, res) => {
  try {
    const result = await assetService.getCategories(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await assetService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await assetService.createCategory(req.body, req.user.id);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await assetService.updateCategory(req.params.id, req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const result = await assetService.deleteCategory(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== ACTIVOS ==========

exports.getAssets = async (req, res) => {
  try {
    const result = await assetService.getAssets(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting assets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Activo no encontrado' });
    }
    res.json({ success: true, data: asset });
  } catch (error) {
    console.error('Error getting asset:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAssetFull = async (req, res) => {
  try {
    const asset = await assetService.getAssetFull(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Activo no encontrado' });
    }
    res.json({ success: true, data: asset });
  } catch (error) {
    console.error('Error getting asset full:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const asset = await assetService.createAsset(req.body, req.user.id);
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const asset = await assetService.updateAsset(req.params.id, req.body);
    res.json({ success: true, data: asset });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const result = await assetService.deleteAsset(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.disposeAsset = async (req, res) => {
  try {
    const asset = await assetService.disposeAsset(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: 'Activo dado de baja correctamente', data: asset });
  } catch (error) {
    console.error('Error disposing asset:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== MANTENIMIENTOS ==========

exports.getMaintenances = async (req, res) => {
  try {
    const result = await assetService.getMaintenances(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting maintenances:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await assetService.getMaintenanceById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ success: false, error: 'Mantenimiento no encontrado' });
    }
    res.json({ success: true, data: maintenance });
  } catch (error) {
    console.error('Error getting maintenance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createMaintenance = async (req, res) => {
  try {
    const maintenance = await assetService.createMaintenance(req.body, req.user.id);
    res.status(201).json({ success: true, data: maintenance });
  } catch (error) {
    console.error('Error creating maintenance:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await assetService.updateMaintenance(req.params.id, req.body);
    res.json({ success: true, data: maintenance });
  } catch (error) {
    console.error('Error updating maintenance:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.completeMaintenance = async (req, res) => {
  try {
    const maintenance = await assetService.completeMaintenance(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: 'Mantenimiento completado', data: maintenance });
  } catch (error) {
    console.error('Error completing maintenance:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== TRANSFERENCIAS ==========

exports.getTransfers = async (req, res) => {
  try {
    const result = await assetService.getTransfers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting transfers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTransferById = async (req, res) => {
  try {
    const transfer = await assetService.getTransferById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ success: false, error: 'Transferencia no encontrada' });
    }
    res.json({ success: true, data: transfer });
  } catch (error) {
    console.error('Error getting transfer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createTransfer = async (req, res) => {
  try {
    const transfer = await assetService.createTransfer(req.body, req.user.id);
    res.status(201).json({ success: true, data: transfer });
  } catch (error) {
    console.error('Error creating transfer:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.approveTransfer = async (req, res) => {
  try {
    const transfer = await assetService.approveTransfer(req.params.id, req.user.id);
    res.json({ success: true, message: 'Transferencia aprobada', data: transfer });
  } catch (error) {
    console.error('Error approving transfer:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.completeTransfer = async (req, res) => {
  try {
    const transfer = await assetService.completeTransfer(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: 'Transferencia completada', data: transfer });
  } catch (error) {
    console.error('Error completing transfer:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== DEPRECIACIÓN ==========

exports.calculateDepreciation = async (req, res) => {
  try {
    const { assetId, year, month } = req.body;
    const depreciation = await assetService.calculateDepreciation(assetId, year, month, req.user.id);
    res.status(201).json({ success: true, data: depreciation });
  } catch (error) {
    console.error('Error calculating depreciation:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getDepreciations = async (req, res) => {
  try {
    const result = await assetService.getDepreciations(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting depreciations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.runMonthlyDepreciation = async (req, res) => {
  try {
    const { year, month } = req.body;
    const result = await assetService.runMonthlyDepreciation(year, month, req.user.id);
    res.json({ 
      success: true, 
      message: `Depreciación mensual ejecutada: ${result.processed} procesados, ${result.skipped} omitidos`,
      data: result,
    });
  } catch (error) {
    console.error('Error running monthly depreciation:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== ESTADÍSTICAS ==========

exports.getStats = async (req, res) => {
  try {
    const stats = await assetService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await assetService.getAlerts();
    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
