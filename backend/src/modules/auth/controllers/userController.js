const UserService = require('../services/userService');
const models = require('../../../database/models');

const userService = new UserService(models);

class UserController {
  /**
   * GET /api/users
   * Listar usuarios con paginación y filtros
   */
  async findAll(req, res, next) {
    try {
      const result = await userService.findAll(req.query);
      return res.json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/stats
   * Obtener estadísticas de usuarios
   */
  async getStats(req, res, next) {
    try {
      const stats = await userService.getStats();
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   * Obtener usuario por ID
   */
  async findById(req, res, next) {
    try {
      const user = await userService.findById(req.params.id);
      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users
   * Crear nuevo usuario
   */
  async create(req, res, next) {
    try {
      const user = await userService.create(req.body, req.user);
      return res.status(201).json({
        success: true,
        data: user,
        message: 'Usuario creado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id
   * Actualizar usuario
   */
  async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body, req.user);
      return res.json({
        success: true,
        data: user,
        message: 'Usuario actualizado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   * Eliminar (desactivar) usuario
   */
  async delete(req, res, next) {
    try {
      const result = await userService.delete(req.params.id, req.user);
      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id/toggle-active
   * Activar/Desactivar usuario
   */
  async toggleActive(req, res, next) {
    try {
      const result = await userService.toggleActive(req.params.id, req.user);
      return res.json({
        success: true,
        data: { isActive: result.isActive },
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users/:id/reset-password
   * Resetear contraseña de usuario
   */
  async resetPassword(req, res, next) {
    try {
      const result = await userService.resetPassword(req.params.id, req.user);
      return res.json({
        success: true,
        data: { temporaryPassword: result.temporaryPassword },
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users/:id/roles
   * Asignar roles a usuario
   */
  async assignRoles(req, res, next) {
    try {
      const { roleIds } = req.body;
      const user = await userService.assignRoles(req.params.id, roleIds, req.user);
      return res.json({
        success: true,
        data: user,
        message: 'Roles asignados correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
