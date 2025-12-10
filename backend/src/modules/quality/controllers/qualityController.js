const qualityService = require('../services/qualityService');

// ========== PLANES DE CALIDAD ==========

const getPlans = async (req, res) => {
  try {
    const plans = await qualityService.getPlans(req.query);
    res.json(plans);
  } catch (error) {
    console.error('Error getting quality plans:', error);
    res.status(500).json({ message: error.message });
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await qualityService.getPlanById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan de calidad no encontrado' });
    }
    res.json(plan);
  } catch (error) {
    console.error('Error getting quality plan:', error);
    res.status(500).json({ message: error.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const plan = await qualityService.createPlan(req.body, req.user.id);
    res.status(201).json(plan);
  } catch (error) {
    console.error('Error creating quality plan:', error);
    res.status(500).json({ message: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await qualityService.updatePlan(req.params.id, req.body);
    res.json(plan);
  } catch (error) {
    console.error('Error updating quality plan:', error);
    res.status(500).json({ message: error.message });
  }
};

const approvePlan = async (req, res) => {
  try {
    const plan = await qualityService.approvePlan(req.params.id, req.user.id);
    res.json(plan);
  } catch (error) {
    console.error('Error approving quality plan:', error);
    res.status(500).json({ message: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const result = await qualityService.deletePlan(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting quality plan:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== INSPECCIONES ==========

const getInspections = async (req, res) => {
  try {
    const inspections = await qualityService.getInspections(req.query);
    res.json(inspections);
  } catch (error) {
    console.error('Error getting inspections:', error);
    res.status(500).json({ message: error.message });
  }
};

const getInspectionById = async (req, res) => {
  try {
    const inspection = await qualityService.getInspectionById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Inspección no encontrada' });
    }
    res.json(inspection);
  } catch (error) {
    console.error('Error getting inspection:', error);
    res.status(500).json({ message: error.message });
  }
};

const createInspection = async (req, res) => {
  try {
    const inspection = await qualityService.createInspection(req.body, req.user.id);
    res.status(201).json(inspection);
  } catch (error) {
    console.error('Error creating inspection:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateInspection = async (req, res) => {
  try {
    const inspection = await qualityService.updateInspection(req.params.id, req.body);
    res.json(inspection);
  } catch (error) {
    console.error('Error updating inspection:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteInspection = async (req, res) => {
  try {
    const result = await qualityService.deleteInspection(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting inspection:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== NO CONFORMIDADES ==========

const getNonConformances = async (req, res) => {
  try {
    const ncs = await qualityService.getNonConformances(req.query);
    res.json(ncs);
  } catch (error) {
    console.error('Error getting non-conformances:', error);
    res.status(500).json({ message: error.message });
  }
};

const getNonConformanceById = async (req, res) => {
  try {
    const nc = await qualityService.getNonConformanceById(req.params.id);
    if (!nc) {
      return res.status(404).json({ message: 'No conformidad no encontrada' });
    }
    res.json(nc);
  } catch (error) {
    console.error('Error getting non-conformance:', error);
    res.status(500).json({ message: error.message });
  }
};

const createNonConformance = async (req, res) => {
  try {
    const nc = await qualityService.createNonConformance(req.body, req.user.id);
    res.status(201).json(nc);
  } catch (error) {
    console.error('Error creating non-conformance:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateNonConformance = async (req, res) => {
  try {
    const nc = await qualityService.updateNonConformance(req.params.id, req.body);
    res.json(nc);
  } catch (error) {
    console.error('Error updating non-conformance:', error);
    res.status(500).json({ message: error.message });
  }
};

const closeNonConformance = async (req, res) => {
  try {
    const nc = await qualityService.closeNonConformance(req.params.id, req.user.id, req.body.verificationNotes);
    res.json(nc);
  } catch (error) {
    console.error('Error closing non-conformance:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteNonConformance = async (req, res) => {
  try {
    const result = await qualityService.deleteNonConformance(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting non-conformance:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== ACCIONES CORRECTIVAS ==========

const getCorrectiveActions = async (req, res) => {
  try {
    const actions = await qualityService.getCorrectiveActions(req.query);
    res.json(actions);
  } catch (error) {
    console.error('Error getting corrective actions:', error);
    res.status(500).json({ message: error.message });
  }
};

const createCorrectiveAction = async (req, res) => {
  try {
    const action = await qualityService.createCorrectiveAction(req.body, req.user.id);
    res.status(201).json(action);
  } catch (error) {
    console.error('Error creating corrective action:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateCorrectiveAction = async (req, res) => {
  try {
    const action = await qualityService.updateCorrectiveAction(req.params.id, req.body);
    res.json(action);
  } catch (error) {
    console.error('Error updating corrective action:', error);
    res.status(500).json({ message: error.message });
  }
};

const completeCorrectiveAction = async (req, res) => {
  try {
    const action = await qualityService.completeCorrectiveAction(req.params.id, req.body.results);
    res.json(action);
  } catch (error) {
    console.error('Error completing corrective action:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyCorrectiveAction = async (req, res) => {
  try {
    const action = await qualityService.verifyCorrectiveAction(
      req.params.id,
      req.user.id,
      req.body.effectivenessNotes,
      req.body.isEffective
    );
    res.json(action);
  } catch (error) {
    console.error('Error verifying corrective action:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCorrectiveAction = async (req, res) => {
  try {
    const result = await qualityService.deleteCorrectiveAction(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting corrective action:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== CERTIFICADOS ==========

const getCertificates = async (req, res) => {
  try {
    const certificates = await qualityService.getCertificates(req.query);
    res.json(certificates);
  } catch (error) {
    console.error('Error getting certificates:', error);
    res.status(500).json({ message: error.message });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const certificate = await qualityService.getCertificateById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificado no encontrado' });
    }
    res.json(certificate);
  } catch (error) {
    console.error('Error getting certificate:', error);
    res.status(500).json({ message: error.message });
  }
};

const createCertificate = async (req, res) => {
  try {
    const certificate = await qualityService.createCertificate(req.body, req.user.id);
    res.status(201).json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const certificate = await qualityService.updateCertificate(req.params.id, req.body);
    res.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ message: error.message });
  }
};

const issueCertificate = async (req, res) => {
  try {
    const certificate = await qualityService.issueCertificate(req.params.id);
    res.json(certificate);
  } catch (error) {
    console.error('Error issuing certificate:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const result = await qualityService.deleteCertificate(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== ESTADÍSTICAS ==========

const getStats = async (req, res) => {
  try {
    const stats = await qualityService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting quality stats:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Planes
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  approvePlan,
  deletePlan,
  // Inspecciones
  getInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  deleteInspection,
  // No Conformidades
  getNonConformances,
  getNonConformanceById,
  createNonConformance,
  updateNonConformance,
  closeNonConformance,
  deleteNonConformance,
  // Acciones Correctivas
  getCorrectiveActions,
  createCorrectiveAction,
  updateCorrectiveAction,
  completeCorrectiveAction,
  verifyCorrectiveAction,
  deleteCorrectiveAction,
  // Certificados
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  issueCertificate,
  deleteCertificate,
  // Estadísticas
  getStats,
};
