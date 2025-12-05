const { Op } = require('sequelize');

/**
 * Generar código de incidente
 */
async function generateIncidentCode() {
  const { Incident } = require('../../../database/models');
  const year = new Date().getFullYear();
  
  const lastIncident = await Incident.findOne({
    where: { code: { [Op.like]: `INC-${year}-%` } },
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastIncident && lastIncident.code) {
    const match = lastIncident.code.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  
  return `INC-${year}-${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Generar código de inspección
 */
async function generateInspectionCode() {
  const { Inspection } = require('../../../database/models');
  const year = new Date().getFullYear();
  
  const lastInspection = await Inspection.findOne({
    where: { code: { [Op.like]: `INS-${year}-%` } },
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastInspection && lastInspection.code) {
    const match = lastInspection.code.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  
  return `INS-${year}-${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Generar código de capacitación
 */
async function generateTrainingCode() {
  const { Training } = require('../../../database/models');
  const year = new Date().getFullYear();
  
  const lastTraining = await Training.findOne({
    where: { code: { [Op.like]: `CAP-${year}-%` } },
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastTraining && lastTraining.code) {
    const match = lastTraining.code.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  
  return `CAP-${year}-${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Generar código de equipo de seguridad
 */
async function generateEquipmentCode() {
  const { SafetyEquipment } = require('../../../database/models');
  const year = new Date().getFullYear();
  
  const lastEquipment = await SafetyEquipment.findOne({
    where: { code: { [Op.like]: `EPP-${year}-%` } },
    order: [['createdAt', 'DESC']],
  });
  
  let nextNumber = 1;
  if (lastEquipment && lastEquipment.code) {
    const match = lastEquipment.code.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  
  return `EPP-${year}-${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Obtener estadísticas de HSE
 */
async function getHSEStats() {
  const { Incident, Inspection, Training, SafetyEquipment, TrainingAttendance } = require('../../../database/models');
  const { sequelize } = require('../../../database');
  
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  
  // Incidentes
  const totalIncidents = await Incident.count();
  const incidentsThisMonth = await Incident.count({
    where: { incidentDate: { [Op.gte]: startOfMonth } },
  });
  const incidentsThisYear = await Incident.count({
    where: { incidentDate: { [Op.gte]: startOfYear } },
  });
  const openIncidents = await Incident.count({
    where: { status: { [Op.notIn]: ['CLOSED', 'CANCELLED'] } },
  });
  const criticalIncidents = await Incident.count({
    where: { severity: 'CRITICAL', status: { [Op.notIn]: ['CLOSED', 'CANCELLED'] } },
  });
  
  // Días sin accidentes
  const lastAccident = await Incident.findOne({
    where: { incidentType: 'ACCIDENT' },
    order: [['incidentDate', 'DESC']],
  });
  const daysSinceLastAccident = lastAccident 
    ? Math.floor((today - new Date(lastAccident.incidentDate)) / (1000 * 60 * 60 * 24))
    : null;
  
  // Días perdidos
  const daysLostThisYear = await Incident.sum('daysLost', {
    where: { incidentDate: { [Op.gte]: startOfYear } },
  }) || 0;
  
  // Inspecciones
  const totalInspections = await Inspection.count();
  const inspectionsThisMonth = await Inspection.count({
    where: { scheduledDate: { [Op.gte]: startOfMonth } },
  });
  const pendingInspections = await Inspection.count({
    where: { status: 'SCHEDULED' },
  });
  const overdueInspections = await Inspection.count({
    where: { 
      status: 'SCHEDULED',
      scheduledDate: { [Op.lt]: today },
    },
  });
  const inspectionsWithNonConformities = await Inspection.count({
    where: { nonConformities: { [Op.gt]: 0 } },
  });
  
  // Capacitaciones
  const totalTrainings = await Training.count();
  const trainingsThisMonth = await Training.count({
    where: { scheduledDate: { [Op.gte]: startOfMonth } },
  });
  const upcomingTrainings = await Training.count({
    where: { 
      status: 'SCHEDULED',
      scheduledDate: { [Op.gte]: today },
    },
  });
  const completedTrainings = await Training.count({
    where: { status: 'COMPLETED' },
  });
  
  // Asistencias
  const totalAttendances = await TrainingAttendance.count({
    where: { status: 'ATTENDED' },
  });
  const passedAttendances = await TrainingAttendance.count({
    where: { passed: true },
  });
  
  // Equipos de seguridad
  const totalEquipment = await SafetyEquipment.count();
  const assignedEquipment = await SafetyEquipment.count({
    where: { status: 'ASSIGNED' },
  });
  const expiringEquipment = await SafetyEquipment.count({
    where: {
      expiryDate: {
        [Op.between]: [today, new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)],
      },
    },
  });
  const expiredEquipment = await SafetyEquipment.count({
    where: {
      expiryDate: { [Op.lt]: today },
      status: { [Op.ne]: 'DISPOSED' },
    },
  });
  
  // Incidentes por tipo
  const incidentsByType = await Incident.findAll({
    attributes: [
      'incidentType',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    where: { incidentDate: { [Op.gte]: startOfYear } },
    group: ['incidentType'],
    raw: true,
  });
  
  // Incidentes por severidad
  const incidentsBySeverity = await Incident.findAll({
    attributes: [
      'severity',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    where: { incidentDate: { [Op.gte]: startOfYear } },
    group: ['severity'],
    raw: true,
  });
  
  return {
    incidents: {
      total: totalIncidents,
      thisMonth: incidentsThisMonth,
      thisYear: incidentsThisYear,
      open: openIncidents,
      critical: criticalIncidents,
      daysSinceLastAccident,
      daysLostThisYear,
      byType: incidentsByType,
      bySeverity: incidentsBySeverity,
    },
    inspections: {
      total: totalInspections,
      thisMonth: inspectionsThisMonth,
      pending: pendingInspections,
      overdue: overdueInspections,
      withNonConformities: inspectionsWithNonConformities,
    },
    trainings: {
      total: totalTrainings,
      thisMonth: trainingsThisMonth,
      upcoming: upcomingTrainings,
      completed: completedTrainings,
      totalAttendances,
      passRate: totalAttendances > 0 ? ((passedAttendances / totalAttendances) * 100).toFixed(1) : 0,
    },
    equipment: {
      total: totalEquipment,
      assigned: assignedEquipment,
      expiringSoon: expiringEquipment,
      expired: expiredEquipment,
    },
  };
}

/**
 * Obtener alertas de HSE
 */
async function getHSEAlerts() {
  const { Incident, Inspection, Training, SafetyEquipment, TrainingAttendance } = require('../../../database/models');
  
  const today = new Date();
  const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const alerts = [];
  
  // Incidentes críticos abiertos
  const criticalIncidents = await Incident.findAll({
    where: { 
      severity: 'CRITICAL',
      status: { [Op.notIn]: ['CLOSED', 'CANCELLED'] },
    },
    limit: 5,
  });
  criticalIncidents.forEach(inc => {
    alerts.push({
      type: 'CRITICAL_INCIDENT',
      severity: 'high',
      message: `Incidente crítico abierto: ${inc.code} - ${inc.title}`,
      entityId: inc.id,
      entityType: 'incident',
    });
  });
  
  // Inspecciones vencidas
  const overdueInspections = await Inspection.findAll({
    where: {
      status: 'SCHEDULED',
      scheduledDate: { [Op.lt]: today },
    },
    limit: 5,
  });
  overdueInspections.forEach(ins => {
    alerts.push({
      type: 'OVERDUE_INSPECTION',
      severity: 'high',
      message: `Inspección vencida: ${ins.code} - ${ins.title}`,
      entityId: ins.id,
      entityType: 'inspection',
    });
  });
  
  // Inspecciones próximas (7 días)
  const upcomingInspections = await Inspection.findAll({
    where: {
      status: 'SCHEDULED',
      scheduledDate: { [Op.between]: [today, in7Days] },
    },
    limit: 5,
  });
  upcomingInspections.forEach(ins => {
    alerts.push({
      type: 'UPCOMING_INSPECTION',
      severity: 'medium',
      message: `Inspección próxima: ${ins.code} - ${ins.title}`,
      entityId: ins.id,
      entityType: 'inspection',
    });
  });
  
  // Equipos por vencer
  const expiringEquipment = await SafetyEquipment.findAll({
    where: {
      expiryDate: { [Op.between]: [today, in30Days] },
      status: { [Op.ne]: 'DISPOSED' },
    },
    limit: 5,
  });
  expiringEquipment.forEach(eq => {
    alerts.push({
      type: 'EXPIRING_EQUIPMENT',
      severity: 'medium',
      message: `Equipo por vencer: ${eq.code} - ${eq.name}`,
      entityId: eq.id,
      entityType: 'equipment',
    });
  });
  
  // Equipos vencidos
  const expiredEquipment = await SafetyEquipment.findAll({
    where: {
      expiryDate: { [Op.lt]: today },
      status: { [Op.ne]: 'DISPOSED' },
    },
    limit: 5,
  });
  expiredEquipment.forEach(eq => {
    alerts.push({
      type: 'EXPIRED_EQUIPMENT',
      severity: 'high',
      message: `Equipo vencido: ${eq.code} - ${eq.name}`,
      entityId: eq.id,
      entityType: 'equipment',
    });
  });
  
  // Capacitaciones próximas
  const upcomingTrainings = await Training.findAll({
    where: {
      status: 'SCHEDULED',
      scheduledDate: { [Op.between]: [today, in7Days] },
    },
    limit: 5,
  });
  upcomingTrainings.forEach(tr => {
    alerts.push({
      type: 'UPCOMING_TRAINING',
      severity: 'low',
      message: `Capacitación próxima: ${tr.code} - ${tr.title}`,
      entityId: tr.id,
      entityType: 'training',
    });
  });
  
  // Certificados por vencer
  const expiringCertificates = await TrainingAttendance.findAll({
    where: {
      certificateExpiryDate: { [Op.between]: [today, in30Days] },
    },
    include: [
      { association: 'employee', attributes: ['id', 'firstName', 'lastName'] },
      { association: 'training', attributes: ['id', 'code', 'title'] },
    ],
    limit: 5,
  });
  expiringCertificates.forEach(att => {
    alerts.push({
      type: 'EXPIRING_CERTIFICATE',
      severity: 'medium',
      message: `Certificado por vencer: ${att.employee?.firstName} ${att.employee?.lastName} - ${att.training?.title}`,
      entityId: att.id,
      entityType: 'certificate',
    });
  });
  
  return alerts.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

/**
 * Catálogos de HSE
 */
const catalogs = {
  incidentTypes: [
    { code: 'ACCIDENT', name: 'Accidente laboral' },
    { code: 'NEAR_MISS', name: 'Casi accidente' },
    { code: 'UNSAFE_CONDITION', name: 'Condición insegura' },
    { code: 'UNSAFE_ACT', name: 'Acto inseguro' },
    { code: 'ENVIRONMENTAL', name: 'Incidente ambiental' },
    { code: 'PROPERTY_DAMAGE', name: 'Daño a propiedad' },
    { code: 'OCCUPATIONAL_ILLNESS', name: 'Enfermedad ocupacional' },
    { code: 'FIRST_AID', name: 'Primeros auxilios' },
    { code: 'OTHER', name: 'Otro' },
  ],
  severities: [
    { code: 'LOW', name: 'Baja', color: '#4caf50' },
    { code: 'MEDIUM', name: 'Media', color: '#ff9800' },
    { code: 'HIGH', name: 'Alta', color: '#f44336' },
    { code: 'CRITICAL', name: 'Crítica', color: '#9c27b0' },
  ],
  incidentStatuses: [
    { code: 'REPORTED', name: 'Reportado' },
    { code: 'INVESTIGATING', name: 'En investigación' },
    { code: 'PENDING_ACTIONS', name: 'Pendiente de acciones' },
    { code: 'IN_PROGRESS', name: 'Acciones en progreso' },
    { code: 'CLOSED', name: 'Cerrado' },
    { code: 'CANCELLED', name: 'Cancelado' },
  ],
  inspectionTypes: [
    { code: 'WORKPLACE', name: 'Lugar de trabajo' },
    { code: 'EQUIPMENT', name: 'Equipos' },
    { code: 'VEHICLE', name: 'Vehículos' },
    { code: 'PPE', name: 'Equipos de protección personal' },
    { code: 'FIRE_SAFETY', name: 'Seguridad contra incendios' },
    { code: 'ELECTRICAL', name: 'Eléctrica' },
    { code: 'ENVIRONMENTAL', name: 'Ambiental' },
    { code: 'ERGONOMIC', name: 'Ergonómica' },
    { code: 'HOUSEKEEPING', name: 'Orden y limpieza' },
    { code: 'PRE_TASK', name: 'Pre-tarea' },
    { code: 'OTHER', name: 'Otra' },
  ],
  inspectionStatuses: [
    { code: 'SCHEDULED', name: 'Programada' },
    { code: 'IN_PROGRESS', name: 'En progreso' },
    { code: 'COMPLETED', name: 'Completada' },
    { code: 'CANCELLED', name: 'Cancelada' },
    { code: 'OVERDUE', name: 'Vencida' },
  ],
  inspectionResults: [
    { code: 'PASS', name: 'Aprobada', color: '#4caf50' },
    { code: 'FAIL', name: 'Reprobada', color: '#f44336' },
    { code: 'CONDITIONAL', name: 'Condicional', color: '#ff9800' },
    { code: 'PENDING', name: 'Pendiente', color: '#9e9e9e' },
  ],
  trainingTypes: [
    { code: 'INDUCTION', name: 'Inducción' },
    { code: 'SAFETY', name: 'Seguridad general' },
    { code: 'FIRE_SAFETY', name: 'Seguridad contra incendios' },
    { code: 'FIRST_AID', name: 'Primeros auxilios' },
    { code: 'PPE', name: 'Uso de EPP' },
    { code: 'HAZMAT', name: 'Materiales peligrosos' },
    { code: 'HEIGHTS', name: 'Trabajo en alturas' },
    { code: 'CONFINED_SPACES', name: 'Espacios confinados' },
    { code: 'ELECTRICAL', name: 'Seguridad eléctrica' },
    { code: 'ERGONOMICS', name: 'Ergonomía' },
    { code: 'ENVIRONMENTAL', name: 'Ambiental' },
    { code: 'DEFENSIVE_DRIVING', name: 'Manejo defensivo' },
    { code: 'EQUIPMENT_OPERATION', name: 'Operación de equipos' },
    { code: 'EMERGENCY_RESPONSE', name: 'Respuesta a emergencias' },
    { code: 'OTHER', name: 'Otra' },
  ],
  trainingStatuses: [
    { code: 'SCHEDULED', name: 'Programada' },
    { code: 'IN_PROGRESS', name: 'En progreso' },
    { code: 'COMPLETED', name: 'Completada' },
    { code: 'CANCELLED', name: 'Cancelada' },
    { code: 'POSTPONED', name: 'Pospuesta' },
  ],
  attendanceStatuses: [
    { code: 'REGISTERED', name: 'Registrado' },
    { code: 'CONFIRMED', name: 'Confirmado' },
    { code: 'ATTENDED', name: 'Asistió' },
    { code: 'ABSENT', name: 'Ausente' },
    { code: 'CANCELLED', name: 'Cancelado' },
  ],
  equipmentTypes: [
    { code: 'HELMET', name: 'Casco' },
    { code: 'SAFETY_GLASSES', name: 'Lentes de seguridad' },
    { code: 'FACE_SHIELD', name: 'Careta' },
    { code: 'EAR_PLUGS', name: 'Tapones auditivos' },
    { code: 'EAR_MUFFS', name: 'Orejeras' },
    { code: 'RESPIRATOR', name: 'Respirador' },
    { code: 'DUST_MASK', name: 'Mascarilla' },
    { code: 'GLOVES', name: 'Guantes' },
    { code: 'SAFETY_BOOTS', name: 'Botas de seguridad' },
    { code: 'SAFETY_VEST', name: 'Chaleco reflectivo' },
    { code: 'HARNESS', name: 'Arnés' },
    { code: 'LANYARD', name: 'Línea de vida' },
    { code: 'FIRE_EXTINGUISHER', name: 'Extintor' },
    { code: 'FIRST_AID_KIT', name: 'Botiquín' },
    { code: 'SAFETY_CONE', name: 'Cono de seguridad' },
    { code: 'SAFETY_TAPE', name: 'Cinta de seguridad' },
    { code: 'EMERGENCY_LIGHT', name: 'Luz de emergencia' },
    { code: 'SPILL_KIT', name: 'Kit de derrames' },
    { code: 'OTHER', name: 'Otro' },
  ],
  equipmentStatuses: [
    { code: 'AVAILABLE', name: 'Disponible' },
    { code: 'ASSIGNED', name: 'Asignado' },
    { code: 'IN_USE', name: 'En uso' },
    { code: 'MAINTENANCE', name: 'En mantenimiento' },
    { code: 'EXPIRED', name: 'Vencido' },
    { code: 'DAMAGED', name: 'Dañado' },
    { code: 'DISPOSED', name: 'Descartado' },
  ],
  equipmentConditions: [
    { code: 'NEW', name: 'Nuevo' },
    { code: 'GOOD', name: 'Bueno' },
    { code: 'FAIR', name: 'Regular' },
    { code: 'POOR', name: 'Malo' },
  ],
};

module.exports = {
  generateIncidentCode,
  generateInspectionCode,
  generateTrainingCode,
  generateEquipmentCode,
  getHSEStats,
  getHSEAlerts,
  catalogs,
};
