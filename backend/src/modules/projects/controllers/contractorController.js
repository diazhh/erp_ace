const { Op } = require('sequelize');
const { sequelize } = require('../../../database');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

/**
 * Generar código único para contratista
 */
async function generateContractorCode() {
  const { Contractor } = require('../../../database/models');
  
  const lastContractor = await Contractor.findOne({
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastContractor && lastContractor.code) {
    const match = lastContractor.code.match(/CTR-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }
  
  return `CTR-${String(nextNumber).padStart(3, '0')}`;
}

class ContractorController {
  /**
   * Crear nuevo contratista
   */
  async create(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Contractor } = require('../../../database/models');
      
      const code = await generateContractorCode();
      const {
        companyName,
        tradeName,
        taxId,
        contactName,
        contactEmail,
        contactPhone,
        address,
        city,
        state,
        country,
        specialties,
        bankName,
        bankAccountNumber,
        bankAccountType,
        hasInsurance,
        insuranceExpiry,
        hasLicense,
        licenseExpiry,
        notes,
      } = req.body;
      
      // Verificar si ya existe un contratista con el mismo RIF
      if (taxId) {
        const existing = await Contractor.findOne({ where: { taxId } });
        if (existing) {
          throw new BadRequestError('Ya existe un contratista con ese RIF');
        }
      }
      
      const contractor = await Contractor.create({
        code,
        companyName,
        tradeName,
        taxId,
        contactName,
        contactEmail,
        contactPhone,
        address,
        city,
        state,
        country: country || 'Venezuela',
        specialties,
        bankName,
        bankAccountNumber,
        bankAccountType,
        hasInsurance: hasInsurance || false,
        insuranceExpiry,
        hasLicense: hasLicense || false,
        licenseExpiry,
        createdBy: req.user.id,
        notes,
      }, { transaction: t });
      
      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: 'Contratista creado exitosamente',
        data: contractor,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  /**
   * Listar contratistas
   */
  async list(req, res, next) {
    try {
      const { Contractor } = require('../../../database/models');
      const { status, specialty, search, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (specialty) {
        whereClause.specialties = { [Op.contains]: [specialty] };
      }
      if (search) {
        whereClause[Op.or] = [
          { companyName: { [Op.iLike]: `%${search}%` } },
          { tradeName: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } },
          { taxId: { [Op.iLike]: `%${search}%` } },
          { contactName: { [Op.iLike]: `%${search}%` } },
        ];
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await Contractor.findAndCountAll({
        where: whereClause,
        order: [['companyName', 'ASC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener contratista por ID
   */
  async getById(req, res, next) {
    try {
      const { Contractor, User } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.params.id, {
        include: [
          { model: User, as: 'creator', attributes: ['id', 'username'] },
        ],
      });
      
      if (!contractor) {
        throw new NotFoundError('Contratista no encontrado');
      }
      
      return res.json({
        success: true,
        data: contractor,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener contratista con proyectos (trazabilidad)
   */
  async getFullById(req, res, next) {
    try {
      const { Contractor, Project, User, AuditLog } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.params.id, {
        include: [
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { 
            model: Project, 
            as: 'projects',
            attributes: ['id', 'code', 'name', 'status', 'progress', 'startDate', 'endDate', 'contractAmount', 'paidToContractor'],
          },
        ],
      });
      
      if (!contractor) {
        throw new NotFoundError('Contratista no encontrado');
      }
      
      // Estadísticas
      const stats = {
        totalProjects: contractor.projects?.length || 0,
        activeProjects: contractor.projects?.filter(p => p.status === 'IN_PROGRESS').length || 0,
        completedProjects: contractor.projects?.filter(p => p.status === 'COMPLETED').length || 0,
        totalContractValue: contractor.projects?.reduce((sum, p) => sum + parseFloat(p.contractAmount || 0), 0) || 0,
        totalPaid: contractor.projects?.reduce((sum, p) => sum + parseFloat(p.paidToContractor || 0), 0) || 0,
      };
      stats.pendingPayment = stats.totalContractValue - stats.totalPaid;
      
      // Historial de auditoría
      const auditLogs = await AuditLog.findAll({
        where: { 
          entityType: 'Contractor',
          entityId: contractor.id,
        },
        limit: 20,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        }],
      });
      
      return res.json({
        success: true,
        data: {
          ...contractor.toJSON(),
          stats,
          auditLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar contratista
   */
  async update(req, res, next) {
    try {
      const { Contractor } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.params.id);
      if (!contractor) {
        throw new NotFoundError('Contratista no encontrado');
      }
      
      const {
        companyName,
        tradeName,
        taxId,
        contactName,
        contactEmail,
        contactPhone,
        address,
        city,
        state,
        country,
        specialties,
        bankName,
        bankAccountNumber,
        bankAccountType,
        status,
        rating,
        hasInsurance,
        insuranceExpiry,
        hasLicense,
        licenseExpiry,
        notes,
      } = req.body;
      
      // Verificar RIF duplicado
      if (taxId && taxId !== contractor.taxId) {
        const existing = await Contractor.findOne({ 
          where: { 
            taxId,
            id: { [Op.ne]: contractor.id },
          },
        });
        if (existing) {
          throw new BadRequestError('Ya existe un contratista con ese RIF');
        }
      }
      
      await contractor.update({
        companyName,
        tradeName,
        taxId,
        contactName,
        contactEmail,
        contactPhone,
        address,
        city,
        state,
        country,
        specialties,
        bankName,
        bankAccountNumber,
        bankAccountType,
        status,
        rating,
        hasInsurance,
        insuranceExpiry,
        hasLicense,
        licenseExpiry,
        notes,
      });
      
      return res.json({
        success: true,
        message: 'Contratista actualizado',
        data: contractor,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar contratista
   */
  async delete(req, res, next) {
    try {
      const { Contractor, Project } = require('../../../database/models');
      
      const contractor = await Contractor.findByPk(req.params.id);
      if (!contractor) {
        throw new NotFoundError('Contratista no encontrado');
      }
      
      // Verificar que no tenga proyectos activos
      const activeProjects = await Project.count({
        where: { 
          contractorId: contractor.id,
          status: { [Op.in]: ['PLANNING', 'IN_PROGRESS', 'ON_HOLD'] },
        },
      });
      
      if (activeProjects > 0) {
        throw new BadRequestError('No se puede eliminar un contratista con proyectos activos');
      }
      
      await contractor.destroy();
      
      return res.json({
        success: true,
        message: 'Contratista eliminado',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadísticas generales de contratistas
   */
  async getStats(req, res, next) {
    try {
      const { Contractor, Project } = require('../../../database/models');
      
      const totalContractors = await Contractor.count();
      const activeContractors = await Contractor.count({ where: { status: 'ACTIVE' } });
      const suspendedContractors = await Contractor.count({ where: { status: 'SUSPENDED' } });
      const blacklistedContractors = await Contractor.count({ where: { status: 'BLACKLISTED' } });
      
      // Contratistas con proyectos activos
      const contractorsWithActiveProjects = await Contractor.count({
        include: [{
          model: Project,
          as: 'projects',
          where: { status: 'IN_PROGRESS' },
          required: true,
        }],
        distinct: true,
      });
      
      // Top contratistas por proyectos completados
      const topContractors = await Contractor.findAll({
        where: { completedProjects: { [Op.gt]: 0 } },
        order: [['completedProjects', 'DESC'], ['rating', 'DESC']],
        limit: 5,
        attributes: ['id', 'code', 'companyName', 'completedProjects', 'rating'],
      });
      
      return res.json({
        success: true,
        data: {
          total: totalContractors,
          active: activeContractors,
          suspended: suspendedContractors,
          blacklisted: blacklistedContractors,
          withActiveProjects: contractorsWithActiveProjects,
          topContractors,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener especialidades disponibles
   */
  async getSpecialties(req, res, next) {
    try {
      const specialties = [
        { code: 'CONSTRUCTION', name: 'Construcción', icon: 'construction' },
        { code: 'ELECTRICAL', name: 'Electricidad', icon: 'electrical_services' },
        { code: 'PLUMBING', name: 'Plomería', icon: 'plumbing' },
        { code: 'HVAC', name: 'Aire Acondicionado', icon: 'ac_unit' },
        { code: 'PAINTING', name: 'Pintura', icon: 'format_paint' },
        { code: 'CARPENTRY', name: 'Carpintería', icon: 'carpenter' },
        { code: 'WELDING', name: 'Soldadura', icon: 'hardware' },
        { code: 'LANDSCAPING', name: 'Jardinería', icon: 'grass' },
        { code: 'CLEANING', name: 'Limpieza', icon: 'cleaning_services' },
        { code: 'SECURITY', name: 'Seguridad', icon: 'security' },
        { code: 'IT_SERVICES', name: 'Servicios IT', icon: 'computer' },
        { code: 'CONSULTING', name: 'Consultoría', icon: 'support_agent' },
        { code: 'TRANSPORT', name: 'Transporte', icon: 'local_shipping' },
        { code: 'MAINTENANCE', name: 'Mantenimiento General', icon: 'build' },
        { code: 'OTHER', name: 'Otros', icon: 'more_horiz' },
      ];
      
      return res.json({
        success: true,
        data: specialties,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContractorController();
