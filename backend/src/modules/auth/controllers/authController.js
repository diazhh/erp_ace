const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { UnauthorizedError, BadRequestError } = require('../../../shared/errors/AppError');
const logger = require('../../../shared/utils/logger');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Importar modelo
      const { User, AuditLog } = require('../../../database/models');

      // Buscar usuario con roles y permisos
      const user = await User.findOne({
        where: { username, isActive: true },
        include: [{
          association: 'roles',
          where: { isActive: true },
          required: false,
          include: ['permissions'],
        }],
      });

      if (!user) {
        // Log de intento fallido
        await AuditLog.create({
          action: 'LOGIN_FAILED',
          entityType: 'User',
          metadata: { username, reason: 'Usuario no encontrado' },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });
        throw new UnauthorizedError('Credenciales inválidas');
      }

      // Validar password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        await AuditLog.create({
          userId: user.id,
          action: 'LOGIN_FAILED',
          entityType: 'User',
          entityId: user.id,
          metadata: { reason: 'Contraseña incorrecta' },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });
        throw new UnauthorizedError('Credenciales inválidas');
      }

      // Generar JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        config.jwt.secret,
        { expiresIn: config.jwt.expire }
      );

      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Log de login exitoso
      await AuditLog.create({
        userId: user.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Usuario ${user.username} inició sesión`);

      // Extraer permisos
      const permissions = [];
      if (user.roles) {
        user.roles.forEach(role => {
          if (role.permissions) {
            role.permissions.forEach(perm => {
              if (!permissions.includes(perm.code)) {
                permissions.push(perm.code);
              }
            });
          }
        });
      }

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles?.map(r => ({ id: r.id, name: r.name })) || [],
            permissions,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = req.user;

      return res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles?.map(r => ({ id: r.id, name: r.name })) || [],
          permissions: req.userPermissions,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { AuditLog } = require('../../../database/models');

      // Log de logout
      await AuditLog.create({
        userId: req.user.id,
        action: 'LOGOUT',
        entityType: 'User',
        entityId: req.user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Usuario ${req.user.username} cerró sesión`);

      return res.json({
        success: true,
        message: 'Sesión cerrada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const { User, AuditLog } = require('../../../database/models');

      const user = await User.findByPk(req.user.id);

      // Verificar contraseña actual
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new BadRequestError('Contraseña actual incorrecta');
      }

      // Actualizar contraseña
      user.password = newPassword;
      await user.save();

      // Log
      await AuditLog.create({
        userId: user.id,
        action: 'PASSWORD_CHANGE',
        entityType: 'User',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      logger.info(`Usuario ${user.username} cambió su contraseña`);

      return res.json({
        success: true,
        message: 'Contraseña actualizada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
