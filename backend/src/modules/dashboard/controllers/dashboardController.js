const DashboardService = require('../services/dashboardService');
const logger = require('../../../shared/utils/logger');

class DashboardController {
  /**
   * Obtener estadísticas principales del dashboard
   */
  async getMainStats(req, res, next) {
    try {
      const models = require('../../../database/models');
      const dashboardService = new DashboardService(models);
      
      const stats = await dashboardService.getMainDashboardStats();
      
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Error al obtener estadísticas del dashboard:', error);
      next(error);
    }
  }

  /**
   * Obtener flujo de caja para gráficos
   */
  async getCashFlow(req, res, next) {
    try {
      const models = require('../../../database/models');
      const dashboardService = new DashboardService(models);
      
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const cashFlow = await dashboardService.getCashFlowChart(year);
      
      return res.json({
        success: true,
        data: cashFlow,
      });
    } catch (error) {
      logger.error('Error al obtener flujo de caja:', error);
      next(error);
    }
  }

  /**
   * Obtener proyectos por estado para gráficos
   */
  async getProjectsByStatus(req, res, next) {
    try {
      const models = require('../../../database/models');
      const dashboardService = new DashboardService(models);
      
      const data = await dashboardService.getProjectsByStatusChart();
      
      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error('Error al obtener proyectos por estado:', error);
      next(error);
    }
  }

  /**
   * Obtener empleados por departamento para gráficos
   */
  async getEmployeesByDepartment(req, res, next) {
    try {
      const models = require('../../../database/models');
      const dashboardService = new DashboardService(models);
      
      const data = await dashboardService.getEmployeesByDepartmentChart();
      
      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error('Error al obtener empleados por departamento:', error);
      next(error);
    }
  }

  /**
   * Obtener solo las alertas pendientes
   */
  async getAlerts(req, res, next) {
    try {
      const models = require('../../../database/models');
      const dashboardService = new DashboardService(models);
      
      const alerts = await dashboardService.getPendingAlerts();
      
      return res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      logger.error('Error al obtener alertas:', error);
      next(error);
    }
  }

  /**
   * Obtener actividad reciente
   */
  async getRecentActivity(req, res, next) {
    try {
      const models = require('../../../database/models');
      const dashboardService = new DashboardService(models);
      
      const activity = await dashboardService.getRecentActivity();
      
      return res.json({
        success: true,
        data: activity,
      });
    } catch (error) {
      logger.error('Error al obtener actividad reciente:', error);
      next(error);
    }
  }
}

module.exports = new DashboardController();
