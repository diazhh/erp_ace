const crmService = require('../services/crmService');

// ========== CLIENTES ==========

const getClients = async (req, res) => {
  try {
    const clients = await crmService.getClients(req.query);
    res.json(clients);
  } catch (error) {
    console.error('Error getting clients:', error);
    res.status(500).json({ message: error.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await crmService.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json({ message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    const client = await crmService.createClient(req.body, req.user.id);
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await crmService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const result = await crmService.deleteClient(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== CONTACTOS ==========

const getContacts = async (req, res) => {
  try {
    const contacts = await crmService.getContacts(req.params.clientId);
    res.json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = await crmService.createContact(req.params.clientId, req.body, req.user.id);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await crmService.updateContact(req.params.id, req.body);
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const result = await crmService.deleteContact(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== OPORTUNIDADES ==========

const getOpportunities = async (req, res) => {
  try {
    const opportunities = await crmService.getOpportunities(req.query);
    res.json(opportunities);
  } catch (error) {
    console.error('Error getting opportunities:', error);
    res.status(500).json({ message: error.message });
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await crmService.getOpportunityById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Oportunidad no encontrada' });
    }
    res.json(opportunity);
  } catch (error) {
    console.error('Error getting opportunity:', error);
    res.status(500).json({ message: error.message });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const opportunity = await crmService.createOpportunity(req.body, req.user.id);
    res.status(201).json(opportunity);
  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await crmService.updateOpportunity(req.params.id, req.body);
    res.json(opportunity);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const result = await crmService.deleteOpportunity(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== COTIZACIONES ==========

const getQuotes = async (req, res) => {
  try {
    const quotes = await crmService.getQuotes(req.query);
    res.json(quotes);
  } catch (error) {
    console.error('Error getting quotes:', error);
    res.status(500).json({ message: error.message });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await crmService.getQuoteById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.json(quote);
  } catch (error) {
    console.error('Error getting quote:', error);
    res.status(500).json({ message: error.message });
  }
};

const createQuote = async (req, res) => {
  try {
    const quote = await crmService.createQuote(req.body, req.user.id);
    res.status(201).json(quote);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateQuote = async (req, res) => {
  try {
    const quote = await crmService.updateQuote(req.params.id, req.body);
    res.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const result = await crmService.deleteQuote(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ message: error.message });
  }
};

const sendQuote = async (req, res) => {
  try {
    const quote = await crmService.sendQuote(req.params.id, req.user.id);
    res.json(quote);
  } catch (error) {
    console.error('Error sending quote:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== ACTIVIDADES ==========

const getActivities = async (req, res) => {
  try {
    const activities = await crmService.getActivities(req.query);
    res.json(activities);
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ message: error.message });
  }
};

const createActivity = async (req, res) => {
  try {
    const activity = await crmService.createActivity(req.body, req.user.id);
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activity = await crmService.updateActivity(req.params.id, req.body);
    res.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: error.message });
  }
};

const completeActivity = async (req, res) => {
  try {
    const activity = await crmService.completeActivity(req.params.id, req.user.id, req.body.outcome);
    res.json(activity);
  } catch (error) {
    console.error('Error completing activity:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const result = await crmService.deleteActivity(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== ESTADÍSTICAS ==========

const getStats = async (req, res) => {
  try {
    const stats = await crmService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting CRM stats:', error);
    res.status(500).json({ message: error.message });
  }
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
