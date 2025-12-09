const approvalService = require('../services/approvalService');

/**
 * Obtener solicitudes pendientes de aprobación
 */
exports.getPendingApprovals = async (req, res) => {
  try {
    const result = await approvalService.getPendingApprovals(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting pending approvals:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Obtener solicitudes aprobadas pendientes de pago
 */
exports.getPendingPayments = async (req, res) => {
  try {
    const result = await approvalService.getPendingPayments(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting pending payments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Obtener estadísticas de aprobaciones
 */
exports.getApprovalStats = async (req, res) => {
  try {
    const stats = await approvalService.getApprovalStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting approval stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
