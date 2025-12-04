const { validationResult } = require('express-validator');
const { ValidationError } = require('../errors/AppError');

const validate = (validations) => {
  return async (req, res, next) => {
    try {
      // Ejecutar todas las validaciones
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const extractedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      }));

      return res.status(422).json({
        success: false,
        status: 'fail',
        message: 'Error de validación',
        errors: extractedErrors,
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;
