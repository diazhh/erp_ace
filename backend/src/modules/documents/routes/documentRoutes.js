const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== CATALOGS & STATS ====================
router.get('/catalogs', documentController.getCatalogs);
router.get('/stats', authorize('documents:read'), documentController.getStats);
router.get('/expiring', authorize('documents:read'), documentController.getExpiringDocuments);

// ==================== CATEGORIES ====================
router.get('/categories', authorize('documents:read'), documentController.listCategories);
router.get('/categories/:id', authorize('documents:read'), documentController.getCategory);
router.post('/categories', authorize('documents:create'), documentController.createCategory);
router.put('/categories/:id', authorize('documents:update'), documentController.updateCategory);
router.delete('/categories/:id', authorize('documents:delete'), documentController.deleteCategory);

// ==================== DOCUMENTS ====================
router.get('/', authorize('documents:read'), documentController.listDocuments);
router.get('/:id', authorize('documents:read'), documentController.getDocument);
router.post('/', authorize('documents:create'), documentController.createDocument);
router.put('/:id', authorize('documents:update'), documentController.updateDocument);
router.delete('/:id', authorize('documents:delete'), documentController.deleteDocument);

// ==================== WORKFLOW ====================
router.post('/:id/submit', authorize('documents:update'), documentController.submitForReview);
router.post('/:id/approve', authorize('documents:approve'), documentController.approveDocument);
router.post('/:id/reject', authorize('documents:approve'), documentController.rejectDocument);
router.post('/:id/archive', authorize('documents:update'), documentController.archiveDocument);

// ==================== VERSIONS ====================
router.post('/:id/versions', authorize('documents:update'), documentController.createVersion);

// ==================== SHARING ====================
router.post('/:id/share', authorize('documents:share'), documentController.shareDocument);
router.delete('/:id/share/:shareId', authorize('documents:share'), documentController.removeShare);

module.exports = router;
