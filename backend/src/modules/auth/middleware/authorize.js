const { ForbiddenError } = require('../../../shared/errors/AppError');

/**
 * Verifica si un usuario tiene un permiso específico
 * Soporta permisos granulares: modulo:accion[:campo]
 * 
 * @param {string[]} userPermissions - Lista de permisos del usuario
 * @param {string} requiredPermission - Permiso requerido (ej: 'employees:read:payroll')
 * @returns {boolean}
 */
const checkPermission = (userPermissions, requiredPermission) => {
  // Super admin tiene acceso a todo
  if (userPermissions.includes('*:*')) {
    return true;
  }
  
  const parts = requiredPermission.split(':');
  const module = parts[0];
  const action = parts[1];
  const field = parts[2];
  
  // Verificar permiso de módulo completo (ej: 'employees:*')
  if (userPermissions.includes(`${module}:*`)) {
    return true;
  }
  
  // Verificar permiso exacto
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }
  
  // Si se requiere un campo específico, verificar si tiene el permiso de acción general
  // Ej: si requiere 'employees:read:payroll', verificar si tiene 'employees:read'
  if (field && userPermissions.includes(`${module}:${action}`)) {
    return true;
  }
  
  // Verificar wildcard de acción con cualquier campo (ej: 'employees:read:*')
  if (field && userPermissions.includes(`${module}:${action}:*`)) {
    return true;
  }
  
  return false;
};

/**
 * Middleware de autorización basado en permisos
 * @param  {...string} requiredPermissions - Permisos requeridos (ej: 'users:create', 'projects:read')
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user || !req.userPermissions) {
      throw new ForbiddenError('Acceso denegado');
    }

    // Verificar si tiene todos los permisos requeridos
    const hasAllPermissions = requiredPermissions.every(permission => 
      checkPermission(req.userPermissions, permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenError('No tiene permisos suficientes para esta acción');
    }

    next();
  };
};

/**
 * Middleware que requiere al menos uno de los permisos
 */
const authorizeAny = (...permissions) => {
  return (req, res, next) => {
    if (!req.user || !req.userPermissions) {
      throw new ForbiddenError('Acceso denegado');
    }

    const hasAnyPermission = permissions.some(permission => 
      checkPermission(req.userPermissions, permission)
    );

    if (!hasAnyPermission) {
      throw new ForbiddenError('No tiene permisos suficientes para esta acción');
    }

    next();
  };
};

/**
 * Middleware para autorizar acceso a campos/tabs específicos
 * @param {string} module - Módulo (ej: 'employees')
 * @param {string} action - Acción (ej: 'read')
 * @param {string} field - Campo o tab (ej: 'payroll')
 */
const authorizeField = (module, action, field) => {
  return (req, res, next) => {
    if (!req.user || !req.userPermissions) {
      throw new ForbiddenError('Acceso denegado');
    }

    const permission = field ? `${module}:${action}:${field}` : `${module}:${action}`;
    
    if (!checkPermission(req.userPermissions, permission)) {
      throw new ForbiddenError('No tiene permiso para ver esta sección');
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario puede acceder a su propio recurso
 * Útil para empleados que solo pueden ver su propio perfil
 * @param {string} permission - Permiso base requerido
 * @param {string} paramName - Nombre del parámetro de ruta (default: 'id')
 */
const authorizeOwn = (permission, paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user || !req.userPermissions) {
      throw new ForbiddenError('Acceso denegado');
    }

    // Si tiene el permiso general, puede acceder a cualquier recurso
    if (checkPermission(req.userPermissions, permission)) {
      return next();
    }

    // Si no tiene el permiso general, verificar si es su propio recurso
    const resourceId = req.params[paramName];
    const userEmployeeId = req.user.employeeId;

    if (userEmployeeId && resourceId === userEmployeeId) {
      return next();
    }

    throw new ForbiddenError('Solo puede acceder a sus propios datos');
  };
};

/**
 * Helper para verificar permisos en el controlador
 * @param {Object} req - Request object
 * @param {string} permission - Permiso a verificar
 * @returns {boolean}
 */
const hasPermission = (req, permission) => {
  if (!req.userPermissions) return false;
  return checkPermission(req.userPermissions, permission);
};

module.exports = { 
  authorize, 
  authorizeAny, 
  authorizeField,
  authorizeOwn,
  checkPermission,
  hasPermission,
};
