const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { UnauthorizedError } = require('../../../shared/errors/AppError');

const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de acceso requerido');
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Importar modelo dinámicamente para evitar dependencia circular
    const { User } = require('../../../database/models');

    // Obtener usuario
    const user = await User.findByPk(decoded.userId, {
      include: [{
        association: 'roles',
        include: ['permissions'],
      }],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuario no válido o inactivo');
    }

    // Verificar si el password cambió después de emitir el token
    if (user.changedPasswordAfter(decoded.iat)) {
      throw new UnauthorizedError('Contraseña cambiada recientemente. Por favor inicie sesión nuevamente');
    }

    // Agregar usuario y permisos al request
    req.user = user;
    req.userPermissions = extractPermissions(user);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Token inválido'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expirado'));
    }
    next(error);
  }
};

// Extraer permisos del usuario
function extractPermissions(user) {
  const permissions = new Set();
  
  if (user.roles) {
    user.roles.forEach(role => {
      if (role.permissions) {
        role.permissions.forEach(perm => {
          permissions.add(perm.code);
        });
      }
    });
  }
  
  return Array.from(permissions);
}

module.exports = authenticate;
