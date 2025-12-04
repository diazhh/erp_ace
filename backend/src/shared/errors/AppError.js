class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflicto con el estado actual') {
    super(message, 409);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Error de validación', errors = []) {
    super(message, 422);
    this.errors = errors;
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
};
