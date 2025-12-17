const afeService = require('../services/afeService');

class AFEController {
  async create(req, res, next) {
    try {
      const afe = await afeService.create(req.body, req.user.id);
      res.status(201).json(afe);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const result = await afeService.findAll(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const afe = await afeService.findById(req.params.id);
      res.json(afe);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const afe = await afeService.update(req.params.id, req.body, req.user.id);
      res.json(afe);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await afeService.delete(req.params.id);
      res.json({ message: 'AFE deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async submit(req, res, next) {
    try {
      const afe = await afeService.submit(req.params.id, req.user.id);
      res.json(afe);
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const afe = await afeService.approve(req.params.id, req.user.id, req.body.comments);
      res.json(afe);
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const afe = await afeService.reject(req.params.id, req.user.id, req.body.comments);
      res.json(afe);
    } catch (error) {
      next(error);
    }
  }

  async startExecution(req, res, next) {
    try {
      const afe = await afeService.startExecution(req.params.id, req.user.id);
      res.json(afe);
    } catch (error) {
      next(error);
    }
  }

  async close(req, res, next) {
    try {
      const afe = await afeService.close(req.params.id, req.user.id, req.body.final_cost);
      res.json(afe);
    } catch (error) {
      next(error);
    }
  }

  async addCategory(req, res, next) {
    try {
      const category = await afeService.addCategory(req.params.id, req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await afeService.updateCategory(req.params.categoryId, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      await afeService.deleteCategory(req.params.categoryId);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async addExpense(req, res, next) {
    try {
      const expense = await afeService.addExpense(req.params.id, req.body, req.user.id);
      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  }

  async getExpenses(req, res, next) {
    try {
      const result = await afeService.getExpenses(req.params.id, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async approveExpense(req, res, next) {
    try {
      const expense = await afeService.approveExpense(req.params.expenseId, req.user.id);
      res.json(expense);
    } catch (error) {
      next(error);
    }
  }

  async requestVariance(req, res, next) {
    try {
      const variance = await afeService.requestVariance(req.params.id, req.body, req.user.id);
      res.status(201).json(variance);
    } catch (error) {
      next(error);
    }
  }

  async approveVariance(req, res, next) {
    try {
      const variance = await afeService.approveVariance(req.params.varianceId, req.user.id);
      res.json(variance);
    } catch (error) {
      next(error);
    }
  }

  async rejectVariance(req, res, next) {
    try {
      const variance = await afeService.rejectVariance(req.params.varianceId, req.user.id, req.body.comments);
      res.json(variance);
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req, res, next) {
    try {
      const dashboard = await afeService.getDashboard();
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }

  async getPendingApprovals(req, res, next) {
    try {
      const approvals = await afeService.getPendingApprovals(req.user.id);
      res.json(approvals);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AFEController();
