const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');

// Todas las rutas requieren autenticación
router.use(authenticate);

// ==================== ESTADÍSTICAS GENERALES ====================
router.get('/stats', authorize('projects:read'), projectController.getGeneralStats);

// ==================== CATÁLOGOS ====================
router.get('/types', authorize('projects:read'), projectController.getProjectTypes);
router.get('/expense-types', authorize('projects:read'), projectController.getExpenseTypes);
router.get('/member-roles', authorize('projects:read'), projectController.getMemberRoles);

// ==================== PROYECTOS ====================

// CRUD de proyectos
router.post('/', authorize('projects:create'), projectController.create);
router.get('/', authorize('projects:read'), projectController.list);
router.get('/:id', authorize('projects:read'), projectController.getById);
router.get('/:id/full', authorize('projects:read'), projectController.getFullById);
router.put('/:id', authorize('projects:update'), projectController.update);
router.delete('/:id', authorize('projects:delete'), projectController.delete);

// Estadísticas de un proyecto específico
router.get('/:id/stats', authorize('projects:read'), projectController.getStats);

// ==================== MIEMBROS ====================

// Listar miembros del proyecto
router.get('/:id/members', authorize('projects:read'), projectController.listMembers);

// Agregar miembro
router.post('/:id/members', authorize('projects:update'), projectController.addMember);

// Actualizar miembro
router.put('/:id/members/:memberId', authorize('projects:update'), projectController.updateMember);

// Remover miembro
router.delete('/:id/members/:memberId', authorize('projects:update'), projectController.removeMember);

// ==================== HITOS ====================

// Listar hitos del proyecto
router.get('/:id/milestones', authorize('projects:read'), projectController.listMilestones);

// Crear hito
router.post('/:id/milestones', authorize('projects:update'), projectController.createMilestone);

// Actualizar hito
router.put('/:id/milestones/:milestoneId', authorize('projects:update'), projectController.updateMilestone);

// Completar hito
router.post('/:id/milestones/:milestoneId/complete', authorize('projects:update'), projectController.completeMilestone);

// Eliminar hito
router.delete('/:id/milestones/:milestoneId', authorize('projects:update'), projectController.deleteMilestone);

// ==================== GASTOS ====================

// Listar gastos del proyecto
router.get('/:id/expenses', authorize('projects:read'), projectController.listExpenses);

// Crear gasto
router.post('/:id/expenses', authorize('projects:create'), projectController.createExpense);

// Obtener gasto específico
router.get('/:id/expenses/:expenseId', authorize('projects:read'), projectController.getExpenseById);

// Aprobar gasto
router.post('/:id/expenses/:expenseId/approve', authorize('projects:approve'), projectController.approveExpense);

// Rechazar gasto
router.post('/:id/expenses/:expenseId/reject', authorize('projects:approve'), projectController.rejectExpense);

// Eliminar gasto
router.delete('/:id/expenses/:expenseId', authorize('projects:delete'), projectController.deleteExpense);

module.exports = router;
