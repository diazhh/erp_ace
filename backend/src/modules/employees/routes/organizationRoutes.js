const express = require('express');
const { body, param, query } = require('express-validator');
const organizationController = require('../controllers/organizationController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');
const validate = require('../../../shared/middleware/validate');

const router = express.Router();

// Validaciones
const departmentValidation = [
  body('code')
    .trim()
    .notEmpty().withMessage('El código es requerido')
    .isLength({ max: 20 }).withMessage('El código no puede exceder 20 caracteres'),
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
  body('type')
    .optional()
    .isIn(['DIRECTION', 'MANAGEMENT', 'DEPARTMENT', 'AREA', 'UNIT'])
    .withMessage('Tipo inválido'),
  body('parentId')
    .optional({ nullable: true })
    .isUUID().withMessage('ID de padre inválido'),
  body('managerId')
    .optional({ nullable: true })
    .isUUID().withMessage('ID de gerente inválido'),
];

const positionValidation = [
  body('code')
    .trim()
    .notEmpty().withMessage('El código es requerido')
    .isLength({ max: 20 }).withMessage('El código no puede exceder 20 caracteres'),
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
  body('departmentId')
    .optional({ nullable: true })
    .isUUID().withMessage('ID de departamento inválido'),
  body('level')
    .optional()
    .isInt({ min: 0, max: 10 }).withMessage('Nivel debe ser entre 0 y 10'),
];

const idValidation = [
  param('id').isUUID().withMessage('ID inválido'),
];

// Todas las rutas requieren autenticación
router.use(authenticate);

// ========== DEPARTMENTS ==========

router.get(
  '/departments',
  authorize('employees:read'),
  organizationController.listDepartments
);

router.get(
  '/departments/tree',
  authorize('employees:read'),
  organizationController.getDepartmentTree
);

router.get(
  '/departments/:id',
  validate(idValidation),
  authorize('employees:read'),
  organizationController.getDepartmentById
);

router.post(
  '/departments',
  validate(departmentValidation),
  authorize('employees:create'),
  organizationController.createDepartment
);

router.put(
  '/departments/:id',
  validate(idValidation),
  authorize('employees:update'),
  organizationController.updateDepartment
);

router.delete(
  '/departments/:id',
  validate(idValidation),
  authorize('employees:delete'),
  organizationController.deleteDepartment
);

// ========== POSITIONS ==========

router.get(
  '/positions',
  authorize('employees:read'),
  organizationController.listPositions
);

router.get(
  '/positions/:id',
  validate(idValidation),
  authorize('employees:read'),
  organizationController.getPositionById
);

router.post(
  '/positions',
  validate(positionValidation),
  authorize('employees:create'),
  organizationController.createPosition
);

router.put(
  '/positions/:id',
  validate(idValidation),
  authorize('employees:update'),
  organizationController.updatePosition
);

router.delete(
  '/positions/:id',
  validate(idValidation),
  authorize('employees:delete'),
  organizationController.deletePosition
);

// ========== ORGANIGRAMA Y DIRECTORIO ==========

router.get(
  '/org-chart',
  authorize('employees:read'),
  organizationController.getOrgChart
);

router.get(
  '/directory',
  authorize('employees:read'),
  organizationController.getDirectory
);

router.get(
  '/stats',
  authorize('employees:read'),
  organizationController.getOrgStats
);

module.exports = router;
