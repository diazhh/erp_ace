const LogisticsService = require('../services/logisticsService');

const logisticsService = new LogisticsService();

// ========================================
// STORAGE TANKS
// ========================================

const findAllTanks = async (req, res) => {
  try {
    const result = await logisticsService.findAllTanks(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching tanks:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const findTankById = async (req, res) => {
  try {
    const tank = await logisticsService.findTankById(req.params.id);
    
    if (!tank) {
      return res.status(404).json({ success: false, message: 'Tank not found' });
    }
    
    res.json(tank);
  } catch (error) {
    console.error('Error fetching tank:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTank = async (req, res) => {
  try {
    const tank = await logisticsService.createTank(req.body, req.user.userId);
    res.status(201).json(tank);
  } catch (error) {
    console.error('Error creating tank:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTank = async (req, res) => {
  try {
    const tank = await logisticsService.updateTank(req.params.id, req.body);
    res.json(tank);
  } catch (error) {
    console.error('Error updating tank:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTank = async (req, res) => {
  try {
    await logisticsService.deleteTank(req.params.id);
    res.json({ success: true, message: 'Tank deleted successfully' });
  } catch (error) {
    console.error('Error deleting tank:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// TANK GAUGINGS
// ========================================

const findGaugingsByTank = async (req, res) => {
  try {
    const result = await logisticsService.findGaugingsByTank(req.params.tankId, req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching gaugings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createGauging = async (req, res) => {
  try {
    const gauging = await logisticsService.createGauging(req.body, req.user.userId);
    res.status(201).json(gauging);
  } catch (error) {
    console.error('Error creating gauging:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteGauging = async (req, res) => {
  try {
    await logisticsService.deleteGauging(req.params.id);
    res.json({ success: true, message: 'Gauging deleted successfully' });
  } catch (error) {
    console.error('Error deleting gauging:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// LOADING TICKETS
// ========================================

const findAllTickets = async (req, res) => {
  try {
    const result = await logisticsService.findAllTickets(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const findTicketById = async (req, res) => {
  try {
    const ticket = await logisticsService.findTicketById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const ticket = await logisticsService.createTicket(req.body, req.user.userId);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await logisticsService.updateTicket(req.params.id, req.body);
    res.json(ticket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    await logisticsService.deleteTicket(req.params.id);
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const completeTicket = async (req, res) => {
  try {
    const ticket = await logisticsService.completeTicket(req.params.id, req.body, req.user.userId);
    res.json(ticket);
  } catch (error) {
    console.error('Error completing ticket:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// CRUDE QUALITY
// ========================================

const findAllQualities = async (req, res) => {
  try {
    const result = await logisticsService.findAllQualities(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching qualities:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const findQualityById = async (req, res) => {
  try {
    const quality = await logisticsService.findQualityById(req.params.id);
    
    if (!quality) {
      return res.status(404).json({ success: false, message: 'Quality record not found' });
    }
    
    res.json(quality);
  } catch (error) {
    console.error('Error fetching quality:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createQuality = async (req, res) => {
  try {
    const quality = await logisticsService.createQuality(req.body, req.user.userId);
    res.status(201).json(quality);
  } catch (error) {
    console.error('Error creating quality:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateQuality = async (req, res) => {
  try {
    const quality = await logisticsService.updateQuality(req.params.id, req.body);
    res.json(quality);
  } catch (error) {
    console.error('Error updating quality:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteQuality = async (req, res) => {
  try {
    await logisticsService.deleteQuality(req.params.id);
    res.json({ success: true, message: 'Quality record deleted successfully' });
  } catch (error) {
    console.error('Error deleting quality:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveQuality = async (req, res) => {
  try {
    const quality = await logisticsService.approveQuality(req.params.id, req.user.userId);
    res.json(quality);
  } catch (error) {
    console.error('Error approving quality:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// PIPELINES
// ========================================

const findAllPipelines = async (req, res) => {
  try {
    const result = await logisticsService.findAllPipelines(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const findPipelineById = async (req, res) => {
  try {
    const pipeline = await logisticsService.findPipelineById(req.params.id);
    
    if (!pipeline) {
      return res.status(404).json({ success: false, message: 'Pipeline not found' });
    }
    
    res.json(pipeline);
  } catch (error) {
    console.error('Error fetching pipeline:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPipeline = async (req, res) => {
  try {
    const pipeline = await logisticsService.createPipeline(req.body, req.user.userId);
    res.status(201).json(pipeline);
  } catch (error) {
    console.error('Error creating pipeline:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePipeline = async (req, res) => {
  try {
    const pipeline = await logisticsService.updatePipeline(req.params.id, req.body);
    res.json(pipeline);
  } catch (error) {
    console.error('Error updating pipeline:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePipeline = async (req, res) => {
  try {
    await logisticsService.deletePipeline(req.params.id);
    res.json({ success: true, message: 'Pipeline deleted successfully' });
  } catch (error) {
    console.error('Error deleting pipeline:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// DASHBOARD
// ========================================

const getDashboard = async (req, res) => {
  try {
    const dashboard = await logisticsService.getDashboard();
    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  findAllTanks,
  findTankById,
  createTank,
  updateTank,
  deleteTank,
  findGaugingsByTank,
  createGauging,
  deleteGauging,
  findAllTickets,
  findTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  completeTicket,
  findAllQualities,
  findQualityById,
  createQuality,
  updateQuality,
  deleteQuality,
  approveQuality,
  findAllPipelines,
  findPipelineById,
  createPipeline,
  updatePipeline,
  deletePipeline,
  getDashboard,
};
