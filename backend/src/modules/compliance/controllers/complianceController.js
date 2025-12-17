const complianceService = require('../services/complianceService');

class ComplianceController {
  // ========== REGULATORY REPORTS ==========

  async createReport(req, res, next) {
    try {
      const report = await complianceService.createReport(req.body, req.user.id);
      res.status(201).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async getReports(req, res, next) {
    try {
      const result = await complianceService.findAllReports(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getReportById(req, res, next) {
    try {
      const report = await complianceService.findReportById(req.params.id);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async updateReport(req, res, next) {
    try {
      const report = await complianceService.updateReport(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async deleteReport(req, res, next) {
    try {
      await complianceService.deleteReport(req.params.id);
      res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async submitReport(req, res, next) {
    try {
      const report = await complianceService.submitReport(req.params.id, req.user.id);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async markReportSubmitted(req, res, next) {
    try {
      const report = await complianceService.markReportSubmitted(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async updateReportResponse(req, res, next) {
    try {
      const report = await complianceService.updateReportResponse(req.params.id, req.body);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  // ========== ENVIRONMENTAL PERMITS ==========

  async createPermit(req, res, next) {
    try {
      const permit = await complianceService.createPermit(req.body, req.user.id);
      res.status(201).json({ success: true, data: permit });
    } catch (error) {
      next(error);
    }
  }

  async getPermits(req, res, next) {
    try {
      const result = await complianceService.findAllPermits(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getPermitById(req, res, next) {
    try {
      const permit = await complianceService.findPermitById(req.params.id);
      res.json({ success: true, data: permit });
    } catch (error) {
      next(error);
    }
  }

  async updatePermit(req, res, next) {
    try {
      const permit = await complianceService.updatePermit(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: permit });
    } catch (error) {
      next(error);
    }
  }

  async deletePermit(req, res, next) {
    try {
      await complianceService.deletePermit(req.params.id);
      res.json({ success: true, message: 'Permit deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // ========== COMPLIANCE AUDITS ==========

  async createAudit(req, res, next) {
    try {
      const audit = await complianceService.createAudit(req.body, req.user.id);
      res.status(201).json({ success: true, data: audit });
    } catch (error) {
      next(error);
    }
  }

  async getAudits(req, res, next) {
    try {
      const result = await complianceService.findAllAudits(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getAuditById(req, res, next) {
    try {
      const audit = await complianceService.findAuditById(req.params.id);
      res.json({ success: true, data: audit });
    } catch (error) {
      next(error);
    }
  }

  async updateAudit(req, res, next) {
    try {
      const audit = await complianceService.updateAudit(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: audit });
    } catch (error) {
      next(error);
    }
  }

  async deleteAudit(req, res, next) {
    try {
      await complianceService.deleteAudit(req.params.id);
      res.json({ success: true, message: 'Audit deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async startAudit(req, res, next) {
    try {
      const audit = await complianceService.startAudit(req.params.id, req.user.id);
      res.json({ success: true, data: audit });
    } catch (error) {
      next(error);
    }
  }

  async completeAudit(req, res, next) {
    try {
      const audit = await complianceService.completeAudit(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: audit });
    } catch (error) {
      next(error);
    }
  }

  async closeAudit(req, res, next) {
    try {
      const audit = await complianceService.closeAudit(req.params.id, req.user.id);
      res.json({ success: true, data: audit });
    } catch (error) {
      next(error);
    }
  }

  // ========== POLICIES ==========

  async createPolicy(req, res, next) {
    try {
      const policy = await complianceService.createPolicy(req.body, req.user.id);
      res.status(201).json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }

  async getPolicies(req, res, next) {
    try {
      const result = await complianceService.findAllPolicies(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getPolicyById(req, res, next) {
    try {
      const policy = await complianceService.findPolicyById(req.params.id);
      res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }

  async updatePolicy(req, res, next) {
    try {
      const policy = await complianceService.updatePolicy(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }

  async deletePolicy(req, res, next) {
    try {
      await complianceService.deletePolicy(req.params.id);
      res.json({ success: true, message: 'Policy deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async submitPolicyForReview(req, res, next) {
    try {
      const policy = await complianceService.submitPolicyForReview(req.params.id, req.user.id);
      res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }

  async approvePolicy(req, res, next) {
    try {
      const policy = await complianceService.approvePolicy(req.params.id, req.user.id);
      res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }

  async supersededPolicy(req, res, next) {
    try {
      const policy = await complianceService.supersededPolicy(req.params.id, req.body.newPolicyId, req.user.id);
      res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }

  // ========== CERTIFICATIONS ==========

  async createCertification(req, res, next) {
    try {
      const certification = await complianceService.createCertification(req.body, req.user.id);
      res.status(201).json({ success: true, data: certification });
    } catch (error) {
      next(error);
    }
  }

  async getCertifications(req, res, next) {
    try {
      const result = await complianceService.findAllCertifications(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getCertificationById(req, res, next) {
    try {
      const certification = await complianceService.findCertificationById(req.params.id);
      res.json({ success: true, data: certification });
    } catch (error) {
      next(error);
    }
  }

  async updateCertification(req, res, next) {
    try {
      const certification = await complianceService.updateCertification(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: certification });
    } catch (error) {
      next(error);
    }
  }

  async deleteCertification(req, res, next) {
    try {
      await complianceService.deleteCertification(req.params.id);
      res.json({ success: true, message: 'Certification deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // ========== DASHBOARD & ALERTS ==========

  async getDashboard(req, res, next) {
    try {
      const dashboard = await complianceService.getDashboard();
      res.json({ success: true, data: dashboard });
    } catch (error) {
      next(error);
    }
  }

  async getAlerts(req, res, next) {
    try {
      const alerts = await complianceService.getAlerts();
      res.json({ success: true, data: alerts });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComplianceController();
