const express = require('express');
const { body, param, query } = require('express-validator');
const employeeController = require('../controllers/employeeController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');
const validate = require('../../../shared/middleware/validate');

const router = express.Router();

// Validaciones
const createValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ max: 100 }).withMessage('El apellido no puede exceder 100 caracteres'),
  body('idType')
    .optional()
    .isIn(['V', 'E', 'P', 'J']).withMessage('Tipo de identificación inválido'),
  body('idNumber')
    .trim()
    .notEmpty().withMessage('El número de identificación es requerido')
    .isLength({ max: 20 }).withMessage('El número de identificación no puede exceder 20 caracteres'),
  body('position')
    .trim()
    .notEmpty().withMessage('El cargo es requerido'),
  body('hireDate')
    .notEmpty().withMessage('La fecha de ingreso es requerida')
    .isDate().withMessage('Fecha de ingreso inválida'),
  body('email')
    .optional()
    .isEmail().withMessage('Email inválido'),
  body('baseSalary')
    .optional()
    .isDecimal().withMessage('El salario debe ser un número válido'),
];

const updateValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El apellido no puede exceder 100 caracteres'),
  body('email')
    .optional()
    .isEmail().withMessage('Email inválido'),
  body('baseSalary')
    .optional()
    .isDecimal().withMessage('El salario debe ser un número válido'),
];

const idValidation = [
  param('id').isUUID().withMessage('ID inválido'),
];

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas
router.get(
  '/',
  authorize('employees:read'),
  employeeController.list
);

router.get(
  '/stats',
  authorize('employees:read'),
  employeeController.getStats
);

router.get(
  '/expiring-documents',
  authorize('employees:read'),
  employeeController.getExpiringDocuments
);

router.get(
  '/:id',
  validate(idValidation),
  authorize('employees:read'),
  employeeController.getById
);

router.get(
  '/:id/full',
  validate(idValidation),
  authorize('employees:read'),
  employeeController.getFullById
);

router.post(
  '/',
  validate(createValidation),
  authorize('employees:create'),
  employeeController.create
);

router.put(
  '/:id',
  validate([...idValidation, ...updateValidation]),
  authorize('employees:update'),
  employeeController.update
);

router.delete(
  '/:id',
  validate(idValidation),
  authorize('employees:delete'),
  employeeController.delete
);

module.exports = router;
