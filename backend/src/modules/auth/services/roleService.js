const { Op } = require('sequelize');
const { NotFoundError, BadRequestError, ConflictError } = require('../../../shared/errors/AppError');

class RoleService {
  constructor(models) {
    this.Role = models.Role;
    this.Permission = models.Permission;
    this.User = models.User;
    this.AuditLog = models.AuditLog;
  }

  /**
   * Listar roles con paginación
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 50,
      search = '',
      includePermissions = false,
      includeUserCount = false,
    } = options;

    const where = {};
    const offset = (page - 1) * limit;

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const include = [];
    
    if (includePermissions === 'true' || includePermissions === true) {
      include.push({
        association: 'permissions',
        attributes: ['id', 'code', 'name', 'module', 'action', 'field'],
        through: { attributes: [] },
      });
    }

    if (includeUserCount === 'true' || includeUserCount === true) {
      include.push({
        association: 'users',
        attributes: ['id'],
        through: { attributes: [] },
      });
    }

    const { count, rows } = await this.Role.findAndCountAll({
      where,
      include,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    // Agregar conteo de usuarios si se solicitó
    const roles = rows.map(role => {
      const roleData = role.toJSON();
      if (includeUserCount === 'true' || includeUserCount === true) {
        roleData.userCount = roleData.users?.length || 0;
        delete roleData.users;
      }
      return roleData;
    });

    return {
      roles,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Obtener rol por ID con permisos
   */
  async findById(id) {
    const role = await this.Role.findByPk(id, {
      include: [
        {
          association: 'permissions',
          attributes: ['id', 'code', 'name', 'description', 'module', 'action', 'field', 'permissionType'],
          through: { attributes: [] },
        },
        {
          association: 'users',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'isActive'],
          through: { attributes: [] },
        },
      ],
    });

    if (!role) {
      throw new NotFoundError('Rol no encontrado');
    }

    return role;
  }

  /**
   * Crear nuevo rol
   */
  async create(data, createdBy) {
    const { name, description, permissionIds } = data;

    // Verificar nombre único
    const existingRole = await this.Role.findOne({ where: { name } });
    if (existingRole) {
      throw new ConflictError('Ya existe un rol con este nombre');
    }

    // Crear rol
    const role = await this.Role.create({
      name,
      description,
      isSystemRole: false,
    });

    // Asignar permisos
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.Permission.findAll({ where: { id: permissionIds } });
      await role.setPermissions(permissions);
    }

    // Registrar auditoría
    await this.AuditLog.create({
      userId: createdBy?.id,
      action: 'ROLE_CREATED',
      entityType: 'Role',
      entityId: role.id,
      newValues: { name, description, permissionCount: permissionIds?.length || 0 },
    });

    return this.findById(role.id);
  }

  /**
   * Actualizar rol
   */
  async update(id, data, updatedBy) {
    const role = await this.Role.findByPk(id);
    if (!role) {
      throw new NotFoundError('Rol no encontrado');
    }

    // No permitir editar roles del sistema (excepto permisos)
    if (role.isSystemRole && (data.name || data.description)) {
      throw new BadRequestError('No se puede modificar el nombre o descripción de roles del sistema');
    }

    const { name, description, permissionIds } = data;
    const oldValues = role.toJSON();

    // Verificar nombre único (si cambió)
    if (name && name !== role.name) {
      const existingRole = await this.Role.findOne({ where: { name } });
      if (existingRole) {
        throw new ConflictError('Ya existe un rol con este nombre');
      }
    }

    // Actualizar campos
    if (!role.isSystemRole) {
      await role.update({
        ...(name && { name }),
        ...(description !== undefined && { description }),
      });
    }

    // Actualizar permisos
    if (permissionIds !== undefined) {
      const permissions = await this.Permission.findAll({ where: { id: permissionIds } });
      await role.setPermissions(permissions);
    }

    // Registrar auditoría
    await this.AuditLog.create({
      userId: updatedBy?.id,
      action: 'ROLE_UPDATED',
      entityType: 'Role',
      entityId: role.id,
      oldValues,
      newValues: data,
    });

    return this.findById(id);
  }

  /**
   * Eliminar rol
   */
  async delete(id, deletedBy) {
    const role = await this.Role.findByPk(id, {
      include: ['users'],
    });

    if (!role) {
      throw new NotFoundError('Rol no encontrado');
    }

    // No permitir eliminar roles del sistema
    if (role.isSystemRole) {
      throw new BadRequestError('No se puede eliminar un rol del sistema');
    }

    // No permitir eliminar si tiene usuarios asignados
    if (role.users && role.users.length > 0) {
      throw new BadRequestError(`No se puede eliminar el rol porque tiene ${role.users.length} usuario(s) asignado(s)`);
    }

    // Eliminar permisos asociados
    await role.setPermissions([]);
    
    // Eliminar rol
    await role.destroy();

    // Registrar auditoría
    await this.AuditLog.create({
      userId: deletedBy?.id,
      action: 'ROLE_DELETED',
      entityType: 'Role',
      entityId: id,
      oldValues: { name: role.name },
    });

    return { message: 'Rol eliminado correctamente' };
  }

  /**
   * Asignar permisos a rol
   */
  async assignPermissions(id, permissionIds, assignedBy) {
    const role = await this.Role.findByPk(id);
    if (!role) {
      throw new NotFoundError('Rol no encontrado');
    }

    const permissions = await this.Permission.findAll({ where: { id: permissionIds } });
    const oldPermissions = await role.getPermissions();
    
    await role.setPermissions(permissions);

    // Registrar auditoría
    await this.AuditLog.create({
      userId: assignedBy?.id,
      action: 'PERMISSIONS_ASSIGNED',
      entityType: 'Role',
      entityId: role.id,
      oldValues: { permissions: oldPermissions.map(p => p.code) },
      newValues: { permissions: permissions.map(p => p.code) },
    });

    return this.findById(id);
  }

  /**
   * Obtener todos los permisos agrupados por módulo
   */
  async getPermissionsByModule() {
    const permissions = await this.Permission.findAll({
      order: [['module', 'ASC'], ['action', 'ASC'], ['field', 'ASC']],
    });

    // Agrupar por módulo
    const grouped = {};
    permissions.forEach(perm => {
      if (!grouped[perm.module]) {
        grouped[perm.module] = [];
      }
      grouped[perm.module].push({
        id: perm.id,
        code: perm.code,
        name: perm.name,
        description: perm.description,
        action: perm.action,
        field: perm.field,
        permissionType: perm.permissionType,
      });
    });

    return grouped;
  }

  /**
   * Obtener lista de módulos disponibles
   */
  async getModules() {
    const permissions = await this.Permission.findAll({
      attributes: ['module'],
      group: ['module'],
      order: [['module', 'ASC']],
    });

    return permissions.map(p => p.module);
  }

  /**
   * Obtener estadísticas de roles
   */
  async getStats() {
    const total = await this.Role.count();
    const systemRoles = await this.Role.count({ where: { isSystemRole: true } });
    const customRoles = await this.Role.count({ where: { isSystemRole: false } });
    const totalPermissions = await this.Permission.count();

    return {
      totalRoles: total,
      systemRoles,
      customRoles,
      totalPermissions,
    };
  }
}

module.exports = RoleService;
