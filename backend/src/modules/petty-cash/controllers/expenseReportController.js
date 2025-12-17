const expenseReportService = require('../services/expenseReportService');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

class ExpenseReportController {
  /**
   * Listar reportes de gastos
   */
  async list(req, res, next) {
    try {
      const { page, limit, status, employeeId, projectId, startDate, endDate, pettyCashId } = req.query;
      
      const result = await expenseReportService.list({
        page,
        limit,
        status,
        employeeId,
        projectId,
        startDate,
        endDate,
        pettyCashId,
      });
      
      return res.json({
        success: true,
        data: result.reports,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener reporte por ID
   */
  async getById(req, res, next) {
    try {
      const report = await expenseReportService.getById(req.params.id);
      
      if (!report) {
        throw new NotFoundError('Reporte no encontrado');
      }
      
      return res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear reporte de gastos
   */
  async create(req, res, next) {
    try {
      const report = await expenseReportService.create(req.body, req.user.id);
      
      return res.status(201).json({
        success: true,
        message: 'Reporte creado exitosamente',
        data: report,
      });
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('ya tiene')) {
        return next(new BadRequestError(error.message));
      }
      next(error);
    }
  }

  /**
   * Actualizar reporte
   */
  async update(req, res, next) {
    try {
      const report = await expenseReportService.update(req.params.id, req.body, req.user.id);
      
      return res.json({
        success: true,
        message: 'Reporte actualizado',
        data: report,
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return next(new NotFoundError(error.message));
      }
      if (error.message.includes('Solo se pueden')) {
        return next(new BadRequestError(error.message));
      }
      next(error);
    }
  }

  /**
   * Enviar reporte para aprobación
   */
  async submit(req, res, next) {
    try {
      const report = await expenseReportService.submit(req.params.id, req.user.id);
      
      return res.json({
        success: true,
        message: 'Reporte enviado para aprobación',
        data: report,
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return next(new NotFoundError(error.message));
      }
      if (error.message.includes('Solo se pueden')) {
        return next(new BadRequestError(error.message));
      }
      next(error);
    }
  }

  /**
   * Aprobar reporte
   */
  async approve(req, res, next) {
    try {
      const report = await expenseReportService.approve(req.params.id, req.user.id);
      
      return res.json({
        success: true,
        message: 'Reporte aprobado',
        data: report,
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return next(new NotFoundError(error.message));
      }
      if (error.message.includes('Solo se pueden')) {
        return next(new BadRequestError(error.message));
      }
      next(error);
    }
  }

  /**
   * Rechazar reporte
   */
  async reject(req, res, next) {
    try {
      const { reason } = req.body;
      
      if (!reason) {
        throw new BadRequestError('Debe proporcionar una razón de rechazo');
      }
      
      const report = await expenseReportService.reject(req.params.id, reason, req.user.id);
      
      return res.json({
        success: true,
        message: 'Reporte rechazado',
        data: report,
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return next(new NotFoundError(error.message));
      }
      if (error.message.includes('Solo se pueden')) {
        return next(new BadRequestError(error.message));
      }
      next(error);
    }
  }

  /**
   * Agregar item al reporte
   */
  async addItem(req, res, next) {
    try {
      const item = await expenseReportService.addItem(req.params.id, req.body, req.user.id);
      
      return res.status(201).json({
        success: true,
        message: 'Item agregado',
        data: item,
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return next(new NotFoundError(error.message));
      }
      if (error.message.includes('Solo se pueden')) {
        return next(new BadRequestError(error.message));
      }
      next(error);
    }
  }

  /**
   * Eliminar item del reporte
   */
  async removeItem(req, res, next) {
    try {
      await expenseReportService.removeItem(req.params.id, req.params.itemId, req.user.id);
      
      return res.json({
        success: true,
        message: 'Item eliminado',
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return next(new NotFoundError(error.message));
      }
      if (error.message.includes('Solo se pueden')) {
        return next(new BadRequestError(error.message));
      }
      next(error);
    }
  }

  /**
   * Obtener estadísticas
   */
  async getStats(req, res, next) {
    try {
      const { startDate, endDate, employeeId, projectId } = req.query;
      
      const stats = await expenseReportService.getStats({
        startDate,
        endDate,
        employeeId,
        projectId,
      });
      
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener catálogos para el formulario
   */
  async getCatalogs(req, res, next) {
    try {
      const itemTypes = [
        { value: 'INVENTORY', label: 'Inventario' },
        { value: 'ASSET', label: 'Activo Fijo' },
        { value: 'FUEL', label: 'Combustible' },
        { value: 'SERVICE', label: 'Servicio' },
        { value: 'OTHER', label: 'Otro' },
      ];
      
      const statuses = [
        { value: 'DRAFT', label: 'Borrador' },
        { value: 'SUBMITTED', label: 'Enviado' },
        { value: 'APPROVED', label: 'Aprobado' },
        { value: 'REJECTED', label: 'Rechazado' },
        { value: 'CANCELLED', label: 'Cancelado' },
      ];
      
      const units = [
        { value: 'UNIT', label: 'Unidad' },
        { value: 'LITER', label: 'Litro' },
        { value: 'GALLON', label: 'Galón' },
        { value: 'KG', label: 'Kilogramo' },
        { value: 'METER', label: 'Metro' },
        { value: 'BOX', label: 'Caja' },
        { value: 'PACK', label: 'Paquete' },
        { value: 'SERVICE', label: 'Servicio' },
      ];
      
      return res.json({
        success: true,
        data: {
          itemTypes,
          statuses,
          units,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExpenseReportController();
