const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ========== ESTADÍSTICAS ==========
router.get('/stats', authorize('crm:read'), crmController.getStats);

// ========== CLIENTES ==========
router.get('/clients', authorize('crm:read'), crmController.getClients);
router.get('/clients/:id', authorize('crm:read'), crmController.getClientById);
router.post('/clients', authorize('crm:create'), crmController.createClient);
router.put('/clients/:id', authorize('crm:update'), crmController.updateClient);
router.delete('/clients/:id', authorize('crm:delete'), crmController.deleteClient);

// ========== CONTACTOS ==========
router.get('/clients/:clientId/contacts', authorize('crm:read'), crmController.getContacts);
router.post('/clients/:clientId/contacts', authorize('crm:create'), crmController.createContact);
router.put('/contacts/:id', authorize('crm:update'), crmController.updateContact);
router.delete('/contacts/:id', authorize('crm:delete'), crmController.deleteContact);

// ========== OPORTUNIDADES ==========
router.get('/opportunities', authorize('crm:read'), crmController.getOpportunities);
router.get('/opportunities/:id', authorize('crm:read'), crmController.getOpportunityById);
router.post('/opportunities', authorize('crm:create'), crmController.createOpportunity);
router.put('/opportunities/:id', authorize('crm:update'), crmController.updateOpportunity);
router.delete('/opportunities/:id', authorize('crm:delete'), crmController.deleteOpportunity);

// ========== COTIZACIONES ==========
router.get('/quotes', authorize('crm:read'), crmController.getQuotes);
router.get('/quotes/:id', authorize('crm:read'), crmController.getQuoteById);
router.post('/quotes', authorize('crm:create'), crmController.createQuote);
router.put('/quotes/:id', authorize('crm:update'), crmController.updateQuote);
router.delete('/quotes/:id', authorize('crm:delete'), crmController.deleteQuote);
router.post('/quotes/:id/send', authorize('crm:update'), crmController.sendQuote);

// ========== ACTIVIDADES ==========
router.get('/activities', authorize('crm:read'), crmController.getActivities);
router.post('/activities', authorize('crm:create'), crmController.createActivity);
router.put('/activities/:id', authorize('crm:update'), crmController.updateActivity);
router.post('/activities/:id/complete', authorize('crm:update'), crmController.completeActivity);
router.delete('/activities/:id', authorize('crm:delete'), crmController.deleteActivity);

module.exports = router;
