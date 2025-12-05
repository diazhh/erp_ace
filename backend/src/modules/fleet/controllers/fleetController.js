const fleetService = require('../services/fleetService');

// ========== VEHICLES ==========

exports.getVehicles = async (req, res) => {
  try {
    const result = await fleetService.getVehicles(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting vehicles:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await fleetService.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error getting vehicle:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getVehicleFull = async (req, res) => {
  try {
    const vehicle = await fleetService.getVehicleFull(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error getting vehicle full:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await fleetService.createVehicle(req.body, req.user.id);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await fleetService.updateVehicle(req.params.id, req.body);
    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const result = await fleetService.deleteVehicle(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== ASSIGNMENTS ==========

exports.getAssignments = async (req, res) => {
  try {
    const result = await fleetService.getAssignments(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting assignments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const assignment = await fleetService.createAssignment(req.body, req.user.id);
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.endAssignment = async (req, res) => {
  try {
    const assignment = await fleetService.endAssignment(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error ending assignment:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== MAINTENANCES ==========

exports.getMaintenances = async (req, res) => {
  try {
    const result = await fleetService.getMaintenances(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting maintenances:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await fleetService.getMaintenanceById(req.params.id);
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
    const maintenance = await fleetService.createMaintenance(req.body, req.user.id);
    res.status(201).json({ success: true, data: maintenance });
  } catch (error) {
    console.error('Error creating maintenance:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await fleetService.updateMaintenance(req.params.id, req.body);
    res.json({ success: true, data: maintenance });
  } catch (error) {
    console.error('Error updating maintenance:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.completeMaintenance = async (req, res) => {
  try {
    const maintenance = await fleetService.completeMaintenance(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: maintenance });
  } catch (error) {
    console.error('Error completing maintenance:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== FUEL LOGS ==========

exports.getFuelLogs = async (req, res) => {
  try {
    const result = await fleetService.getFuelLogs(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting fuel logs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFuelLogById = async (req, res) => {
  try {
    const fuelLog = await fleetService.getFuelLogById(req.params.id);
    if (!fuelLog) {
      return res.status(404).json({ success: false, error: 'Registro de combustible no encontrado' });
    }
    res.json({ success: true, data: fuelLog });
  } catch (error) {
    console.error('Error getting fuel log:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createFuelLog = async (req, res) => {
  try {
    const fuelLog = await fleetService.createFuelLog(req.body, req.user.id);
    res.status(201).json({ success: true, data: fuelLog });
  } catch (error) {
    console.error('Error creating fuel log:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateFuelLog = async (req, res) => {
  try {
    const fuelLog = await fleetService.updateFuelLog(req.params.id, req.body);
    res.json({ success: true, data: fuelLog });
  } catch (error) {
    console.error('Error updating fuel log:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteFuelLog = async (req, res) => {
  try {
    const result = await fleetService.deleteFuelLog(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting fuel log:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========== STATS & CATALOGS ==========

exports.getStats = async (req, res) => {
  try {
    const stats = await fleetService.getFleetStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting fleet stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCatalogs = async (req, res) => {
  try {
    const catalogs = fleetService.getCatalogs();
    res.json({ success: true, data: catalogs });
  } catch (error) {
    console.error('Error getting catalogs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await fleetService.getAlerts();
    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
