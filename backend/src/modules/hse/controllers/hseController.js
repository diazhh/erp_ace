const { Op } = require('sequelize');
const { sequelize } = require('../../../database');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');
const hseService = require('../services/hseService');

class HSEController {
  // ==================== INCIDENTS ====================

  /**
   * Listar incidentes
   */
  async listIncidents(req, res, next) {
    try {
      const { Incident, Employee, Project, Vehicle } = require('../../../database/models');
      const { incidentType, severity, status, startDate, endDate, projectId, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (incidentType) whereClause.incidentType = incidentType;
      if (severity) whereClause.severity = severity;
      if (status) whereClause.status = status;
      if (projectId) whereClause.projectId = projectId;
      if (startDate && endDate) {
        whereClause.incidentDate = { [Op.between]: [startDate, endDate] };
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await Incident.findAndCountAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'reportedBy', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Employee, as: 'affectedEmployee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
        ],
        order: [['incidentDate', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener incidente por ID
   */
  async getIncident(req, res, next) {
    try {
      const { Incident, Employee, Project, Vehicle, User } = require('../../../database/models');
      const { id } = req.params;
      
      const incident = await Incident.findByPk(id, {
        include: [
          { model: Employee, as: 'reportedBy', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Employee, as: 'affectedEmployee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Employee, as: 'investigatedBy', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Employee, as: 'closedBy', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: Vehicle, as: 'vehicle', attributes: ['id', 'code', 'plate', 'brand', 'model'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
        ],
      });
      
      if (!incident) throw new NotFoundError('Incidente no encontrado');
      
      return res.json({ success: true, data: incident });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear incidente
   */
  async createIncident(req, res, next) {
    try {
      const { Incident } = require('../../../database/models');
      
      const code = await hseService.generateIncidentCode();
      const incident = await Incident.create({
        ...req.body,
        code,
        createdBy: req.user.id,
      });
      
      return res.status(201).json({
        success: true,
        data: incident,
        message: 'Incidente reportado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar incidente
   */
  async updateIncident(req, res, next) {
    try {
      const { Incident } = require('../../../database/models');
      const { id } = req.params;
      
      const incident = await Incident.findByPk(id);
      if (!incident) throw new NotFoundError('Incidente no encontrado');
      
      await incident.update(req.body);
      
      return res.json({
        success: true,
        data: incident,
        message: 'Incidente actualizado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Iniciar investigación
   */
  async investigateIncident(req, res, next) {
    try {
      const { Incident } = require('../../../database/models');
      const { id } = req.params;
      
      const incident = await Incident.findByPk(id);
      if (!incident) throw new NotFoundError('Incidente no encontrado');
      
      if (incident.status !== 'REPORTED') {
        throw new BadRequestError('Solo se pueden investigar incidentes reportados');
      }
      
      await incident.update({
        status: 'INVESTIGATING',
        investigatedById: req.user.employeeId || req.user.id,
        investigatedAt: new Date(),
      });
      
      return res.json({
        success: true,
        data: incident,
        message: 'Investigación iniciada',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cerrar incidente
   */
  async closeIncident(req, res, next) {
    try {
      const { Incident } = require('../../../database/models');
      const { id } = req.params;
      const { closureNotes } = req.body;
      
      const incident = await Incident.findByPk(id);
      if (!incident) throw new NotFoundError('Incidente no encontrado');
      
      if (incident.status === 'CLOSED') {
        throw new BadRequestError('El incidente ya está cerrado');
      }
      
      await incident.update({
        status: 'CLOSED',
        closedById: req.user.employeeId || req.user.id,
        closedAt: new Date(),
        closureNotes,
      });
      
      return res.json({
        success: true,
        data: incident,
        message: 'Incidente cerrado',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== INSPECTIONS ====================

  /**
   * Listar inspecciones
   */
  async listInspections(req, res, next) {
    try {
      const { Inspection, Employee, Project, Vehicle } = require('../../../database/models');
      const { inspectionType, status, result, startDate, endDate, projectId, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (inspectionType) whereClause.inspectionType = inspectionType;
      if (status) whereClause.status = status;
      if (result) whereClause.result = result;
      if (projectId) whereClause.projectId = projectId;
      if (startDate && endDate) {
        whereClause.scheduledDate = { [Op.between]: [startDate, endDate] };
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await Inspection.findAndCountAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'inspector', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
        ],
        order: [['scheduledDate', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener inspección por ID
   */
  async getInspection(req, res, next) {
    try {
      const { Inspection, Employee, Project, Vehicle, Warehouse, User } = require('../../../database/models');
      const { id } = req.params;
      
      const inspection = await Inspection.findByPk(id, {
        include: [
          { model: Employee, as: 'inspector', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Employee, as: 'approvedBy', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: Vehicle, as: 'vehicle', attributes: ['id', 'code', 'plate', 'brand', 'model'] },
          { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
        ],
      });
      
      if (!inspection) throw new NotFoundError('Inspección no encontrada');
      
      return res.json({ success: true, data: inspection });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear inspección
   */
  async createInspection(req, res, next) {
    try {
      const { Inspection } = require('../../../database/models');
      
      const code = await hseService.generateInspectionCode();
      const inspection = await Inspection.create({
        ...req.body,
        code,
        createdBy: req.user.id,
      });
      
      return res.status(201).json({
        success: true,
        data: inspection,
        message: 'Inspección programada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar inspección
   */
  async updateInspection(req, res, next) {
    try {
      const { Inspection } = require('../../../database/models');
      const { id } = req.params;
      
      const inspection = await Inspection.findByPk(id);
      if (!inspection) throw new NotFoundError('Inspección no encontrada');
      
      await inspection.update(req.body);
      
      return res.json({
        success: true,
        data: inspection,
        message: 'Inspección actualizada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Completar inspección
   */
  async completeInspection(req, res, next) {
    try {
      const { Inspection } = require('../../../database/models');
      const { id } = req.params;
      const { result, score, findings, nonConformities, recommendations, checklist } = req.body;
      
      const inspection = await Inspection.findByPk(id);
      if (!inspection) throw new NotFoundError('Inspección no encontrada');
      
      await inspection.update({
        status: 'COMPLETED',
        completedDate: new Date(),
        result,
        score,
        findings,
        nonConformities,
        recommendations,
        checklist,
        correctiveActionsRequired: nonConformities > 0,
      });
      
      return res.json({
        success: true,
        data: inspection,
        message: 'Inspección completada',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== TRAININGS ====================

  /**
   * Listar capacitaciones
   */
  async listTrainings(req, res, next) {
    try {
      const { Training, Employee, Project, TrainingAttendance } = require('../../../database/models');
      const { trainingType, status, startDate, endDate, projectId, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (trainingType) whereClause.trainingType = trainingType;
      if (status) whereClause.status = status;
      if (projectId) whereClause.projectId = projectId;
      if (startDate && endDate) {
        whereClause.scheduledDate = { [Op.between]: [startDate, endDate] };
      }
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await Training.findAndCountAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'instructor', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { 
            model: TrainingAttendance, 
            as: 'attendances',
            attributes: ['id', 'status'],
          },
        ],
        order: [['scheduledDate', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      // Agregar conteo de participantes
      const data = rows.map(t => ({
        ...t.toJSON(),
        participantCount: t.attendances?.length || 0,
        attendedCount: t.attendances?.filter(a => a.status === 'ATTENDED').length || 0,
      }));
      
      return res.json({
        success: true,
        data,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener capacitación por ID
   */
  async getTraining(req, res, next) {
    try {
      const { Training, Employee, Project, TrainingAttendance, User } = require('../../../database/models');
      const { id } = req.params;
      
      const training = await Training.findByPk(id, {
        include: [
          { model: Employee, as: 'instructor', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
          { 
            model: TrainingAttendance, 
            as: 'attendances',
            include: [
              { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
            ],
          },
        ],
      });
      
      if (!training) throw new NotFoundError('Capacitación no encontrada');
      
      return res.json({ success: true, data: training });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear capacitación
   */
  async createTraining(req, res, next) {
    try {
      const { Training } = require('../../../database/models');
      
      const code = await hseService.generateTrainingCode();
      const training = await Training.create({
        ...req.body,
        code,
        createdBy: req.user.id,
      });
      
      return res.status(201).json({
        success: true,
        data: training,
        message: 'Capacitación programada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar capacitación
   */
  async updateTraining(req, res, next) {
    try {
      const { Training } = require('../../../database/models');
      const { id } = req.params;
      
      const training = await Training.findByPk(id);
      if (!training) throw new NotFoundError('Capacitación no encontrada');
      
      await training.update(req.body);
      
      return res.json({
        success: true,
        data: training,
        message: 'Capacitación actualizada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Registrar asistencia
   */
  async registerAttendance(req, res, next) {
    try {
      const { Training, TrainingAttendance, Employee } = require('../../../database/models');
      const { id } = req.params;
      const { employeeIds } = req.body;
      
      const training = await Training.findByPk(id);
      if (!training) throw new NotFoundError('Capacitación no encontrada');
      
      const attendances = [];
      for (const employeeId of employeeIds) {
        const employee = await Employee.findByPk(employeeId);
        if (!employee) continue;
        
        const [attendance] = await TrainingAttendance.findOrCreate({
          where: { trainingId: id, employeeId },
          defaults: { trainingId: id, employeeId, status: 'REGISTERED' },
        });
        attendances.push(attendance);
      }
      
      return res.json({
        success: true,
        data: attendances,
        message: 'Asistencia registrada',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar asistencia
   */
  async updateAttendance(req, res, next) {
    try {
      const { TrainingAttendance, Training } = require('../../../database/models');
      const { id, attendanceId } = req.params;
      const { status, evaluationScore, passed, certificateIssued, certificateNumber, certificateExpiryDate } = req.body;
      
      const attendance = await TrainingAttendance.findOne({
        where: { id: attendanceId, trainingId: id },
      });
      if (!attendance) throw new NotFoundError('Asistencia no encontrada');
      
      // Si se emite certificado, calcular fecha de vencimiento
      let expiryDate = certificateExpiryDate;
      if (certificateIssued && !expiryDate) {
        const training = await Training.findByPk(id);
        if (training?.certificateValidityMonths) {
          const date = new Date();
          date.setMonth(date.getMonth() + training.certificateValidityMonths);
          expiryDate = date.toISOString().split('T')[0];
        }
      }
      
      await attendance.update({
        status,
        evaluationScore,
        passed,
        certificateIssued,
        certificateNumber,
        certificateExpiryDate: expiryDate,
      });
      
      return res.json({
        success: true,
        data: attendance,
        message: 'Asistencia actualizada',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Completar capacitación
   */
  async completeTraining(req, res, next) {
    try {
      const { Training } = require('../../../database/models');
      const { id } = req.params;
      
      const training = await Training.findByPk(id);
      if (!training) throw new NotFoundError('Capacitación no encontrada');
      
      await training.update({ status: 'COMPLETED' });
      
      return res.json({
        success: true,
        data: training,
        message: 'Capacitación completada',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== SAFETY EQUIPMENT ====================

  /**
   * Listar equipos de seguridad
   */
  async listEquipment(req, res, next) {
    try {
      const { SafetyEquipment, Employee, Project, Warehouse } = require('../../../database/models');
      const { equipmentType, status, assignedToId, projectId, page = 1, limit = 20 } = req.query;
      
      const whereClause = {};
      if (equipmentType) whereClause.equipmentType = equipmentType;
      if (status) whereClause.status = status;
      if (assignedToId) whereClause.assignedToId = assignedToId;
      if (projectId) whereClause.projectId = projectId;
      
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      const { count, rows } = await SafetyEquipment.findAndCountAll({
        where: whereClause,
        include: [
          { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name'] },
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
      });
      
      return res.json({
        success: true,
        data: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener equipo por ID
   */
  async getEquipment(req, res, next) {
    try {
      const { SafetyEquipment, Employee, Project, Warehouse, User } = require('../../../database/models');
      const { id } = req.params;
      
      const equipment = await SafetyEquipment.findByPk(id, {
        include: [
          { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'employeeCode'] },
          { model: Project, as: 'project', attributes: ['id', 'code', 'name'] },
          { model: Warehouse, as: 'warehouse', attributes: ['id', 'code', 'name'] },
          { model: User, as: 'creator', attributes: ['id', 'username'] },
        ],
      });
      
      if (!equipment) throw new NotFoundError('Equipo no encontrado');
      
      return res.json({ success: true, data: equipment });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crear equipo
   */
  async createEquipment(req, res, next) {
    try {
      const { SafetyEquipment } = require('../../../database/models');
      
      const code = await hseService.generateEquipmentCode();
      const equipment = await SafetyEquipment.create({
        ...req.body,
        code,
        createdBy: req.user.id,
      });
      
      return res.status(201).json({
        success: true,
        data: equipment,
        message: 'Equipo registrado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar equipo
   */
  async updateEquipment(req, res, next) {
    try {
      const { SafetyEquipment } = require('../../../database/models');
      const { id } = req.params;
      
      const equipment = await SafetyEquipment.findByPk(id);
      if (!equipment) throw new NotFoundError('Equipo no encontrado');
      
      await equipment.update(req.body);
      
      return res.json({
        success: true,
        data: equipment,
        message: 'Equipo actualizado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Asignar equipo a empleado
   */
  async assignEquipment(req, res, next) {
    try {
      const { SafetyEquipment, Employee } = require('../../../database/models');
      const { id } = req.params;
      const { employeeId } = req.body;
      
      const equipment = await SafetyEquipment.findByPk(id);
      if (!equipment) throw new NotFoundError('Equipo no encontrado');
      
      const employee = await Employee.findByPk(employeeId);
      if (!employee) throw new NotFoundError('Empleado no encontrado');
      
      await equipment.update({
        assignedToId: employeeId,
        assignedDate: new Date(),
        status: 'ASSIGNED',
      });
      
      return res.json({
        success: true,
        data: equipment,
        message: 'Equipo asignado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Devolver equipo
   */
  async returnEquipment(req, res, next) {
    try {
      const { SafetyEquipment } = require('../../../database/models');
      const { id } = req.params;
      const { condition, notes } = req.body;
      
      const equipment = await SafetyEquipment.findByPk(id);
      if (!equipment) throw new NotFoundError('Equipo no encontrado');
      
      await equipment.update({
        assignedToId: null,
        assignedDate: null,
        status: 'AVAILABLE',
        condition: condition || equipment.condition,
        notes: notes || equipment.notes,
      });
      
      return res.json({
        success: true,
        data: equipment,
        message: 'Equipo devuelto correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== STATS & CATALOGS ====================

  /**
   * Obtener estadísticas de HSE
   */
  async getStats(req, res, next) {
    try {
      const stats = await hseService.getHSEStats();
      return res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener alertas de HSE
   */
  async getAlerts(req, res, next) {
    try {
      const alerts = await hseService.getHSEAlerts();
      return res.json({ success: true, data: alerts });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener catálogos
   */
  async getCatalogs(req, res, next) {
    try {
      return res.json({ success: true, data: hseService.catalogs });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HSEController();
