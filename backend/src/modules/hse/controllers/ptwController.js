const ptwService = require('../services/ptwService');

class PTWController {
  // ==================== Work Permits ====================
  async createPermit(req, res, next) {
    try {
      const permit = await ptwService.createPermit(req.body, req.user.id);
      res.status(201).json(permit);
    } catch (error) {
      next(error);
    }
  }

  async findAllPermits(req, res, next) {
    try {
      const result = await ptwService.findAllPermits(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findPermitById(req, res, next) {
    try {
      const permit = await ptwService.findPermitById(req.params.id);
      res.json(permit);
    } catch (error) {
      next(error);
    }
  }

  async updatePermit(req, res, next) {
    try {
      const permit = await ptwService.updatePermit(req.params.id, req.body, req.user.id);
      res.json(permit);
    } catch (error) {
      next(error);
    }
  }

  async deletePermit(req, res, next) {
    try {
      await ptwService.deletePermit(req.params.id);
      res.json({ message: 'Work Permit deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // ==================== Permit Workflow ====================
  async submitPermit(req, res, next) {
    try {
      const permit = await ptwService.submitPermit(req.params.id, req.user.id);
      res.json(permit);
    } catch (error) {
      next(error);
    }
  }

  async approvePermit(req, res, next) {
    try {
      const permit = await ptwService.approvePermit(req.params.id, req.user.id);
      res.json(permit);
    } catch (error) {
      next(error);
    }
  }

  async rejectPermit(req, res, next) {
    try {
      const permit = await ptwService.rejectPermit(req.params.id, req.body.reason, req.user.id);
      res.json(permit);
    } catch (error) {
      next(error);
    }
  }

  async activatePermit(req, res, next) {
    try {
      const permit = await ptwService.activatePermit(req.params.id, req.user.id);
      res.json(permit);
    } catch (error) {
      next(error);
    }
  }

  async closePermit(req, res, next) {
    try {
      const permit = await ptwService.closePermit(req.params.id, req.body.notes, req.user.id);
      res.json(permit);
    } catch (error) {
      next(error);
    }
  }

  async cancelPermit(req, res, next) {
    try {
      const permit = await ptwService.cancelPermit(req.params.id, req.body.reason, req.user.id);
      res.json(permit);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Checklists ====================
  async updateChecklist(req, res, next) {
    try {
      const checklist = await ptwService.updateChecklist(req.params.checklistId, req.body.items, req.user.id);
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Extensions ====================
  async requestExtension(req, res, next) {
    try {
      const extension = await ptwService.requestExtension(req.params.id, req.body, req.user.id);
      res.status(201).json(extension);
    } catch (error) {
      next(error);
    }
  }

  async approveExtension(req, res, next) {
    try {
      const extension = await ptwService.approveExtension(req.params.extensionId, req.user.id);
      res.json(extension);
    } catch (error) {
      next(error);
    }
  }

  async rejectExtension(req, res, next) {
    try {
      const extension = await ptwService.rejectExtension(req.params.extensionId, req.body.reason, req.user.id);
      res.json(extension);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Stop Work Authority ====================
  async createStopWork(req, res, next) {
    try {
      const swa = await ptwService.createStopWork(req.body, req.user.id);
      res.status(201).json(swa);
    } catch (error) {
      next(error);
    }
  }

  async findAllStopWork(req, res, next) {
    try {
      const result = await ptwService.findAllStopWork(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findStopWorkById(req, res, next) {
    try {
      const swa = await ptwService.findStopWorkById(req.params.id);
      res.json(swa);
    } catch (error) {
      next(error);
    }
  }

  async resolveStopWork(req, res, next) {
    try {
      const swa = await ptwService.resolveStopWork(req.params.id, req.body, req.user.id);
      res.json(swa);
    } catch (error) {
      next(error);
    }
  }

  async resumeWork(req, res, next) {
    try {
      const swa = await ptwService.resumeWork(req.params.id, req.user.id);
      res.json(swa);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Dashboard ====================
  async getDashboard(req, res, next) {
    try {
      const dashboard = await ptwService.getDashboard();
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }

  async getActivePermitsBoard(req, res, next) {
    try {
      const board = await ptwService.getActivePermitsBoard();
      res.json(board);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PTWController();
