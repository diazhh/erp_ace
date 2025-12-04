const express = require('express');
const { body, param } = require('express-validator');
const employeeBankAccountController = require('../controllers/employeeBankAccountController');
const authenticate = require('../../auth/middleware/authenticate');
const { authorize } = require('../../auth/middleware/authorize');
const validate = require('../../../shared/middleware/validate');

const router = express.Router();

// Validaciones
const createValidation = [
  body('employeeId')
    .notEmpty().withMessage('El ID del empleado es requerido')
    .isUUID().withMessage('ID de empleado inválido'),
  body('accountType')
    .notEmpty().withMessage('El tipo de cuenta es requerido')
    .isIn(['CHECKING', 'SAVINGS', 'PAGO_MOVIL', 'ZELLE', 'CRYPTO'])
    .withMessage('Tipo de cuenta inválido'),
  body('bankName')
    .trim()
    .notEmpty().withMessage('El nombre del banco es requerido')
    .isLength({ max: 100 }).withMessage('El nombre del banco no puede exceder 100 caracteres'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 }).withMessage('La moneda debe tener 3 caracteres'),
  body('paymentPercentage')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Porcentaje inválido')
    .custom((value) => {
      if (parseFloat(value) < 0 || parseFloat(value) > 100) {
        throw new Error('El porcentaje debe estar entre 0 y 100');
      }
      return true;
    }),
];

const updateValidation = [
  body('accountType')
    .optional()
    .isIn(['CHECKING', 'SAVINGS', 'PAGO_MOVIL', 'ZELLE', 'CRYPTO'])
    .withMessage('Tipo de cuenta inválido'),
  body('bankName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El nombre del banco no puede exceder 100 caracteres'),
  body('paymentPercentage')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Porcentaje inválido')
    .custom((value) => {
      if (parseFloat(value) < 0 || parseFloat(value) > 100) {
        throw new Error('El porcentaje debe estar entre 0 y 100');
      }
      return true;
    }),
];

const idValidation = [
  param('id').isUUID().withMessage('ID inválido'),
];

const employeeIdValidation = [
  param('employeeId').isUUID().withMessage('ID de empleado inválido'),
];

// Todas las rutas requieren autenticación
router.use(authenticate);

// Listar cuentas de un empleado
router.get(
  '/employee/:employeeId',
  validate(employeeIdValidation),
  authorize('employees:read'),
  employeeBankAccountController.list
);

// Obtener cuenta por ID
router.get(
  '/:id',
  validate(idValidation),
  authorize('employees:read'),
  employeeBankAccountController.getById
);

// Crear cuenta
router.post(
  '/',
  validate(createValidation),
  authorize('employees:update'),
  employeeBankAccountController.create
);

// Actualizar cuenta
router.put(
  '/:id',
  validate([...idValidation, ...updateValidation]),
  authorize('employees:update'),
  employeeBankAccountController.update
);

// Eliminar cuenta
router.delete(
  '/:id',
  validate(idValidation),
  authorize('employees:update'),
  employeeBankAccountController.delete
);

// Establecer como primaria
router.post(
  '/:id/set-primary',
  validate(idValidation),
  authorize('employees:update'),
  employeeBankAccountController.setPrimary
);

// Verificar cuenta
router.post(
  '/:id/verify',
  validate(idValidation),
  authorize('employees:update'),
  employeeBankAccountController.verify
);

module.exports = router;
