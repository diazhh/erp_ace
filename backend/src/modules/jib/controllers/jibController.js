const jibService = require('../services/jibService');

class JIBController {
  // ==================== JIB ====================
  async createJIB(req, res, next) {
    try {
      const jib = await jibService.createJIB(req.body, req.user.id);
      res.status(201).json(jib);
    } catch (error) {
      next(error);
    }
  }

  async findAllJIBs(req, res, next) {
    try {
      const result = await jibService.findAllJIBs(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findJIBById(req, res, next) {
    try {
      const jib = await jibService.findJIBById(req.params.id);
      res.json(jib);
    } catch (error) {
      next(error);
    }
  }

  async updateJIB(req, res, next) {
    try {
      const jib = await jibService.updateJIB(req.params.id, req.body, req.user.id);
      res.json(jib);
    } catch (error) {
      next(error);
    }
  }

  async deleteJIB(req, res, next) {
    try {
      await jibService.deleteJIB(req.params.id);
      res.json({ message: 'JIB deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async sendJIB(req, res, next) {
    try {
      const jib = await jibService.sendJIB(req.params.id, req.user.id);
      res.json(jib);
    } catch (error) {
      next(error);
    }
  }

  // ==================== JIB Line Items ====================
  async addLineItem(req, res, next) {
    try {
      const item = await jibService.addLineItem(req.params.id, req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  async updateLineItem(req, res, next) {
    try {
      const item = await jibService.updateLineItem(req.params.itemId, req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async deleteLineItem(req, res, next) {
    try {
      await jibService.deleteLineItem(req.params.itemId);
      res.json({ message: 'Line item deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // ==================== JIB Partner Shares ====================
  async updatePartnerShare(req, res, next) {
    try {
      const share = await jibService.updatePartnerShare(req.params.shareId, req.body);
      res.json(share);
    } catch (error) {
      next(error);
    }
  }

  async recordPartnerPayment(req, res, next) {
    try {
      const share = await jibService.recordPartnerPayment(req.params.shareId, req.body);
      res.json(share);
    } catch (error) {
      next(error);
    }
  }

  async disputePartnerShare(req, res, next) {
    try {
      const share = await jibService.disputePartnerShare(req.params.shareId, req.body.reason);
      res.json(share);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Cash Call ====================
  async createCashCall(req, res, next) {
    try {
      const cashCall = await jibService.createCashCall(req.body, req.user.id);
      res.status(201).json(cashCall);
    } catch (error) {
      next(error);
    }
  }

  async findAllCashCalls(req, res, next) {
    try {
      const result = await jibService.findAllCashCalls(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findCashCallById(req, res, next) {
    try {
      const cashCall = await jibService.findCashCallById(req.params.id);
      res.json(cashCall);
    } catch (error) {
      next(error);
    }
  }

  async updateCashCall(req, res, next) {
    try {
      const cashCall = await jibService.updateCashCall(req.params.id, req.body, req.user.id);
      res.json(cashCall);
    } catch (error) {
      next(error);
    }
  }

  async deleteCashCall(req, res, next) {
    try {
      await jibService.deleteCashCall(req.params.id);
      res.json({ message: 'Cash Call deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async sendCashCall(req, res, next) {
    try {
      const cashCall = await jibService.sendCashCall(req.params.id, req.user.id);
      res.json(cashCall);
    } catch (error) {
      next(error);
    }
  }

  async recordCashCallFunding(req, res, next) {
    try {
      const response = await jibService.recordCashCallFunding(req.params.responseId, req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async markPartnerDefault(req, res, next) {
    try {
      const response = await jibService.markPartnerDefault(req.params.responseId, req.body.penalty_amount);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Dashboard & Reports ====================
  async getDashboard(req, res, next) {
    try {
      const dashboard = await jibService.getDashboard();
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }

  async getPartnerStatement(req, res, next) {
    try {
      const statement = await jibService.getPartnerStatement(req.params.partyId, req.query);
      res.json(statement);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JIBController();
