const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const validate = require('../../../shared/middleware/validate');

const router = express.Router();

// Validaciones
const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El usuario es requerido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
];

// Rutas públicas
router.post('/login', validate(loginValidation), authController.login);

// Rutas protegidas
router.get('/me', authenticate, authController.me);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validate(changePasswordValidation), authController.changePassword);

module.exports = router;
