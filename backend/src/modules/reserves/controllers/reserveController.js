const ReserveService = require('../services/reserveService');

const reserveService = new ReserveService();

// ========================================
// RESERVE ESTIMATES
// ========================================

const findAllEstimates = async (req, res) => {
  try {
    const result = await reserveService.findAllEstimates(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const findEstimateById = async (req, res) => {
  try {
        const estimate = await reserveService.findEstimateById(req.params.id);
    
    if (!estimate) {
      return res.status(404).json({ success: false, message: 'Estimate not found' });
    }
    
    res.json(estimate);
  } catch (error) {
    console.error('Error fetching estimate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEstimate = async (req, res) => {
  try {
        const estimate = await reserveService.createEstimate(req.body, req.user.userId);
    res.status(201).json(estimate);
  } catch (error) {
    console.error('Error creating estimate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEstimate = async (req, res) => {
  try {
        const estimate = await reserveService.updateEstimate(req.params.id, req.body);
    res.json(estimate);
  } catch (error) {
    console.error('Error updating estimate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEstimate = async (req, res) => {
  try {
        await reserveService.deleteEstimate(req.params.id);
    res.json({ success: true, message: 'Estimate deleted successfully' });
  } catch (error) {
    console.error('Error deleting estimate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveEstimate = async (req, res) => {
  try {
        const estimate = await reserveService.approveEstimate(req.params.id, req.user.userId);
    res.json(estimate);
  } catch (error) {
    console.error('Error approving estimate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// RESERVE CATEGORIES
// ========================================

const findCategoriesByEstimate = async (req, res) => {
  try {
        const categories = await reserveService.findCategoriesByEstimate(req.params.estimateId);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
        const category = await reserveService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
        const category = await reserveService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
        await reserveService.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// RESERVE VALUATIONS
// ========================================

const findAllValuations = async (req, res) => {
  try {
        const result = await reserveService.findAllValuations(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching valuations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const findValuationById = async (req, res) => {
  try {
        const valuation = await reserveService.findValuationById(req.params.id);
    
    if (!valuation) {
      return res.status(404).json({ success: false, message: 'Valuation not found' });
    }
    
    res.json(valuation);
  } catch (error) {
    console.error('Error fetching valuation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createValuation = async (req, res) => {
  try {
        const valuation = await reserveService.createValuation(req.body, req.user.userId);
    res.status(201).json(valuation);
  } catch (error) {
    console.error('Error creating valuation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateValuation = async (req, res) => {
  try {
        const valuation = await reserveService.updateValuation(req.params.id, req.body);
    res.json(valuation);
  } catch (error) {
    console.error('Error updating valuation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteValuation = async (req, res) => {
  try {
        await reserveService.deleteValuation(req.params.id);
    res.json({ success: true, message: 'Valuation deleted successfully' });
  } catch (error) {
    console.error('Error deleting valuation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveValuation = async (req, res) => {
  try {
        const valuation = await reserveService.approveValuation(req.params.id, req.user.userId);
    res.json(valuation);
  } catch (error) {
    console.error('Error approving valuation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// DASHBOARD
// ========================================

const getDashboard = async (req, res) => {
  try {
        const dashboard = await reserveService.getDashboard();
    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFieldReserves = async (req, res) => {
  try {
        const reserves = await reserveService.getFieldReserves(req.params.fieldId);
    res.json(reserves);
  } catch (error) {
    console.error('Error fetching field reserves:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  findAllEstimates,
  findEstimateById,
  createEstimate,
  updateEstimate,
  deleteEstimate,
  approveEstimate,
  findCategoriesByEstimate,
  createCategory,
  updateCategory,
  deleteCategory,
  findAllValuations,
  findValuationById,
  createValuation,
  updateValuation,
  deleteValuation,
  approveValuation,
  getDashboard,
  getFieldReserves,
};
