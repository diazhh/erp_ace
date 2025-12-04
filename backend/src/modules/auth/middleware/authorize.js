const { ForbiddenError } = require('../../../shared/errors/AppError');

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

    // Super admin tiene acceso a todo
    if (req.userPermissions.includes('*:*')) {
      return next();
    }

    // Verificar si tiene todos los permisos requeridos
    const hasAllPermissions = requiredPermissions.every(permission => {
      // Verificar permiso exacto
      if (req.userPermissions.includes(permission)) {
        return true;
      }
      
      // Verificar permiso wildcard del módulo (ej: 'users:*')
      const [module] = permission.split(':');
      if (req.userPermissions.includes(`${module}:*`)) {
        return true;
      }
      
      return false;
    });

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

    if (req.userPermissions.includes('*:*')) {
      return next();
    }

    const hasAnyPermission = permissions.some(permission => {
      if (req.userPermissions.includes(permission)) {
        return true;
      }
      const [module] = permission.split(':');
      return req.userPermissions.includes(`${module}:*`);
    });

    if (!hasAnyPermission) {
      throw new ForbiddenError('No tiene permisos suficientes para esta acción');
    }

    next();
  };
};

module.exports = { authorize, authorizeAny };
