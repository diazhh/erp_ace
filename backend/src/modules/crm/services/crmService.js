const { Op } = require('sequelize');
const { sequelize } = require('../../../database');
const models = require('../../../database/models');

const {
  Client,
  ClientContact,
  Opportunity,
  CrmQuote,
  CrmQuoteItem,
  CrmActivity,
  Project,
  User,
} = models;

// ========== CLIENTES ==========

const getClients = async (filters = {}) => {
  const where = {};
  
  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = filters.category;
  if (filters.clientType) where.clientType = filters.clientType;
  if (filters.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters.search) {
    where[Op.or] = [
      { companyName: { [Op.iLike]: `%${filters.search}%` } },
      { tradeName: { [Op.iLike]: `%${filters.search}%` } },
      { code: { [Op.iLike]: `%${filters.search}%` } },
      { email: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const clients = await Client.findAll({
    where,
    include: [
      { model: User, as: 'assignedTo', attributes: ['id', 'username', 'email'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return clients;
};

const getClientById = async (id) => {
  const client = await Client.findByPk(id, {
    include: [
      { model: User, as: 'assignedTo', attributes: ['id', 'username', 'email'] },
      { model: ClientContact, as: 'contacts' },
      { 
        model: Opportunity, 
        as: 'opportunities',
        include: [{ model: User, as: 'assignedTo', attributes: ['id', 'username'] }],
      },
      { 
        model: CrmQuote, 
        as: 'quotes',
        include: [{ model: CrmQuoteItem, as: 'items' }],
      },
    ],
  });

  return client;
};

const createClient = async (data, userId) => {
  // Generar código único
  const lastClient = await Client.findOne({
    order: [['code', 'DESC']],
    where: { code: { [Op.like]: 'CLI-%' } },
  });
  
  let nextNumber = 1;
  if (lastClient) {
    const match = lastClient.code.match(/CLI-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  const code = `CLI-${String(nextNumber).padStart(4, '0')}`;

  const client = await Client.create({
    ...data,
    code,
    createdBy: userId,
  });

  return client;
};

const updateClient = async (id, data) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error('Cliente no encontrado');

  await client.update(data);
  return client;
};

const deleteClient = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error('Cliente no encontrado');

  await client.destroy();
  return { message: 'Cliente eliminado correctamente' };
};

// ========== CONTACTOS ==========

const getContacts = async (clientId) => {
  const contacts = await ClientContact.findAll({
    where: { clientId },
    order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']],
  });
  return contacts;
};

const createContact = async (clientId, data, userId) => {
  // Si es primario, quitar el flag de otros
  if (data.isPrimary) {
    await ClientContact.update(
      { isPrimary: false },
      { where: { clientId } }
    );
  }

  const contact = await ClientContact.create({
    ...data,
    clientId,
    createdBy: userId,
  });

  return contact;
};

const updateContact = async (id, data) => {
  const contact = await ClientContact.findByPk(id);
  if (!contact) throw new Error('Contacto no encontrado');

  // Si es primario, quitar el flag de otros
  if (data.isPrimary) {
    await ClientContact.update(
      { isPrimary: false },
      { where: { clientId: contact.clientId, id: { [Op.ne]: id } } }
    );
  }

  await contact.update(data);
  return contact;
};

const deleteContact = async (id) => {
  const contact = await ClientContact.findByPk(id);
  if (!contact) throw new Error('Contacto no encontrado');

  await contact.destroy();
  return { message: 'Contacto eliminado correctamente' };
};

// ========== OPORTUNIDADES ==========

const getOpportunities = async (filters = {}) => {
  const where = {};
  
  if (filters.stage) where.stage = filters.stage;
  if (filters.clientId) where.clientId = filters.clientId;
  if (filters.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters.priority) where.priority = filters.priority;
  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.search}%` } },
      { code: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const opportunities = await Opportunity.findAll({
    where,
    include: [
      { model: Client, as: 'client', attributes: ['id', 'code', 'companyName', 'tradeName'] },
      { model: User, as: 'assignedTo', attributes: ['id', 'username', 'email'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return opportunities;
};

const getOpportunityById = async (id) => {
  const opportunity = await Opportunity.findByPk(id, {
    include: [
      { model: Client, as: 'client' },
      { model: ClientContact, as: 'contact' },
      { model: User, as: 'assignedTo', attributes: ['id', 'username', 'email'] },
      { model: Project, as: 'project' },
      { 
        model: CrmQuote, 
        as: 'quotes',
        include: [{ model: CrmQuoteItem, as: 'items' }],
      },
    ],
  });

  return opportunity;
};

const createOpportunity = async (data, userId) => {
  // Generar código único
  const lastOpp = await Opportunity.findOne({
    order: [['code', 'DESC']],
    where: { code: { [Op.like]: 'OPP-%' } },
  });
  
  let nextNumber = 1;
  if (lastOpp) {
    const match = lastOpp.code.match(/OPP-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  const code = `OPP-${String(nextNumber).padStart(4, '0')}`;

  const opportunity = await Opportunity.create({
    ...data,
    code,
    createdBy: userId,
  });

  return opportunity;
};

const updateOpportunity = async (id, data) => {
  const opportunity = await Opportunity.findByPk(id);
  if (!opportunity) throw new Error('Oportunidad no encontrada');

  // Si cambia a WON o LOST, registrar fecha
  if (data.stage === 'WON' || data.stage === 'LOST') {
    data.actualCloseDate = new Date();
  }

  await opportunity.update(data);
  return opportunity;
};

const deleteOpportunity = async (id) => {
  const opportunity = await Opportunity.findByPk(id);
  if (!opportunity) throw new Error('Oportunidad no encontrada');

  await opportunity.destroy();
  return { message: 'Oportunidad eliminada correctamente' };
};

// ========== COTIZACIONES ==========

const getQuotes = async (filters = {}) => {
  const where = {};
  
  if (filters.status) where.status = filters.status;
  if (filters.clientId) where.clientId = filters.clientId;
  if (filters.opportunityId) where.opportunityId = filters.opportunityId;
  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.search}%` } },
      { code: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const quotes = await CrmQuote.findAll({
    where,
    include: [
      { model: Client, as: 'client', attributes: ['id', 'code', 'companyName', 'tradeName'] },
      { model: Opportunity, as: 'opportunity', attributes: ['id', 'code', 'title'] },
      { model: User, as: 'assignedTo', attributes: ['id', 'username'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return quotes;
};

const getQuoteById = async (id) => {
  const quote = await CrmQuote.findByPk(id, {
    include: [
      { model: Client, as: 'client' },
      { model: Opportunity, as: 'opportunity' },
      { model: ClientContact, as: 'contact' },
      { model: User, as: 'assignedTo', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'sender', attributes: ['id', 'username'] },
      { model: CrmQuoteItem, as: 'items' },
    ],
  });

  return quote;
};

const createQuote = async (data, userId) => {
  // Generar código único
  const lastQuote = await CrmQuote.findOne({
    order: [['code', 'DESC']],
    where: { code: { [Op.like]: 'COT-%' } },
  });
  
  let nextNumber = 1;
  if (lastQuote) {
    const match = lastQuote.code.match(/COT-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  const code = `COT-${String(nextNumber).padStart(4, '0')}`;

  const { items, ...quoteData } = data;

  const quote = await CrmQuote.create({
    ...quoteData,
    code,
    createdBy: userId,
  });

  // Crear items si existen
  if (items && items.length > 0) {
    await Promise.all(items.map((item, index) => 
      CrmQuoteItem.create({
        ...item,
        quoteId: quote.id,
        lineNumber: index + 1,
      })
    ));

    // Recalcular totales
    await recalculateQuoteTotals(quote.id);
  }

  return getQuoteById(quote.id);
};

const updateQuote = async (id, data) => {
  const quote = await CrmQuote.findByPk(id);
  if (!quote) throw new Error('Cotización no encontrada');

  const { items, ...quoteData } = data;

  await quote.update(quoteData);

  // Actualizar items si se proporcionan
  if (items) {
    // Eliminar items existentes
    await CrmQuoteItem.destroy({ where: { quoteId: id } });
    
    // Crear nuevos items
    await Promise.all(items.map((item, index) => 
      CrmQuoteItem.create({
        ...item,
        quoteId: id,
        lineNumber: index + 1,
      })
    ));

    // Recalcular totales
    await recalculateQuoteTotals(id);
  }

  return getQuoteById(id);
};

const recalculateQuoteTotals = async (quoteId) => {
  const items = await CrmQuoteItem.findAll({ where: { quoteId } });
  
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
  
  const quote = await CrmQuote.findByPk(quoteId);
  const discountAmount = subtotal * (parseFloat(quote.discountPercent || 0) / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (parseFloat(quote.taxPercent || 0) / 100);
  const total = afterDiscount + taxAmount;

  await quote.update({
    subtotal,
    discountAmount,
    taxAmount,
    total,
  });
};

const deleteQuote = async (id) => {
  const quote = await CrmQuote.findByPk(id);
  if (!quote) throw new Error('Cotización no encontrada');

  await quote.destroy();
  return { message: 'Cotización eliminada correctamente' };
};

const sendQuote = async (id, userId) => {
  const quote = await CrmQuote.findByPk(id);
  if (!quote) throw new Error('Cotización no encontrada');

  await quote.update({
    status: 'SENT',
    sentAt: new Date(),
    sentBy: userId,
  });

  return quote;
};

// ========== ACTIVIDADES ==========

const getActivities = async (filters = {}) => {
  const where = {};
  
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.entityId) where.entityId = filters.entityId;
  if (filters.activityType) where.activityType = filters.activityType;
  if (filters.status) where.status = filters.status;
  if (filters.assignedToId) where.assignedToId = filters.assignedToId;

  const activities = await CrmActivity.findAll({
    where,
    include: [
      { model: ClientContact, as: 'contact' },
      { model: User, as: 'assignedTo', attributes: ['id', 'username'] },
    ],
    order: [['activityDate', 'DESC']],
  });

  return activities;
};

const createActivity = async (data, userId) => {
  const activity = await CrmActivity.create({
    ...data,
    createdBy: userId,
  });

  return activity;
};

const updateActivity = async (id, data) => {
  const activity = await CrmActivity.findByPk(id);
  if (!activity) throw new Error('Actividad no encontrada');

  await activity.update(data);
  return activity;
};

const completeActivity = async (id, userId, outcome) => {
  const activity = await CrmActivity.findByPk(id);
  if (!activity) throw new Error('Actividad no encontrada');

  await activity.update({
    status: 'COMPLETED',
    completedDate: new Date(),
    completedBy: userId,
    outcome,
  });

  return activity;
};

const deleteActivity = async (id) => {
  const activity = await CrmActivity.findByPk(id);
  if (!activity) throw new Error('Actividad no encontrada');

  await activity.destroy();
  return { message: 'Actividad eliminada correctamente' };
};

// ========== ESTADÍSTICAS ==========

const getStats = async () => {
  const [
    totalClients,
    activeClients,
    totalOpportunities,
    openOpportunities,
    totalQuotes,
    pendingQuotes,
  ] = await Promise.all([
    Client.count(),
    Client.count({ where: { status: 'ACTIVE' } }),
    Opportunity.count(),
    Opportunity.count({ where: { stage: { [Op.notIn]: ['WON', 'LOST'] } } }),
    CrmQuote.count(),
    CrmQuote.count({ where: { status: { [Op.in]: ['DRAFT', 'SENT'] } } }),
  ]);

  // Pipeline por etapa
  const pipelineByStage = await Opportunity.findAll({
    attributes: [
      'stage',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('estimated_value')), 'value'],
    ],
    group: ['stage'],
    raw: true,
  });

  return {
    totalClients,
    activeClients,
    totalOpportunities,
    openOpportunities,
    totalQuotes,
    pendingQuotes,
    pipelineByStage,
  };
};

module.exports = {
  // Clientes
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  // Contactos
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  // Oportunidades
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  // Cotizaciones
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  sendQuote,
  // Actividades
  getActivities,
  createActivity,
  updateActivity,
  completeActivity,
  deleteActivity,
  // Estadísticas
  getStats,
};
