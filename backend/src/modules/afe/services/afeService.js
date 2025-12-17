const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

let models = null;
const getModels = () => {
  if (!models) {
    models = require('../../../database/models');
  }
  return models;
};

class AFEService {
  async generateCode(year = new Date().getFullYear()) {
    const { AFE } = getModels();
    const lastAFE = await AFE.findOne({
      where: { code: { [Op.like]: `AFE-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastAFE) {
      const parts = lastAFE.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `AFE-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  getApprovalLevel(amount) {
    if (amount < 10000) return 1;
    if (amount < 100000) return 2;
    if (amount < 500000) return 3;
    return 4;
  }

  async create(data, userId) {
    const { AFE, AFECategory } = getModels();
    const code = await this.generateCode();
    const approvalLevel = this.getApprovalLevel(data.estimated_cost || 0);
    const afe = await AFE.create({
      ...data,
      code,
      approval_level: approvalLevel,
      current_approval_level: 0,
      status: 'DRAFT',
      created_by: userId,
    });
    if (data.categories && Array.isArray(data.categories)) {
      for (const cat of data.categories) {
        await AFECategory.create({ afe_id: afe.id, ...cat });
      }
    }
    return this.findById(afe.id);
  }

  async findById(id) {
    const { AFE, AFECategory, AFEApproval, AFEExpense, AFEVariance, User, Project, Field, Well, Contractor } = getModels();
    const afe = await AFE.findByPk(id, {
      include: [
        { model: AFECategory, as: 'categories' },
        { model: AFEApproval, as: 'approvals', include: [{ model: User, as: 'approver', attributes: ['id', 'username', 'email'] }] },
        { model: AFEExpense, as: 'expenses', include: [{ model: AFECategory, as: 'category' }, { model: Contractor, as: 'contractor', attributes: ['id', 'companyName', 'code'] }] },
        { model: AFEVariance, as: 'variances', include: [{ model: User, as: 'requester', attributes: ['id', 'username'] }, { model: User, as: 'approverUser', attributes: ['id', 'username'] }] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approverFinal', attributes: ['id', 'username', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Well, as: 'well', attributes: ['id', 'name', 'code'] },
      ],
    });
    if (!afe) throw new NotFoundError('AFE not found');
    return afe;
  }

  async findAll(filters = {}) {
    const { AFE, User, Project, Field, Well } = getModels();
    const { page = 1, limit = 10, status, type, projectId, fieldId, wellId, search, createdBy } = filters;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (projectId) where.project_id = projectId;
    if (fieldId) where.field_id = fieldId;
    if (wellId) where.well_id = wellId;
    if (createdBy) where.created_by = createdBy;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const { count, rows } = await AFE.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: Project, as: 'project', attributes: ['id', 'name', 'code'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Well, as: 'well', attributes: ['id', 'name', 'code'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return { data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) } };
  }

  async update(id, data, userId) {
    const { AFE } = getModels();
    const afe = await AFE.findByPk(id);
    if (!afe) throw new NotFoundError('AFE not found');
    if (afe.status !== 'DRAFT') throw new BadRequestError('Only DRAFT AFEs can be edited');
    if (data.estimated_cost && data.estimated_cost !== afe.estimated_cost) {
      data.approval_level = this.getApprovalLevel(data.estimated_cost);
    }
    await afe.update(data);
    return this.findById(id);
  }

  async delete(id) {
    const { AFE } = getModels();
    const afe = await AFE.findByPk(id);
    if (!afe) throw new NotFoundError('AFE not found');
    if (afe.status !== 'DRAFT') throw new BadRequestError('Only DRAFT AFEs can be deleted');
    await afe.destroy();
    return { success: true };
  }

  async submit(id, userId) {
    const { AFE, AFEApproval, User } = getModels();
    const afe = await AFE.findByPk(id);
    if (!afe) throw new NotFoundError('AFE not found');
    if (afe.status !== 'DRAFT') throw new BadRequestError('Only DRAFT AFEs can be submitted');
    const approvers = await User.findAll({ where: { is_active: true }, limit: afe.approval_level });
    for (let i = 0; i < afe.approval_level; i++) {
      await AFEApproval.create({ afe_id: id, approver_id: approvers[i % approvers.length]?.id || userId, approval_level: i + 1, status: 'PENDING' });
    }
    await afe.update({ status: 'PENDING', submitted_at: new Date(), current_approval_level: 1 });
    return this.findById(id);
  }

  async approve(id, userId, comments = '') {
    const { AFE, AFEApproval } = getModels();
    const afe = await this.findById(id);
    if (afe.status !== 'PENDING') throw new BadRequestError('Only PENDING AFEs can be approved');
    const pendingApproval = await AFEApproval.findOne({ where: { afe_id: id, approval_level: afe.current_approval_level, status: 'PENDING' } });
    if (pendingApproval) {
      await pendingApproval.update({ status: 'APPROVED', approver_id: userId, comments, approved_at: new Date() });
    }
    if (afe.current_approval_level >= afe.approval_level) {
      await AFE.update({ status: 'APPROVED', approved_at: new Date(), approved_by: userId }, { where: { id } });
    } else {
      await AFE.update({ current_approval_level: afe.current_approval_level + 1 }, { where: { id } });
    }
    return this.findById(id);
  }

  async reject(id, userId, comments = '') {
    const { AFE, AFEApproval } = getModels();
    const afe = await AFE.findByPk(id);
    if (!afe) throw new NotFoundError('AFE not found');
    if (afe.status !== 'PENDING') throw new BadRequestError('Only PENDING AFEs can be rejected');
    await AFEApproval.update({ status: 'REJECTED', approver_id: userId, comments, approved_at: new Date() }, { where: { afe_id: id, status: 'PENDING' } });
    await afe.update({ status: 'REJECTED' });
    return this.findById(id);
  }

  async startExecution(id, userId) {
    const { AFE } = getModels();
    const afe = await AFE.findByPk(id);
    if (!afe) throw new NotFoundError('AFE not found');
    if (afe.status !== 'APPROVED') throw new BadRequestError('Only APPROVED AFEs can start execution');
    await afe.update({ status: 'IN_PROGRESS' });
    return this.findById(id);
  }

  async close(id, userId, finalCost = null) {
    const { AFE, AFEExpense } = getModels();
    const afe = await AFE.findByPk(id);
    if (!afe) throw new NotFoundError('AFE not found');
    if (!['APPROVED', 'IN_PROGRESS'].includes(afe.status)) throw new BadRequestError('Only APPROVED or IN_PROGRESS AFEs can be closed');
    if (!finalCost) {
      const expenses = await AFEExpense.sum('amount_usd', { where: { afe_id: id, status: 'APPROVED' } });
      finalCost = expenses || 0;
    }
    const variance = finalCost - parseFloat(afe.estimated_cost);
    const variancePercentage = afe.estimated_cost > 0 ? (variance / parseFloat(afe.estimated_cost)) * 100 : 0;
    await afe.update({ status: 'CLOSED', closed_at: new Date(), final_cost: finalCost, variance, variance_percentage: variancePercentage });
    return this.findById(id);
  }

  async addCategory(afeId, data) {
    const { AFECategory } = getModels();
    return AFECategory.create({ afe_id: afeId, ...data });
  }

  async updateCategory(categoryId, data) {
    const { AFECategory } = getModels();
    const category = await AFECategory.findByPk(categoryId);
    if (!category) throw new NotFoundError('Category not found');
    await category.update(data);
    return category;
  }

  async deleteCategory(categoryId) {
    const { AFECategory } = getModels();
    const category = await AFECategory.findByPk(categoryId);
    if (!category) throw new NotFoundError('Category not found');
    await category.destroy();
    return { success: true };
  }

  async addExpense(afeId, data, userId) {
    const { AFE, AFEExpense, AFECategory } = getModels();
    const afe = await AFE.findByPk(afeId);
    if (!afe) throw new NotFoundError('AFE not found');
    if (!['APPROVED', 'IN_PROGRESS'].includes(afe.status)) throw new BadRequestError('Expenses can only be added to APPROVED or IN_PROGRESS AFEs');
    const amountUsd = data.currency === 'USD' ? data.amount : data.amount / (data.exchange_rate || 1);
    const expense = await AFEExpense.create({ afe_id: afeId, ...data, amount_usd: amountUsd, created_by: userId });
    if (data.category_id) {
      const category = await AFECategory.findByPk(data.category_id);
      if (category) await category.update({ actual_amount: parseFloat(category.actual_amount) + parseFloat(amountUsd) });
    }
    return expense;
  }

  async getExpenses(afeId, filters = {}) {
    const { AFEExpense, AFECategory, Contractor, User } = getModels();
    const { page = 1, limit = 20, status, categoryId } = filters;
    const where = { afe_id: afeId };
    if (status) where.status = status;
    if (categoryId) where.category_id = categoryId;
    const { count, rows } = await AFEExpense.findAndCountAll({
      where,
      include: [{ model: AFECategory, as: 'category' }, { model: Contractor, as: 'contractor', attributes: ['id', 'companyName', 'code'] }, { model: User, as: 'creator', attributes: ['id', 'username'] }],
      order: [['expense_date', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return { data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) } };
  }

  async approveExpense(expenseId, userId) {
    const { AFEExpense } = getModels();
    const expense = await AFEExpense.findByPk(expenseId);
    if (!expense) throw new NotFoundError('Expense not found');
    await expense.update({ status: 'APPROVED', approved_by: userId, approved_at: new Date() });
    return expense;
  }

  async requestVariance(afeId, data, userId) {
    const { AFE, AFEVariance } = getModels();
    const afe = await AFE.findByPk(afeId);
    if (!afe) throw new NotFoundError('AFE not found');
    const amount = data.new_value - data.original_value;
    const percentage = data.original_value > 0 ? (amount / data.original_value) * 100 : 0;
    return AFEVariance.create({ afe_id: afeId, ...data, amount, percentage, requested_by: userId });
  }

  async approveVariance(varianceId, userId) {
    const { AFE, AFEVariance } = getModels();
    const variance = await AFEVariance.findByPk(varianceId);
    if (!variance) throw new NotFoundError('Variance not found');
    await variance.update({ status: 'APPROVED', approved_by: userId, approved_at: new Date() });
    if (variance.variance_type === 'COST') {
      const afe = await AFE.findByPk(variance.afe_id);
      if (afe) await afe.update({ estimated_cost: variance.new_value });
    }
    return variance;
  }

  async rejectVariance(varianceId, userId, comments = '') {
    const { AFEVariance } = getModels();
    const variance = await AFEVariance.findByPk(varianceId);
    if (!variance) throw new NotFoundError('Variance not found');
    await variance.update({ status: 'REJECTED', approved_by: userId, approved_at: new Date() });
    return variance;
  }

  async getDashboard() {
    const { AFE, AFEExpense, sequelize } = getModels();
    const statusCounts = await AFE.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('SUM', sequelize.col('estimated_cost')), 'total_estimated']],
      group: ['status'],
      raw: true,
    });
    const activeAFEs = await AFE.findAll({
      where: { status: { [Op.in]: ['APPROVED', 'IN_PROGRESS'] } },
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('SUM', sequelize.col('estimated_cost')), 'total_budget']],
      raw: true,
    });
    const totalExpenses = await AFEExpense.sum('amount_usd', { where: { status: 'APPROVED' } });
    const pendingApprovals = await AFE.count({ where: { status: 'PENDING' } });
    const byType = await AFE.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('SUM', sequelize.col('estimated_cost')), 'total']],
      group: ['type'],
      raw: true,
    });
    const recentAFEs = await AFE.findAll({ order: [['created_at', 'DESC']], limit: 5, attributes: ['id', 'code', 'title', 'status', 'estimated_cost', 'created_at'] });
    return { statusCounts, activeAFEs: activeAFEs[0] || { count: 0, total_budget: 0 }, totalExpenses: totalExpenses || 0, pendingApprovals, byType, recentAFEs };
  }

  async getPendingApprovals(userId) {
    const { AFE, AFEApproval, User, Project, Field } = getModels();
    return AFEApproval.findAll({
      where: { status: 'PENDING' },
      include: [{ model: AFE, as: 'afe', include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }, { model: Project, as: 'project', attributes: ['id', 'name'] }, { model: Field, as: 'field', attributes: ['id', 'name'] }] }],
      order: [['created_at', 'ASC']],
    });
  }
}

module.exports = new AFEService();
