const { Op } = require('sequelize');
const {
  ReserveEstimate,
  ReserveCategory,
  ReserveValuation,
  Field,
  User,
} = require('../../../database/models');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

class ReserveService {

  // ========================================
  // RESERVE ESTIMATES
  // ========================================

  async findAllEstimates(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      standard,
      field_id,
      evaluator,
      search,
      sortBy = 'estimate_date',
      sortOrder = 'DESC',
    } = options;

    const where = {};
    
    if (status) where.status = status;
    if (standard) where.standard = standard;
    if (field_id) where.field_id = field_id;
    if (evaluator) where.evaluator = evaluator;
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { evaluator_company: { [Op.iLike]: `%${search}%` } },
        { evaluator_name: { [Op.iLike]: `%${search}%` } },
        { report_number: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await ReserveEstimate.findAndCountAll({
      where,
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
        { model: ReserveCategory, as: 'categories' },
      ],
      order: [[sortBy, sortOrder]],
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

  async findEstimateById(id) {
    return ReserveEstimate.findByPk(id, {
      include: [
        { model: Field, as: 'field' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: ReserveCategory, as: 'categories' },
        { model: ReserveValuation, as: 'valuations' },
      ],
    });
  }

  async createEstimate(data, userId) {
        
    const code = await this.generateEstimateCode();
    
    return ReserveEstimate.create({
      ...data,
      code,
      created_by: userId,
    });
  }

  async updateEstimate(id, data) {
        
    const estimate = await ReserveEstimate.findByPk(id);
    if (!estimate) {
      throw new Error('Estimate not found');
    }

    return estimate.update(data);
  }

  async deleteEstimate(id) {
        
    const estimate = await ReserveEstimate.findByPk(id);
    if (!estimate) {
      throw new Error('Estimate not found');
    }

    return estimate.destroy();
  }

  async approveEstimate(id, userId) {
        
    const estimate = await ReserveEstimate.findByPk(id);
    if (!estimate) {
      throw new Error('Estimate not found');
    }

    return estimate.update({
      status: 'APPROVED',
      approved_by: userId,
      approved_at: new Date(),
    });
  }

  async generateEstimateCode() {
        const year = new Date().getFullYear();
    
    const lastEstimate = await ReserveEstimate.findOne({
      where: {
        code: { [Op.like]: `RES-${year}-%` },
      },
      order: [['code', 'DESC']],
      paranoid: false,
    });

    let sequence = 1;
    if (lastEstimate) {
      const lastSequence = parseInt(lastEstimate.code.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `RES-${year}-${String(sequence).padStart(4, '0')}`;
  }

  // ========================================
  // RESERVE CATEGORIES
  // ========================================

  async findCategoriesByEstimate(estimateId) {
    
    return ReserveCategory.findAll({
      where: { estimate_id: estimateId },
      order: [['category', 'ASC']],
    });
  }

  async createCategory(data) {
        
    // Calculate BOE if not provided
    if (!data.boe_volume && (data.oil_volume || data.gas_volume || data.condensate_volume || data.ngl_volume)) {
      data.boe_volume = this.calculateBOE(data);
    }

    return ReserveCategory.create(data);
  }

  async updateCategory(id, data) {
        
    const category = await ReserveCategory.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }

    // Recalculate BOE if volumes changed
    if (data.oil_volume !== undefined || data.gas_volume !== undefined || 
        data.condensate_volume !== undefined || data.ngl_volume !== undefined) {
      data.boe_volume = this.calculateBOE({ ...category.toJSON(), ...data });
    }

    return category.update(data);
  }

  async deleteCategory(id) {
        
    const category = await ReserveCategory.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }

    return category.destroy();
  }

  calculateBOE(data) {
    // Standard conversion: 6 Mcf gas = 1 BOE
    const oil = parseFloat(data.oil_volume) || 0;
    const gas = (parseFloat(data.gas_volume) || 0) / 6; // Bcf to MMboe
    const condensate = parseFloat(data.condensate_volume) || 0;
    const ngl = parseFloat(data.ngl_volume) || 0;
    
    return oil + gas + condensate + ngl;
  }

  // ========================================
  // RESERVE VALUATIONS
  // ========================================

  async findAllValuations(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      estimate_id,
      methodology,
      search,
      sortBy = 'valuation_date',
      sortOrder = 'DESC',
    } = options;

    const where = {};
    
    if (status) where.status = status;
    if (estimate_id) where.estimate_id = estimate_id;
    if (methodology) where.methodology = methodology;
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    
    const { count, rows } = await ReserveValuation.findAndCountAll({
      where,
      include: [
        { 
          model: ReserveEstimate, 
          as: 'estimate',
          include: [
            { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
          ],
        },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'approver', attributes: ['id', 'username'] },
      ],
      order: [[sortBy, sortOrder]],
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

  async findValuationById(id) {
    
    return ReserveValuation.findByPk(id, {
      include: [
        { 
          model: ReserveEstimate, 
          as: 'estimate',
          include: [
            { model: Field, as: 'field' },
            { model: ReserveCategory, as: 'categories' },
          ],
        },
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'firstName', 'lastName'] },
      ],
    });
  }

  async createValuation(data, userId) {
        
    const code = await this.generateValuationCode();
    
    return ReserveValuation.create({
      ...data,
      code,
      created_by: userId,
    });
  }

  async updateValuation(id, data) {
        
    const valuation = await ReserveValuation.findByPk(id);
    if (!valuation) {
      throw new Error('Valuation not found');
    }

    return valuation.update(data);
  }

  async deleteValuation(id) {
        
    const valuation = await ReserveValuation.findByPk(id);
    if (!valuation) {
      throw new Error('Valuation not found');
    }

    return valuation.destroy();
  }

  async approveValuation(id, userId) {
        
    const valuation = await ReserveValuation.findByPk(id);
    if (!valuation) {
      throw new Error('Valuation not found');
    }

    return valuation.update({
      status: 'APPROVED',
      approved_by: userId,
      approved_at: new Date(),
    });
  }

  async generateValuationCode() {
        const year = new Date().getFullYear();
    
    const lastValuation = await ReserveValuation.findOne({
      where: {
        code: { [Op.like]: `VAL-${year}-%` },
      },
      order: [['code', 'DESC']],
      paranoid: false,
    });

    let sequence = 1;
    if (lastValuation) {
      const lastSequence = parseInt(lastValuation.code.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `VAL-${year}-${String(sequence).padStart(4, '0')}`;
  }

  // ========================================
  // DASHBOARD & STATISTICS
  // ========================================

  async getDashboard() {
        const { sequelize } = ReserveEstimate;

    // Total reserves by category
    const reservesByCategory = await ReserveCategory.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('oil_volume')), 'total_oil'],
        [sequelize.fn('SUM', sequelize.col('gas_volume')), 'total_gas'],
        [sequelize.fn('SUM', sequelize.col('boe_volume')), 'total_boe'],
      ],
      include: [{
        model: ReserveEstimate,
        as: 'estimate',
        attributes: [],
        where: { status: 'APPROVED' },
      }],
      group: ['category'],
      raw: true,
    });

    // Estimates by status
    const estimatesByStatus = await ReserveEstimate.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Reserves by field
    const reservesByField = await ReserveCategory.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('oil_volume')), 'total_oil'],
        [sequelize.fn('SUM', sequelize.col('gas_volume')), 'total_gas'],
        [sequelize.fn('SUM', sequelize.col('boe_volume')), 'total_boe'],
      ],
      include: [{
        model: ReserveEstimate,
        as: 'estimate',
        attributes: ['field_id'],
        where: { status: 'APPROVED' },
        include: [{
          model: Field,
          as: 'field',
          attributes: ['id', 'code', 'name'],
        }],
      }],
      group: ['estimate.field_id', 'estimate.field.id', 'estimate.field.code', 'estimate.field.name'],
      raw: true,
      nest: true,
    });

    // Latest valuations
    const latestValuations = await ReserveValuation.findAll({
      where: { status: 'APPROVED' },
      include: [{
        model: ReserveEstimate,
        as: 'estimate',
        include: [{ model: Field, as: 'field', attributes: ['id', 'code', 'name'] }],
      }],
      order: [['valuation_date', 'DESC']],
      limit: 5,
    });

    // Total NPV summary
    const npvSummary = await ReserveValuation.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('npv_1p')), 'total_npv_1p'],
        [sequelize.fn('SUM', sequelize.col('npv_2p')), 'total_npv_2p'],
        [sequelize.fn('SUM', sequelize.col('npv_3p')), 'total_npv_3p'],
      ],
      where: { status: 'APPROVED' },
      raw: true,
    });

    // Recent estimates
    const recentEstimates = await ReserveEstimate.findAll({
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    return {
      reservesByCategory,
      estimatesByStatus,
      reservesByField,
      latestValuations,
      npvSummary,
      recentEstimates,
    };
  }

  async getFieldReserves(fieldId) {
    
    const latestEstimate = await ReserveEstimate.findOne({
      where: { 
        field_id: fieldId,
        status: 'APPROVED',
      },
      include: [
        { model: Field, as: 'field' },
        { model: ReserveCategory, as: 'categories' },
      ],
      order: [['estimate_date', 'DESC']],
    });

    return latestEstimate;
  }
}

module.exports = ReserveService;
