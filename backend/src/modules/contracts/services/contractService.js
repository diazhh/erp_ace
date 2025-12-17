const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

let models = null;
const getModels = () => {
  if (!models) {
    models = require('../../../database/models');
  }
  return models;
};

class ContractService {
  // ==================== CONTRACT METHODS ====================
  
  async generateContractCode(type, year = new Date().getFullYear()) {
    const { OGContract } = getModels();
    const prefix = type === 'PSA' ? 'PSA' : type === 'JOA' ? 'JOA' : 'CTR';
    const lastContract = await OGContract.findOne({
      where: { code: { [Op.like]: `${prefix}-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastContract) {
      const parts = lastContract.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `${prefix}-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async createContract(data, userId) {
    const { OGContract } = getModels();
    const code = await this.generateContractCode(data.type);
    const contract = await OGContract.create({
      ...data,
      code,
      created_by: userId,
    });
    return this.findContractById(contract.id);
  }

  async findContractById(id) {
    const { OGContract, ContractParty, WorkingInterest, RoyaltyPayment, Concession, Client, User, Field } = getModels();
    const contract = await OGContract.findByPk(id, {
      include: [
        { 
          model: ContractParty, 
          as: 'parties',
          include: [
            { model: Client, as: 'client', attributes: ['id', 'companyName', 'code'] },
          ],
        },
        { model: WorkingInterest, as: 'workingInterests' },
        { model: RoyaltyPayment, as: 'royalties', limit: 12, order: [['period_year', 'DESC'], ['period_month', 'DESC']] },
        { model: Concession, as: 'concessions' },
        { model: Client, as: 'operator', attributes: ['id', 'companyName', 'code'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
      ],
    });
    if (!contract) throw new NotFoundError('Contract not found');
    return contract;
  }

  async findAllContracts(filters = {}) {
    const { OGContract, ContractParty, Client, User } = getModels();
    const { page = 1, limit = 10, status, type, search, operatorId } = filters;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (operatorId) where.operator_id = operatorId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const { count, rows } = await OGContract.findAndCountAll({
      where,
      include: [
        { model: Client, as: 'operator', attributes: ['id', 'companyName', 'code'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: ContractParty, as: 'parties', attributes: ['id', 'party_name', 'party_type', 'working_interest', 'is_operator'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      distinct: true,
    });
    return { 
      data: rows, 
      pagination: { 
        total: count, 
        page: parseInt(page), 
        limit: parseInt(limit), 
        totalPages: Math.ceil(count / parseInt(limit)) 
      } 
    };
  }

  async updateContract(id, data, userId) {
    const { OGContract } = getModels();
    const contract = await OGContract.findByPk(id);
    if (!contract) throw new NotFoundError('Contract not found');
    await contract.update(data);
    return this.findContractById(id);
  }

  async deleteContract(id) {
    const { OGContract } = getModels();
    const contract = await OGContract.findByPk(id);
    if (!contract) throw new NotFoundError('Contract not found');
    if (contract.status === 'ACTIVE') {
      throw new BadRequestError('Cannot delete an active contract');
    }
    await contract.destroy();
    return { success: true };
  }

  async activateContract(id, userId) {
    const { OGContract } = getModels();
    const contract = await OGContract.findByPk(id);
    if (!contract) throw new NotFoundError('Contract not found');
    if (contract.status !== 'DRAFT') {
      throw new BadRequestError('Only DRAFT contracts can be activated');
    }
    await contract.update({ status: 'ACTIVE' });
    return this.findContractById(id);
  }

  async terminateContract(id, userId) {
    const { OGContract } = getModels();
    const contract = await OGContract.findByPk(id);
    if (!contract) throw new NotFoundError('Contract not found');
    await contract.update({ status: 'TERMINATED' });
    return this.findContractById(id);
  }

  // ==================== PARTY METHODS ====================

  async addParty(contractId, data) {
    const { OGContract, ContractParty } = getModels();
    const contract = await OGContract.findByPk(contractId);
    if (!contract) throw new NotFoundError('Contract not found');
    
    // Validate total working interest doesn't exceed 100%
    const existingParties = await ContractParty.findAll({ where: { contract_id: contractId, status: 'ACTIVE' } });
    const totalWI = existingParties.reduce((sum, p) => sum + parseFloat(p.working_interest || 0), 0);
    if (data.working_interest && (totalWI + parseFloat(data.working_interest)) > 100) {
      throw new BadRequestError(`Total working interest cannot exceed 100%. Current: ${totalWI}%`);
    }
    
    const party = await ContractParty.create({ contract_id: contractId, ...data });
    return party;
  }

  async updateParty(partyId, data) {
    const { ContractParty } = getModels();
    const party = await ContractParty.findByPk(partyId);
    if (!party) throw new NotFoundError('Party not found');
    
    // Validate working interest if changed
    if (data.working_interest && data.working_interest !== party.working_interest) {
      const existingParties = await ContractParty.findAll({ 
        where: { contract_id: party.contract_id, status: 'ACTIVE', id: { [Op.ne]: partyId } } 
      });
      const totalWI = existingParties.reduce((sum, p) => sum + parseFloat(p.working_interest || 0), 0);
      if ((totalWI + parseFloat(data.working_interest)) > 100) {
        throw new BadRequestError(`Total working interest cannot exceed 100%. Other parties: ${totalWI}%`);
      }
    }
    
    await party.update(data);
    return party;
  }

  async deleteParty(partyId) {
    const { ContractParty } = getModels();
    const party = await ContractParty.findByPk(partyId);
    if (!party) throw new NotFoundError('Party not found');
    await party.destroy();
    return { success: true };
  }

  async getContractParties(contractId) {
    const { ContractParty, Client, Contractor } = getModels();
    return ContractParty.findAll({
      where: { contract_id: contractId },
      include: [
        { model: Client, as: 'client', attributes: ['id', 'companyName', 'code'] },
        { model: Contractor, as: 'contractor', attributes: ['id', 'companyName', 'code'] },
      ],
      order: [['is_operator', 'DESC'], ['working_interest', 'DESC']],
    });
  }

  // ==================== WORKING INTEREST METHODS ====================

  async addWorkingInterest(contractId, data, userId) {
    const { OGContract, WorkingInterest, ContractParty } = getModels();
    const contract = await OGContract.findByPk(contractId);
    if (!contract) throw new NotFoundError('Contract not found');
    
    const party = await ContractParty.findByPk(data.party_id);
    if (!party || party.contract_id !== contractId) {
      throw new BadRequestError('Party not found or does not belong to this contract');
    }
    
    const wi = await WorkingInterest.create({ 
      contract_id: contractId, 
      ...data, 
      created_by: userId 
    });
    return wi;
  }

  async getWorkingInterests(contractId, filters = {}) {
    const { WorkingInterest, ContractParty, Field, Well } = getModels();
    const { assetType, partyId, status } = filters;
    const where = { contract_id: contractId };
    if (assetType) where.asset_type = assetType;
    if (partyId) where.party_id = partyId;
    if (status) where.status = status;
    
    return WorkingInterest.findAll({
      where,
      include: [
        { model: ContractParty, as: 'party', attributes: ['id', 'party_name', 'party_type'] },
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: Well, as: 'well', attributes: ['id', 'name', 'code'] },
      ],
      order: [['effective_date', 'DESC']],
    });
  }

  async updateWorkingInterest(wiId, data) {
    const { WorkingInterest } = getModels();
    const wi = await WorkingInterest.findByPk(wiId);
    if (!wi) throw new NotFoundError('Working interest record not found');
    await wi.update(data);
    return wi;
  }

  // ==================== ROYALTY METHODS ====================

  async calculateRoyalty(contractId, data, userId) {
    const { OGContract, RoyaltyPayment, WellProduction, Field, sequelize } = getModels();
    const contract = await OGContract.findByPk(contractId);
    if (!contract) throw new NotFoundError('Contract not found');
    
    const { period_month, period_year, field_id, oil_price, gas_price } = data;
    
    // Get production for the period
    let productionData = { oil: 0, gas: 0 };
    if (field_id) {
      const startDate = new Date(period_year, period_month - 1, 1);
      const endDate = new Date(period_year, period_month, 0);
      
      const production = await WellProduction.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('oil_volume')), 'total_oil'],
          [sequelize.fn('SUM', sequelize.col('gas_volume')), 'total_gas'],
        ],
        include: [{
          model: getModels().Well,
          as: 'well',
          where: { field_id },
          attributes: [],
        }],
        where: {
          production_date: { [Op.between]: [startDate, endDate] },
        },
        raw: true,
      });
      
      if (production[0]) {
        productionData.oil = parseFloat(production[0].total_oil) || 0;
        productionData.gas = parseFloat(production[0].total_gas) || 0;
      }
    }
    
    const productionValue = (productionData.oil * (oil_price || 0)) + (productionData.gas * (gas_price || 0));
    const royaltyRate = contract.royalty_rate || 0;
    const royaltyAmount = productionValue * (royaltyRate / 100);
    
    // Check if royalty already exists for this period
    const existing = await RoyaltyPayment.findOne({
      where: { contract_id: contractId, period_month, period_year, field_id: field_id || null },
    });
    
    if (existing) {
      await existing.update({
        production_oil_bbl: productionData.oil,
        production_gas_mcf: productionData.gas,
        oil_price,
        gas_price,
        production_value: productionValue,
        royalty_rate: royaltyRate,
        royalty_amount: royaltyAmount,
        status: 'CALCULATED',
        calculated_by: userId,
      });
      return existing;
    }
    
    return RoyaltyPayment.create({
      contract_id: contractId,
      period_month,
      period_year,
      field_id,
      production_oil_bbl: productionData.oil,
      production_gas_mcf: productionData.gas,
      oil_price,
      gas_price,
      production_value: productionValue,
      royalty_rate: royaltyRate,
      royalty_amount: royaltyAmount,
      currency: contract.currency,
      status: 'CALCULATED',
      calculated_by: userId,
    });
  }

  async getRoyalties(contractId, filters = {}) {
    const { RoyaltyPayment, Field, User } = getModels();
    const { page = 1, limit = 12, status, year, fieldId } = filters;
    const where = { contract_id: contractId };
    if (status) where.status = status;
    if (year) where.period_year = year;
    if (fieldId) where.field_id = fieldId;
    
    const { count, rows } = await RoyaltyPayment.findAndCountAll({
      where,
      include: [
        { model: Field, as: 'field', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'calculator', attributes: ['id', 'username'] },
        { model: User, as: 'payer', attributes: ['id', 'username'] },
      ],
      order: [['period_year', 'DESC'], ['period_month', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    
    return { 
      data: rows, 
      pagination: { 
        total: count, 
        page: parseInt(page), 
        limit: parseInt(limit), 
        totalPages: Math.ceil(count / parseInt(limit)) 
      } 
    };
  }

  async payRoyalty(royaltyId, data, userId) {
    const { RoyaltyPayment } = getModels();
    const royalty = await RoyaltyPayment.findByPk(royaltyId);
    if (!royalty) throw new NotFoundError('Royalty payment not found');
    
    await royalty.update({
      status: 'PAID',
      payment_date: data.payment_date || new Date(),
      payment_reference: data.payment_reference,
      government_receipt: data.government_receipt,
      transaction_id: data.transaction_id,
      paid_by: userId,
    });
    
    return royalty;
  }

  // ==================== CONCESSION METHODS ====================

  async generateConcessionCode(year = new Date().getFullYear()) {
    const { Concession } = getModels();
    const lastConcession = await Concession.findOne({
      where: { code: { [Op.like]: `BLK-${year}-%` } },
      order: [['code', 'DESC']],
      paranoid: false,
    });
    let nextNumber = 1;
    if (lastConcession) {
      const parts = lastConcession.code.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }
    return `BLK-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async createConcession(data, userId) {
    const { Concession } = getModels();
    const code = data.code || await this.generateConcessionCode();
    const concession = await Concession.create({
      ...data,
      code,
      created_by: userId,
    });
    return this.findConcessionById(concession.id);
  }

  async findConcessionById(id) {
    const { Concession, OGContract, Field, User } = getModels();
    const concession = await Concession.findByPk(id, {
      include: [
        { model: OGContract, as: 'contract', attributes: ['id', 'code', 'name', 'type', 'status'] },
        { model: Field, as: 'fields', attributes: ['id', 'code', 'name', 'status'] },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });
    if (!concession) throw new NotFoundError('Concession not found');
    return concession;
  }

  async findAllConcessions(filters = {}) {
    const { Concession, OGContract, User } = getModels();
    const { page = 1, limit = 10, status, type, contractId, search } = filters;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (contractId) where.contract_id = contractId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }
    
    const { count, rows } = await Concession.findAndCountAll({
      where,
      include: [
        { model: OGContract, as: 'contract', attributes: ['id', 'code', 'name'] },
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
        totalPages: Math.ceil(count / parseInt(limit)) 
      } 
    };
  }

  async updateConcession(id, data) {
    const { Concession } = getModels();
    const concession = await Concession.findByPk(id);
    if (!concession) throw new NotFoundError('Concession not found');
    await concession.update(data);
    return this.findConcessionById(id);
  }

  async deleteConcession(id) {
    const { Concession } = getModels();
    const concession = await Concession.findByPk(id);
    if (!concession) throw new NotFoundError('Concession not found');
    await concession.destroy();
    return { success: true };
  }

  // ==================== DASHBOARD ====================

  async getDashboard() {
    const { OGContract, ContractParty, RoyaltyPayment, Concession, sequelize } = getModels();
    
    // Contracts by status
    const contractsByStatus = await OGContract.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });
    
    // Contracts by type
    const contractsByType = await OGContract.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['type'],
      raw: true,
    });
    
    // Total contracts
    const totalContracts = await OGContract.count();
    const activeContracts = await OGContract.count({ where: { status: 'ACTIVE' } });
    
    // Expiring contracts (next 90 days)
    const today = new Date();
    const in90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const expiringContracts = await OGContract.findAll({
      where: {
        status: 'ACTIVE',
        end_date: { [Op.between]: [today, in90Days] },
      },
      attributes: ['id', 'code', 'name', 'end_date'],
      order: [['end_date', 'ASC']],
      limit: 5,
    });
    
    // Royalties summary (current year)
    const currentYear = new Date().getFullYear();
    const royaltiesSummary = await RoyaltyPayment.findAll({
      attributes: [
        'status',
        [sequelize.fn('SUM', sequelize.col('royalty_amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: { period_year: currentYear },
      group: ['status'],
      raw: true,
    });
    
    // Concessions summary
    const concessionsByStatus = await Concession.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('area_km2')), 'total_area'],
      ],
      group: ['status'],
      raw: true,
    });
    
    // Recent contracts
    const recentContracts = await OGContract.findAll({
      attributes: ['id', 'code', 'name', 'type', 'status', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5,
    });
    
    // Total working interest by party type
    const wiByPartyType = await ContractParty.findAll({
      attributes: [
        'party_type',
        [sequelize.fn('AVG', sequelize.col('working_interest')), 'avg_wi'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: { status: 'ACTIVE' },
      group: ['party_type'],
      raw: true,
    });
    
    return {
      totalContracts,
      activeContracts,
      contractsByStatus,
      contractsByType,
      expiringContracts,
      royaltiesSummary,
      concessionsByStatus,
      recentContracts,
      wiByPartyType,
    };
  }
}

module.exports = new ContractService();
