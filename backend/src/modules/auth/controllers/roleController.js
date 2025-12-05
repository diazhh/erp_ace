const RoleService = require('../services/roleService');
const models = require('../../../database/models');

const roleService = new RoleService(models);

class RoleController {
  /**
   * GET /api/roles
   * Listar roles
   */
  async findAll(req, res, next) {
    try {
      const result = await roleService.findAll(req.query);
      return res.json({
        success: true,
        data: result.roles,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/roles/stats
   * Obtener estadísticas de roles
   */
  async getStats(req, res, next) {
    try {
      const stats = await roleService.getStats();
      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/roles/:id
   * Obtener rol por ID con permisos
   */
  async findById(req, res, next) {
    try {
      const role = await roleService.findById(req.params.id);
      return res.json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/roles
   * Crear nuevo rol
   */
  async create(req, res, next) {
    try {
      const role = await roleService.create(req.body, req.user);
      return res.status(201).json({
        success: true,
        data: role,
        message: 'Rol creado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/roles/:id
   * Actualizar rol
   */
  async update(req, res, next) {
    try {
      const role = await roleService.update(req.params.id, req.body, req.user);
      return res.json({
        success: true,
        data: role,
        message: 'Rol actualizado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/roles/:id
   * Eliminar rol
   */
  async delete(req, res, next) {
    try {
      const result = await roleService.delete(req.params.id, req.user);
      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/roles/:id/permissions
   * Asignar permisos a rol
   */
  async assignPermissions(req, res, next) {
    try {
      const { permissionIds } = req.body;
      const role = await roleService.assignPermissions(req.params.id, permissionIds, req.user);
      return res.json({
        success: true,
        data: role,
        message: 'Permisos asignados correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/permissions
   * Listar todos los permisos agrupados por módulo
   */
  async getPermissions(req, res, next) {
    try {
      const permissions = await roleService.getPermissionsByModule();
      return res.json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/permissions/modules
   * Listar módulos disponibles
   */
  async getModules(req, res, next) {
    try {
      const modules = await roleService.getModules();
      return res.json({
        success: true,
        data: modules,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoleController();
