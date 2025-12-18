const { Op } = require('sequelize');
const {
  StorageTank,
  TankGauging,
  LoadingTicket,
  CrudeQuality,
  Pipeline,
  Field,
  User,
} = require('../../../database/models');

class LogisticsService {

  // ========================================
  // STORAGE TANKS
  // ========================================

  async findAllTanks(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      field_id,
      search,
      sortBy = 'code',
      sortOrder = 'ASC',
    } = options;

    const where = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (field_id) where.field_id = field_id;
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await StorageTank.findAndCountAll({
      where,
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
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

  async findTankById(id) {
    return StorageTank.findByPk(id, {
      include: [
        { model: Field, as: 'field' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: TankGauging, as: 'gaugings', limit: 10, order: [['gauging_datetime', 'DESC']] },
      ],
    });
  }

  async createTank(data, userId) {
    const code = await this.generateTankCode();
    return StorageTank.create({
      ...data,
      code,
      created_by: userId,
    });
  }

  async updateTank(id, data) {
    const tank = await StorageTank.findByPk(id);
    if (!tank) {
      throw new Error('Tank not found');
    }
    return tank.update(data);
  }

  async deleteTank(id) {
    const tank = await StorageTank.findByPk(id);
    if (!tank) {
      throw new Error('Tank not found');
    }
    return tank.destroy();
  }

  async generateTankCode() {
    const lastTank = await StorageTank.findOne({
      order: [['code', 'DESC']],
      paranoid: false,
    });

    let sequence = 1;
    if (lastTank && lastTank.code.startsWith('TNK-')) {
      const lastSequence = parseInt(lastTank.code.split('-')[1]);
      sequence = lastSequence + 1;
    }

    return `TNK-${String(sequence).padStart(4, '0')}`;
  }

  // ========================================
  // TANK GAUGINGS
  // ========================================

  async findGaugingsByTank(tankId, options = {}) {
    const { page = 1, limit = 20 } = options;

    const { count, rows } = await TankGauging.findAndCountAll({
      where: { tank_id: tankId },
      include: [
        { model: User, as: 'gauger', attributes: ['id', 'username', 'firstName', 'lastName'] },
      ],
      order: [['gauging_datetime', 'DESC']],
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

  async createGauging(data, userId) {
    const gauging = await TankGauging.create({
      ...data,
      gauged_by: userId,
      created_by: userId,
    });

    // Update tank current volume
    await StorageTank.update(
      { 
        current_volume: data.volume,
        last_gauging_date: data.gauging_datetime,
      },
      { where: { id: data.tank_id } }
    );

    return gauging;
  }

  async deleteGauging(id) {
    const gauging = await TankGauging.findByPk(id);
    if (!gauging) {
      throw new Error('Gauging not found');
    }
    return gauging.destroy();
  }

  // ========================================
  // LOADING TICKETS
  // ========================================

  async findAllTickets(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      product_type,
      source_tank_id,
      search,
      date_from,
      date_to,
      sortBy = 'loading_start',
      sortOrder = 'DESC',
    } = options;

    const where = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (product_type) where.product_type = product_type;
    if (source_tank_id) where.source_tank_id = source_tank_id;
    
    if (date_from || date_to) {
      where.loading_start = {};
      if (date_from) where.loading_start[Op.gte] = date_from;
      if (date_to) where.loading_start[Op.lte] = date_to;
    }
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { vehicle_plate: { [Op.iLike]: `%${search}%` } },
        { driver_name: { [Op.iLike]: `%${search}%` } },
        { carrier_company: { [Op.iLike]: `%${search}%` } },
        { destination: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await LoadingTicket.findAndCountAll({
      where,
      include: [
        { model: StorageTank, as: 'sourceTank', attributes: ['id', 'code', 'name'] },
        { model: StorageTank, as: 'destinationTank', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'authorizer', attributes: ['id', 'username'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
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

  async findTicketById(id) {
    return LoadingTicket.findByPk(id, {
      include: [
        { model: StorageTank, as: 'sourceTank' },
        { model: StorageTank, as: 'destinationTank' },
        { model: User, as: 'authorizer', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstName', 'lastName'] },
      ],
    });
  }

  async createTicket(data, userId) {
    const code = await this.generateTicketCode();
    return LoadingTicket.create({
      ...data,
      code,
      created_by: userId,
    });
  }

  async updateTicket(id, data) {
    const ticket = await LoadingTicket.findByPk(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket.update(data);
  }

  async deleteTicket(id) {
    const ticket = await LoadingTicket.findByPk(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket.destroy();
  }

  async completeTicket(id, data, userId) {
    const ticket = await LoadingTicket.findByPk(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket.update({
      ...data,
      status: 'COMPLETED',
      authorized_by: userId,
      loading_end: new Date(),
    });
  }

  async generateTicketCode() {
    const year = new Date().getFullYear();
    
    const lastTicket = await LoadingTicket.findOne({
      where: {
        code: { [Op.like]: `TKT-${year}-%` },
      },
      order: [['code', 'DESC']],
      paranoid: false,
    });

    let sequence = 1;
    if (lastTicket) {
      const lastSequence = parseInt(lastTicket.code.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `TKT-${year}-${String(sequence).padStart(4, '0')}`;
  }

  // ========================================
  // CRUDE QUALITY
  // ========================================

  async findAllQualities(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      field_id,
      tank_id,
      search,
      date_from,
      date_to,
      sortBy = 'sample_date',
      sortOrder = 'DESC',
    } = options;

    const where = {};
    
    if (status) where.status = status;
    if (field_id) where.field_id = field_id;
    if (tank_id) where.tank_id = tank_id;
    
    if (date_from || date_to) {
      where.sample_date = {};
      if (date_from) where.sample_date[Op.gte] = date_from;
      if (date_to) where.sample_date[Op.lte] = date_to;
    }
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { lab_report_number: { [Op.iLike]: `%${search}%` } },
        { lab_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await CrudeQuality.findAndCountAll({
      where,
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
        { model: StorageTank, as: 'tank', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'sampler', attributes: ['id', 'username'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
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

  async findQualityById(id) {
    return CrudeQuality.findByPk(id, {
      include: [
        { model: Field, as: 'field' },
        { model: StorageTank, as: 'tank' },
        { model: User, as: 'sampler', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstName', 'lastName'] },
      ],
    });
  }

  async createQuality(data, userId) {
    const code = await this.generateQualityCode();
    return CrudeQuality.create({
      ...data,
      code,
      sampled_by: userId,
      created_by: userId,
    });
  }

  async updateQuality(id, data) {
    const quality = await CrudeQuality.findByPk(id);
    if (!quality) {
      throw new Error('Quality record not found');
    }
    return quality.update(data);
  }

  async deleteQuality(id) {
    const quality = await CrudeQuality.findByPk(id);
    if (!quality) {
      throw new Error('Quality record not found');
    }
    return quality.destroy();
  }

  async approveQuality(id, userId) {
    const quality = await CrudeQuality.findByPk(id);
    if (!quality) {
      throw new Error('Quality record not found');
    }
    return quality.update({ status: 'APPROVED' });
  }

  async generateQualityCode() {
    const year = new Date().getFullYear();
    
    const lastQuality = await CrudeQuality.findOne({
      where: {
        code: { [Op.like]: `QTY-${year}-%` },
      },
      order: [['code', 'DESC']],
      paranoid: false,
    });

    let sequence = 1;
    if (lastQuality) {
      const lastSequence = parseInt(lastQuality.code.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `QTY-${year}-${String(sequence).padStart(4, '0')}`;
  }

  // ========================================
  // PIPELINES
  // ========================================

  async findAllPipelines(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      search,
      sortBy = 'code',
      sortOrder = 'ASC',
    } = options;

    const where = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { origin: { [Op.iLike]: `%${search}%` } },
        { destination: { [Op.iLike]: `%${search}%` } },
        { operator: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Pipeline.findAndCountAll({
      where,
      include: [
        { model: Field, as: 'originField', attributes: ['id', 'code', 'name'] },
        { model: Field, as: 'destinationField', attributes: ['id', 'code', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
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

  async findPipelineById(id) {
    return Pipeline.findByPk(id, {
      include: [
        { model: Field, as: 'originField' },
        { model: Field, as: 'destinationField' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstName', 'lastName'] },
      ],
    });
  }

  async createPipeline(data, userId) {
    const code = await this.generatePipelineCode();
    return Pipeline.create({
      ...data,
      code,
      created_by: userId,
    });
  }

  async updatePipeline(id, data) {
    const pipeline = await Pipeline.findByPk(id);
    if (!pipeline) {
      throw new Error('Pipeline not found');
    }
    return pipeline.update(data);
  }

  async deletePipeline(id) {
    const pipeline = await Pipeline.findByPk(id);
    if (!pipeline) {
      throw new Error('Pipeline not found');
    }
    return pipeline.destroy();
  }

  async generatePipelineCode() {
    const lastPipeline = await Pipeline.findOne({
      order: [['code', 'DESC']],
      paranoid: false,
    });

    let sequence = 1;
    if (lastPipeline && lastPipeline.code.startsWith('PIP-')) {
      const lastSequence = parseInt(lastPipeline.code.split('-')[1]);
      sequence = lastSequence + 1;
    }

    return `PIP-${String(sequence).padStart(4, '0')}`;
  }

  // ========================================
  // DASHBOARD & STATISTICS
  // ========================================

  async getDashboard() {
    const { sequelize } = StorageTank;

    // Tank summary by type
    const tanksByType = await StorageTank.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('capacity')), 'total_capacity'],
        [sequelize.fn('SUM', sequelize.col('current_volume')), 'total_volume'],
      ],
      where: { status: 'ACTIVE' },
      group: ['type'],
      raw: true,
    });

    // Tank summary by status
    const tanksByStatus = await StorageTank.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Recent tickets
    const recentTickets = await LoadingTicket.findAll({
      include: [
        { model: StorageTank, as: 'sourceTank', attributes: ['id', 'code', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    // Tickets by status
    const ticketsByStatus = await LoadingTicket.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Volume moved this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const volumeThisMonth = await LoadingTicket.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('net_volume')), 'total_volume'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'ticket_count'],
      ],
      where: {
        status: 'COMPLETED',
        loading_end: { [Op.gte]: startOfMonth },
      },
      raw: true,
    });

    // Average crude quality
    const avgQuality = await CrudeQuality.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('api_gravity')), 'avg_api'],
        [sequelize.fn('AVG', sequelize.col('bsw')), 'avg_bsw'],
        [sequelize.fn('AVG', sequelize.col('sulfur_content')), 'avg_sulfur'],
      ],
      where: { status: 'APPROVED' },
      raw: true,
    });

    // Pipeline summary
    const pipelinesByStatus = await Pipeline.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('length_km')), 'total_length'],
      ],
      group: ['status'],
      raw: true,
    });

    // Recent quality samples
    const recentQuality = await CrudeQuality.findAll({
      include: [
        { model: Field, as: 'field', attributes: ['id', 'code', 'name'] },
      ],
      order: [['sample_date', 'DESC']],
      limit: 5,
    });

    return {
      tanksByType,
      tanksByStatus,
      recentTickets,
      ticketsByStatus,
      volumeThisMonth,
      avgQuality,
      pipelinesByStatus,
      recentQuality,
    };
  }
}

module.exports = LogisticsService;
