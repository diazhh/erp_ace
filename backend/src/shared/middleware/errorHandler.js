const logger = require('../utils/logger');
const { AppError } = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error(err.message, {
    error: err,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  });

  // Si es un error operacional conocido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Errores de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      status: 'fail',
      message: 'Error de validación',
      errors,
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return res.status(409).json({
      success: false,
      status: 'fail',
      message: `El ${field} ya existe`,
    });
  }

  // Error genérico (no exponer detalles en producción)
  return res.status(500).json({
    success: false,
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    status: 'fail',
    message: `Ruta ${req.originalUrl} no encontrada`,
  });
};

module.exports = { errorHandler, notFoundHandler };
