const productionService = require('../services/productionService');
const { BadRequestError } = require('../../../shared/errors/AppError');

class ProductionController {
  // ==================== FIELDS ====================

  async getFields(req, res, next) {
    try {
      const result = await productionService.getFields(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFieldById(req, res, next) {
    try {
      const field = await productionService.getFieldById(req.params.id);
      res.json(field);
    } catch (error) {
      next(error);
    }
  }

  async getFieldDetail(req, res, next) {
    try {
      const field = await productionService.getFieldDetail(req.params.id);
      res.json(field);
    } catch (error) {
      next(error);
    }
  }

  async getFieldProduction(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const production = await productionService.getFieldProductionByDateRange(
        req.params.id,
        startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate || new Date().toISOString().split('T')[0]
      );
      res.json(production);
    } catch (error) {
      next(error);
    }
  }

  async createField(req, res, next) {
    try {
      const field = await productionService.createField(req.body, req.user.id);
      res.status(201).json(field);
    } catch (error) {
      next(error);
    }
  }

  async updateField(req, res, next) {
    try {
      const field = await productionService.updateField(req.params.id, req.body, req.user.id);
      res.json(field);
    } catch (error) {
      next(error);
    }
  }

  async deleteField(req, res, next) {
    try {
      const result = await productionService.deleteField(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== WELLS ====================

  async getWells(req, res, next) {
    try {
      const result = await productionService.getWells(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getWellById(req, res, next) {
    try {
      const well = await productionService.getWellById(req.params.id);
      res.json(well);
    } catch (error) {
      next(error);
    }
  }

  async getWellDetail(req, res, next) {
    try {
      const well = await productionService.getWellDetail(req.params.id);
      res.json(well);
    } catch (error) {
      next(error);
    }
  }

  async getWellProductionByDateRange(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const production = await productionService.getWellProductionByDateRange(
        req.params.id,
        startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate || new Date().toISOString().split('T')[0]
      );
      res.json(production);
    } catch (error) {
      next(error);
    }
  }

  async createWell(req, res, next) {
    try {
      const well = await productionService.createWell(req.body, req.user.id);
      res.status(201).json(well);
    } catch (error) {
      next(error);
    }
  }

  async updateWell(req, res, next) {
    try {
      const well = await productionService.updateWell(req.params.id, req.body, req.user.id);
      res.json(well);
    } catch (error) {
      next(error);
    }
  }

  async deleteWell(req, res, next) {
    try {
      const result = await productionService.deleteWell(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getWellProduction(req, res, next) {
    try {
      const result = await productionService.getWellProduction(req.params.id, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== DAILY PRODUCTION ====================

  async getDailyProduction(req, res, next) {
    try {
      const result = await productionService.getDailyProduction(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProductionById(req, res, next) {
    try {
      const production = await productionService.getProductionById(req.params.id);
      res.json(production);
    } catch (error) {
      next(error);
    }
  }

  async createProduction(req, res, next) {
    try {
      const production = await productionService.createProduction(req.body, req.user.id);
      res.status(201).json(production);
    } catch (error) {
      next(error);
    }
  }

  async updateProduction(req, res, next) {
    try {
      const production = await productionService.updateProduction(req.params.id, req.body, req.user.id);
      res.json(production);
    } catch (error) {
      next(error);
    }
  }

  async verifyProduction(req, res, next) {
    try {
      const production = await productionService.verifyProduction(req.params.id, req.user.id);
      res.json(production);
    } catch (error) {
      next(error);
    }
  }

  async approveProduction(req, res, next) {
    try {
      const production = await productionService.approveProduction(req.params.id, req.user.id);
      res.json(production);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduction(req, res, next) {
    try {
      const result = await productionService.deleteProduction(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== ALLOCATIONS ====================

  async getAllocations(req, res, next) {
    try {
      const result = await productionService.getAllocations(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllocationById(req, res, next) {
    try {
      const allocation = await productionService.getAllocationById(req.params.id);
      res.json(allocation);
    } catch (error) {
      next(error);
    }
  }

  async generateAllocation(req, res, next) {
    try {
      const { fieldId, month, year } = req.body;
      if (!fieldId || !month || !year) {
        throw new BadRequestError('Se requiere fieldId, month y year');
      }
      const allocation = await productionService.generateAllocation(fieldId, month, year, req.user.id);
      res.status(201).json(allocation);
    } catch (error) {
      next(error);
    }
  }

  async approveAllocation(req, res, next) {
    try {
      const allocation = await productionService.approveAllocation(req.params.id, req.user.id);
      res.json(allocation);
    } catch (error) {
      next(error);
    }
  }

  // ==================== MORNING REPORTS ====================

  async getMorningReports(req, res, next) {
    try {
      const result = await productionService.getMorningReports(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMorningReportById(req, res, next) {
    try {
      const report = await productionService.getMorningReportById(req.params.id);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  async createMorningReport(req, res, next) {
    try {
      const report = await productionService.createMorningReport(req.body, req.user.id);
      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  }

  async updateMorningReport(req, res, next) {
    try {
      const report = await productionService.updateMorningReport(req.params.id, req.body, req.user.id);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  async submitMorningReport(req, res, next) {
    try {
      const report = await productionService.submitMorningReport(req.params.id, req.user.id);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  async approveMorningReport(req, res, next) {
    try {
      const report = await productionService.approveMorningReport(req.params.id, req.user.id);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  async deleteMorningReport(req, res, next) {
    try {
      const result = await productionService.deleteMorningReport(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== DASHBOARD & STATISTICS ====================

  async getDashboard(req, res, next) {
    try {
      const { fieldId } = req.query;
      const dashboard = await productionService.getDashboard(fieldId);
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }

  async getProductionTrend(req, res, next) {
    try {
      const { fieldId, days = 30 } = req.query;
      const trend = await productionService.getProductionTrend(fieldId, parseInt(days));
      res.json(trend);
    } catch (error) {
      next(error);
    }
  }

  // ==================== WELL LOGS (BITÁCORAS) ====================

  async getWellLogs(req, res, next) {
    try {
      const result = await productionService.getWellLogs(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getWellLogById(req, res, next) {
    try {
      const log = await productionService.getWellLogById(req.params.id);
      res.json(log);
    } catch (error) {
      next(error);
    }
  }

  async createWellLog(req, res, next) {
    try {
      const log = await productionService.createWellLog(req.body, req.user.id);
      res.status(201).json(log);
    } catch (error) {
      next(error);
    }
  }

  async updateWellLog(req, res, next) {
    try {
      const log = await productionService.updateWellLog(req.params.id, req.body, req.user.id);
      res.json(log);
    } catch (error) {
      next(error);
    }
  }

  async deleteWellLog(req, res, next) {
    try {
      const result = await productionService.deleteWellLog(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductionController();
