const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

let models = null;
const getModels = () => {
  if (!models) {
    models = require('../../../database/models');
  }
  return models;
};

class JIBService {
  // ==================== JIB Code Generation ====================
  async generateJIBCode(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
    const { JointInterestBilling } = getModels();
    const monthStr = String(month).padStart(2, '0');
    const lastJIB = await JointInterestBilling.findOne({
      where: { code: { [Op.like]: `JIB-${year}-${monthStr}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastJIB) {
      const parts = lastJIB.code.split('-');
      nextNumber = parseInt(parts[3], 10) + 1;
    }
    return `JIB-${year}-${monthStr}-${String(nextNumber).padStart(4, '0')}`;
  }

  async generateCashCallCode(year = new Date().getFullYear()) {
    const { CashCall } = getModels();
    const lastCC = await CashCall.findOne({
      where: { code: { [Op.like]: `CC-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastCC) {
      const parts = lastCC.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `CC-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  // ==================== JIB CRUD ====================
  async createJIB(data, userId) {
    const { JointInterestBilling, JIBLineItem, JIBPartnerShare, ContractParty } = getModels();
    
    const code = await this.generateJIBCode(data.billing_period_year, data.billing_period_month);
    
    const jib = await JointInterestBilling.create({
      ...data,
      code,
      status: 'DRAFT',
      created_by: userId,
    });

    // Create line items if provided
    if (data.lineItems && Array.isArray(data.lineItems)) {
      for (const item of data.lineItems) {
        await JIBLineItem.create({ jib_id: jib.id, ...item });
      }
    }

    // Auto-create partner shares from contract parties
    if (data.auto_create_shares !== false) {
      const parties = await ContractParty.findAll({
        where: { contract_id: data.contract_id, status: 'ACTIVE', party_type: { [Op.in]: ['PARTNER', 'OPERATOR'] } },
      });
      for (const party of parties) {
        await JIBPartnerShare.create({
          jib_id: jib.id,
          party_id: party.id,
          working_interest: party.working_interest || 0,
          share_amount: 0,
          status: 'PENDING',
        });
      }
    }

    return this.findJIBById(jib.id);
  }

  async findJIBById(id) {
    const { JointInterestBilling, JIBLineItem, JIBPartnerShare, OGContract, ContractParty, AFE, AFEExpense, User } = getModels();
    
    const jib = await JointInterestBilling.findByPk(id, {
      include: [
        { model: OGContract, as: 'contract', attributes: ['id', 'code', 'name', 'type'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'email'] },
        { 
          model: JIBLineItem, 
          as: 'lineItems',
          include: [
            { model: AFE, as: 'afe', attributes: ['id', 'code', 'title'] },
            { model: AFEExpense, as: 'expense', attributes: ['id', 'description', 'amount'] },
          ],
        },
        { 
          model: JIBPartnerShare, 
          as: 'partnerShares',
          include: [{ model: ContractParty, as: 'party', attributes: ['id', 'party_name', 'party_type', 'working_interest', 'contact_email'] }],
        },
      ],
    });
    
    if (!jib) throw new NotFoundError('JIB not found');
    return jib;
  }

  async findAllJIBs(filters = {}) {
    const { JointInterestBilling, OGContract, User } = getModels();
    const { page = 1, limit = 10, status, contractId, year, month, search } = filters;
    
    const where = {};
    if (status) where.status = status;
    if (contractId) where.contract_id = contractId;
    if (year) where.billing_period_year = year;
    if (month) where.billing_period_month = month;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await JointInterestBilling.findAndCountAll({
      where,
      include: [
        { model: OGContract, as: 'contract', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['billing_period_year', 'DESC'], ['billing_period_month', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  async updateJIB(id, data, userId) {
    const { JointInterestBilling } = getModels();
    
    const jib = await JointInterestBilling.findByPk(id);
    if (!jib) throw new NotFoundError('JIB not found');
    if (jib.status !== 'DRAFT') throw new BadRequestError('Only DRAFT JIBs can be edited');
    
    await jib.update(data);
    return this.findJIBById(id);
  }

  async deleteJIB(id) {
    const { JointInterestBilling, JIBLineItem, JIBPartnerShare } = getModels();
    
    const jib = await JointInterestBilling.findByPk(id);
    if (!jib) throw new NotFoundError('JIB not found');
    if (jib.status !== 'DRAFT') throw new BadRequestError('Only DRAFT JIBs can be deleted');
    
    await JIBLineItem.destroy({ where: { jib_id: id } });
    await JIBPartnerShare.destroy({ where: { jib_id: id } });
    await jib.destroy();
    
    return { success: true };
  }

  // ==================== JIB Line Items ====================
  async addLineItem(jibId, data) {
    const { JointInterestBilling, JIBLineItem } = getModels();
    
    const jib = await JointInterestBilling.findByPk(jibId);
    if (!jib) throw new NotFoundError('JIB not found');
    if (jib.status !== 'DRAFT') throw new BadRequestError('Cannot add items to non-DRAFT JIBs');
    
    const item = await JIBLineItem.create({ jib_id: jibId, ...data });
    await this.recalculateJIBTotals(jibId);
    
    return item;
  }

  async updateLineItem(itemId, data) {
    const { JIBLineItem, JointInterestBilling } = getModels();
    
    const item = await JIBLineItem.findByPk(itemId);
    if (!item) throw new NotFoundError('Line item not found');
    
    const jib = await JointInterestBilling.findByPk(item.jib_id);
    if (jib.status !== 'DRAFT') throw new BadRequestError('Cannot modify items in non-DRAFT JIBs');
    
    await item.update(data);
    await this.recalculateJIBTotals(item.jib_id);
    
    return item;
  }

  async deleteLineItem(itemId) {
    const { JIBLineItem, JointInterestBilling } = getModels();
    
    const item = await JIBLineItem.findByPk(itemId);
    if (!item) throw new NotFoundError('Line item not found');
    
    const jib = await JointInterestBilling.findByPk(item.jib_id);
    if (jib.status !== 'DRAFT') throw new BadRequestError('Cannot delete items from non-DRAFT JIBs');
    
    const jibId = item.jib_id;
    await item.destroy();
    await this.recalculateJIBTotals(jibId);
    
    return { success: true };
  }

  // ==================== JIB Partner Shares ====================
  async recalculateJIBTotals(jibId) {
    const { JointInterestBilling, JIBLineItem, JIBPartnerShare } = getModels();
    
    const jib = await JointInterestBilling.findByPk(jibId);
    if (!jib) return;

    // Calculate total costs from billable line items
    const totalCosts = await JIBLineItem.sum('amount', { where: { jib_id: jibId, is_billable: true } }) || 0;
    
    // Get all partner shares
    const shares = await JIBPartnerShare.findAll({ where: { jib_id: jibId } });
    
    let operatorShare = 0;
    let partnersShare = 0;
    
    for (const share of shares) {
      const shareAmount = (parseFloat(share.working_interest) / 100) * totalCosts;
      await share.update({ share_amount: shareAmount });
      
      // Determine if this is operator or partner based on party
      const { ContractParty } = getModels();
      const party = await ContractParty.findByPk(share.party_id);
      if (party && party.is_operator) {
        operatorShare += shareAmount;
      } else {
        partnersShare += shareAmount;
      }
    }
    
    await jib.update({ total_costs: totalCosts, operator_share: operatorShare, partners_share: partnersShare });
  }

  async updatePartnerShare(shareId, data) {
    const { JIBPartnerShare, JointInterestBilling } = getModels();
    
    const share = await JIBPartnerShare.findByPk(shareId);
    if (!share) throw new NotFoundError('Partner share not found');
    
    await share.update(data);
    return share;
  }

  async recordPartnerPayment(shareId, paymentData) {
    const { JIBPartnerShare, JointInterestBilling } = getModels();
    
    const share = await JIBPartnerShare.findByPk(shareId);
    if (!share) throw new NotFoundError('Partner share not found');
    
    await share.update({
      payment_date: paymentData.payment_date,
      payment_reference: paymentData.payment_reference,
      payment_amount: paymentData.payment_amount,
      status: paymentData.payment_amount >= share.share_amount ? 'PAID' : 'PARTIALLY_PAID',
    });

    // Check if all shares are paid
    const jib = await JointInterestBilling.findByPk(share.jib_id);
    const allShares = await JIBPartnerShare.findAll({ where: { jib_id: share.jib_id } });
    const allPaid = allShares.every(s => s.status === 'PAID');
    const somePaid = allShares.some(s => ['PAID', 'PARTIALLY_PAID'].includes(s.status));
    
    if (allPaid) {
      await jib.update({ status: 'PAID' });
    } else if (somePaid) {
      await jib.update({ status: 'PARTIALLY_PAID' });
    }
    
    return share;
  }

  async disputePartnerShare(shareId, reason) {
    const { JIBPartnerShare, JointInterestBilling } = getModels();
    
    const share = await JIBPartnerShare.findByPk(shareId);
    if (!share) throw new NotFoundError('Partner share not found');
    
    await share.update({
      status: 'DISPUTED',
      dispute_reason: reason,
      dispute_date: new Date(),
    });

    const jib = await JointInterestBilling.findByPk(share.jib_id);
    await jib.update({ status: 'DISPUTED' });
    
    return share;
  }

  // ==================== JIB Workflow ====================
  async sendJIB(id, userId) {
    const { JointInterestBilling, JIBPartnerShare } = getModels();
    
    const jib = await JointInterestBilling.findByPk(id);
    if (!jib) throw new NotFoundError('JIB not found');
    if (jib.status !== 'DRAFT') throw new BadRequestError('Only DRAFT JIBs can be sent');
    
    // Update all partner shares to INVOICED
    await JIBPartnerShare.update(
      { status: 'INVOICED', invoice_date: new Date() },
      { where: { jib_id: id, status: 'PENDING' } }
    );
    
    await jib.update({ status: 'SENT', sent_date: new Date() });
    return this.findJIBById(id);
  }

  // ==================== Cash Call CRUD ====================
  async createCashCall(data, userId) {
    const { CashCall, CashCallResponse, ContractParty } = getModels();
    
    const code = await this.generateCashCallCode();
    
    const cashCall = await CashCall.create({
      ...data,
      code,
      status: 'DRAFT',
      funded_amount: 0,
      created_by: userId,
    });

    // Auto-create responses from contract parties
    if (data.auto_create_responses !== false) {
      const parties = await ContractParty.findAll({
        where: { contract_id: data.contract_id, status: 'ACTIVE', party_type: { [Op.in]: ['PARTNER', 'OPERATOR'] } },
      });
      for (const party of parties) {
        const requestedAmount = (parseFloat(party.working_interest || 0) / 100) * parseFloat(data.total_amount);
        await CashCallResponse.create({
          cash_call_id: cashCall.id,
          party_id: party.id,
          working_interest: party.working_interest || 0,
          requested_amount: requestedAmount,
          funded_amount: 0,
          status: 'PENDING',
        });
      }
    }

    return this.findCashCallById(cashCall.id);
  }

  async findCashCallById(id) {
    const { CashCall, CashCallResponse, OGContract, ContractParty, AFE, User } = getModels();
    
    const cashCall = await CashCall.findByPk(id, {
      include: [
        { model: OGContract, as: 'contract', attributes: ['id', 'code', 'name', 'type'] },
        { model: AFE, as: 'afe', attributes: ['id', 'code', 'title'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'email'] },
        { 
          model: CashCallResponse, 
          as: 'responses',
          include: [{ model: ContractParty, as: 'party', attributes: ['id', 'party_name', 'party_type', 'working_interest', 'contact_email'] }],
        },
      ],
    });
    
    if (!cashCall) throw new NotFoundError('Cash Call not found');
    return cashCall;
  }

  async findAllCashCalls(filters = {}) {
    const { CashCall, OGContract, AFE, User } = getModels();
    const { page = 1, limit = 10, status, contractId, purpose, search } = filters;
    
    const where = {};
    if (status) where.status = status;
    if (contractId) where.contract_id = contractId;
    if (purpose) where.purpose = purpose;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await CashCall.findAndCountAll({
      where,
      include: [
        { model: OGContract, as: 'contract', attributes: ['id', 'code', 'name'] },
        { model: AFE, as: 'afe', attributes: ['id', 'code', 'title'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    };
  }

  async updateCashCall(id, data, userId) {
    const { CashCall } = getModels();
    
    const cashCall = await CashCall.findByPk(id);
    if (!cashCall) throw new NotFoundError('Cash Call not found');
    if (cashCall.status !== 'DRAFT') throw new BadRequestError('Only DRAFT Cash Calls can be edited');
    
    await cashCall.update(data);
    return this.findCashCallById(id);
  }

  async deleteCashCall(id) {
    const { CashCall, CashCallResponse } = getModels();
    
    const cashCall = await CashCall.findByPk(id);
    if (!cashCall) throw new NotFoundError('Cash Call not found');
    if (cashCall.status !== 'DRAFT') throw new BadRequestError('Only DRAFT Cash Calls can be deleted');
    
    await CashCallResponse.destroy({ where: { cash_call_id: id } });
    await cashCall.destroy();
    
    return { success: true };
  }

  // ==================== Cash Call Workflow ====================
  async sendCashCall(id, userId) {
    const { CashCall } = getModels();
    
    const cashCall = await CashCall.findByPk(id);
    if (!cashCall) throw new NotFoundError('Cash Call not found');
    if (cashCall.status !== 'DRAFT') throw new BadRequestError('Only DRAFT Cash Calls can be sent');
    
    await cashCall.update({ status: 'SENT', sent_date: new Date() });
    return this.findCashCallById(id);
  }

  async recordCashCallFunding(responseId, fundingData) {
    const { CashCallResponse, CashCall } = getModels();
    
    const response = await CashCallResponse.findByPk(responseId);
    if (!response) throw new NotFoundError('Cash Call Response not found');
    
    const newFundedAmount = parseFloat(response.funded_amount || 0) + parseFloat(fundingData.amount);
    
    await response.update({
      funded_amount: newFundedAmount,
      funded_date: fundingData.funded_date || new Date(),
      payment_reference: fundingData.payment_reference,
      bank_reference: fundingData.bank_reference,
      status: newFundedAmount >= response.requested_amount ? 'FUNDED' : 'PARTIAL',
    });

    // Update cash call totals
    const cashCall = await CashCall.findByPk(response.cash_call_id);
    const allResponses = await CashCallResponse.findAll({ where: { cash_call_id: response.cash_call_id } });
    const totalFunded = allResponses.reduce((sum, r) => sum + parseFloat(r.funded_amount || 0), 0);
    
    const allFunded = allResponses.every(r => r.status === 'FUNDED');
    const someFunded = allResponses.some(r => ['FUNDED', 'PARTIAL'].includes(r.status));
    
    await cashCall.update({
      funded_amount: totalFunded,
      status: allFunded ? 'FUNDED' : someFunded ? 'PARTIALLY_FUNDED' : cashCall.status,
    });
    
    return response;
  }

  async markPartnerDefault(responseId, penaltyAmount = null) {
    const { CashCallResponse } = getModels();
    
    const response = await CashCallResponse.findByPk(responseId);
    if (!response) throw new NotFoundError('Cash Call Response not found');
    
    await response.update({
      status: 'DEFAULTED',
      default_date: new Date(),
      default_penalty: penaltyAmount,
    });
    
    return response;
  }

  // ==================== Dashboard ====================
  async getDashboard() {
    const { JointInterestBilling, CashCall, JIBPartnerShare, CashCallResponse, sequelize } = getModels();
    
    // JIB Stats
    const jibStatusCounts = await JointInterestBilling.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('SUM', sequelize.col('total_costs')), 'total']],
      group: ['status'],
      raw: true,
    });

    const pendingJIBs = await JointInterestBilling.count({ where: { status: { [Op.in]: ['SENT', 'PARTIALLY_PAID'] } } });
    const totalBilled = await JointInterestBilling.sum('total_costs', { where: { status: { [Op.ne]: 'DRAFT' } } }) || 0;
    const totalCollected = await JIBPartnerShare.sum('payment_amount', { where: { status: 'PAID' } }) || 0;

    // Cash Call Stats
    const cashCallStatusCounts = await CashCall.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('SUM', sequelize.col('total_amount')), 'total']],
      group: ['status'],
      raw: true,
    });

    const pendingCashCalls = await CashCall.count({ where: { status: { [Op.in]: ['SENT', 'PARTIALLY_FUNDED'] } } });
    const totalCalled = await CashCall.sum('total_amount', { where: { status: { [Op.ne]: 'DRAFT' } } }) || 0;
    const totalFunded = await CashCall.sum('funded_amount') || 0;

    // Overdue items
    const today = new Date();
    const overdueJIBs = await JointInterestBilling.count({ where: { status: { [Op.in]: ['SENT', 'PARTIALLY_PAID'] }, due_date: { [Op.lt]: today } } });
    const overdueCashCalls = await CashCall.count({ where: { status: { [Op.in]: ['SENT', 'PARTIALLY_FUNDED'] }, due_date: { [Op.lt]: today } } });

    // Recent items
    const recentJIBs = await JointInterestBilling.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'code', 'status', 'total_costs', 'due_date', 'created_at'],
    });

    const recentCashCalls = await CashCall.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'code', 'title', 'status', 'total_amount', 'funded_amount', 'due_date'],
    });

    // Disputed items
    const disputedShares = await JIBPartnerShare.count({ where: { status: 'DISPUTED' } });
    const defaultedResponses = await CashCallResponse.count({ where: { status: 'DEFAULTED' } });

    return {
      jib: {
        statusCounts: jibStatusCounts,
        pending: pendingJIBs,
        totalBilled,
        totalCollected,
        collectionRate: totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(2) : 0,
        overdue: overdueJIBs,
        disputed: disputedShares,
      },
      cashCall: {
        statusCounts: cashCallStatusCounts,
        pending: pendingCashCalls,
        totalCalled,
        totalFunded,
        fundingRate: totalCalled > 0 ? ((totalFunded / totalCalled) * 100).toFixed(2) : 0,
        overdue: overdueCashCalls,
        defaulted: defaultedResponses,
      },
      recentJIBs,
      recentCashCalls,
    };
  }

  // ==================== Reports ====================
  async getPartnerStatement(partyId, filters = {}) {
    const { JIBPartnerShare, CashCallResponse, JointInterestBilling, CashCall, ContractParty } = getModels();
    const { startDate, endDate } = filters;

    const party = await ContractParty.findByPk(partyId);
    if (!party) throw new NotFoundError('Party not found');

    const jibWhere = {};
    const ccWhere = {};
    
    if (startDate) {
      jibWhere.created_at = { [Op.gte]: startDate };
      ccWhere.created_at = { [Op.gte]: startDate };
    }
    if (endDate) {
      jibWhere.created_at = { ...jibWhere.created_at, [Op.lte]: endDate };
      ccWhere.created_at = { ...ccWhere.created_at, [Op.lte]: endDate };
    }

    const jibShares = await JIBPartnerShare.findAll({
      where: { party_id: partyId },
      include: [{ model: JointInterestBilling, as: 'jib', where: jibWhere }],
      order: [[{ model: JointInterestBilling, as: 'jib' }, 'billing_period_year', 'DESC'], [{ model: JointInterestBilling, as: 'jib' }, 'billing_period_month', 'DESC']],
    });

    const cashCallResponses = await CashCallResponse.findAll({
      where: { party_id: partyId },
      include: [{ model: CashCall, as: 'cashCall', where: ccWhere }],
      order: [[{ model: CashCall, as: 'cashCall' }, 'call_date', 'DESC']],
    });

    const totalBilled = jibShares.reduce((sum, s) => sum + parseFloat(s.share_amount || 0), 0);
    const totalPaid = jibShares.reduce((sum, s) => sum + parseFloat(s.payment_amount || 0), 0);
    const totalCalled = cashCallResponses.reduce((sum, r) => sum + parseFloat(r.requested_amount || 0), 0);
    const totalFunded = cashCallResponses.reduce((sum, r) => sum + parseFloat(r.funded_amount || 0), 0);

    return {
      party,
      jibShares,
      cashCallResponses,
      summary: {
        totalBilled,
        totalPaid,
        outstandingJIB: totalBilled - totalPaid,
        totalCalled,
        totalFunded,
        outstandingCashCall: totalCalled - totalFunded,
      },
    };
  }
}

module.exports = new JIBService();
