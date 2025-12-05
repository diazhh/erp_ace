const { Op } = require('sequelize');
const crypto = require('crypto');
const { NotFoundError, BadRequestError, ConflictError } = require('../../../shared/errors/AppError');

class UserService {
  constructor(models) {
    this.User = models.User;
    this.Role = models.Role;
    this.Employee = models.Employee;
    this.AuditLog = models.AuditLog;
  }

  /**
   * Listar usuarios con paginación y filtros
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      isActive,
      roleId,
      hasEmployee,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = options;

    const where = {};
    const offset = (page - 1) * limit;

    // Búsqueda por username, email, nombre
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filtro por estado activo
    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === true;
    }

    // Filtro por empleado vinculado
    if (hasEmployee !== undefined) {
      if (hasEmployee === 'true' || hasEmployee === true) {
        where.employeeId = { [Op.ne]: null };
      } else {
        where.employeeId = null;
      }
    }

    const { count, rows } = await this.User.findAndCountAll({
      where,
      include: [
        {
          association: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          ...(roleId && { where: { id: roleId } }),
        },
        {
          association: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'idNumber', 'position'],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    return {
      users: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Obtener usuario por ID con detalles completos
   */
  async findById(id) {
    const user = await this.User.findByPk(id, {
      include: [
        {
          association: 'roles',
          include: ['permissions'],
        },
        {
          association: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'idNumber', 'position', 'email', 'phone'],
        },
      ],
    });

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // Extraer permisos consolidados
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

    return {
      ...user.toJSON(),
      consolidatedPermissions: Array.from(permissions),
    };
  }

  /**
   * Crear nuevo usuario
   */
  async create(data, createdBy) {
    const { username, email, password, firstName, lastName, employeeId, roleIds, mustChangePassword } = data;

    // Verificar username único
    const existingUsername = await this.User.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictError('El nombre de usuario ya existe');
    }

    // Verificar email único
    const existingEmail = await this.User.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictError('El email ya está registrado');
    }

    // Verificar que el empleado no tenga ya un usuario
    if (employeeId) {
      const existingUserForEmployee = await this.User.findOne({ where: { employeeId } });
      if (existingUserForEmployee) {
        throw new ConflictError('Este empleado ya tiene un usuario asignado');
      }

      // Verificar que el empleado existe
      const employee = await this.Employee.findByPk(employeeId);
      if (!employee) {
        throw new NotFoundError('Empleado no encontrado');
      }
    }

    // Generar contraseña temporal si no se proporciona
    const finalPassword = password || this.generateTemporaryPassword();

    // Crear usuario
    const user = await this.User.create({
      username,
      email,
      password: finalPassword,
      firstName,
      lastName,
      employeeId,
      mustChangePassword: mustChangePassword !== false, // Por defecto true si es nuevo
      isActive: true,
    });

    // Asignar roles
    if (roleIds && roleIds.length > 0) {
      const roles = await this.Role.findAll({ where: { id: roleIds } });
      await user.setRoles(roles);
    }

    // Registrar auditoría
    await this.AuditLog.create({
      userId: createdBy?.id,
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: user.id,
      newValues: { username, email, firstName, lastName, employeeId },
    });

    // Retornar usuario con roles
    return this.findById(user.id);
  }

  /**
   * Actualizar usuario
   */
  async update(id, data, updatedBy) {
    const user = await this.User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const { username, email, firstName, lastName, employeeId, roleIds, isActive } = data;
    const oldValues = user.toJSON();

    // Verificar username único (si cambió)
    if (username && username !== user.username) {
      const existingUsername = await this.User.findOne({ where: { username } });
      if (existingUsername) {
        throw new ConflictError('El nombre de usuario ya existe');
      }
    }

    // Verificar email único (si cambió)
    if (email && email !== user.email) {
      const existingEmail = await this.User.findOne({ where: { email } });
      if (existingEmail) {
        throw new ConflictError('El email ya está registrado');
      }
    }

    // Verificar empleado (si cambió)
    if (employeeId !== undefined && employeeId !== user.employeeId) {
      if (employeeId) {
        const existingUserForEmployee = await this.User.findOne({ 
          where: { employeeId, id: { [Op.ne]: id } } 
        });
        if (existingUserForEmployee) {
          throw new ConflictError('Este empleado ya tiene un usuario asignado');
        }
      }
    }

    // Actualizar campos
    await user.update({
      ...(username && { username }),
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(employeeId !== undefined && { employeeId }),
      ...(isActive !== undefined && { isActive }),
    });

    // Actualizar roles si se proporcionan
    if (roleIds !== undefined) {
      const roles = await this.Role.findAll({ where: { id: roleIds } });
      await user.setRoles(roles);
    }

    // Registrar auditoría
    await this.AuditLog.create({
      userId: updatedBy?.id,
      action: 'USER_UPDATED',
      entityType: 'User',
      entityId: user.id,
      oldValues,
      newValues: data,
    });

    return this.findById(id);
  }

  /**
   * Eliminar usuario (soft delete - desactivar)
   */
  async delete(id, deletedBy) {
    const user = await this.User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // No permitir eliminar el usuario admin
    if (user.username === 'admin') {
      throw new BadRequestError('No se puede eliminar el usuario administrador');
    }

    await user.update({ isActive: false });

    // Registrar auditoría
    await this.AuditLog.create({
      userId: deletedBy?.id,
      action: 'USER_DELETED',
      entityType: 'User',
      entityId: user.id,
    });

    return { message: 'Usuario desactivado correctamente' };
  }

  /**
   * Activar/Desactivar usuario
   */
  async toggleActive(id, updatedBy) {
    const user = await this.User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    if (user.username === 'admin') {
      throw new BadRequestError('No se puede desactivar el usuario administrador');
    }

    const newStatus = !user.isActive;
    await user.update({ isActive: newStatus });

    // Registrar auditoría
    await this.AuditLog.create({
      userId: updatedBy?.id,
      action: newStatus ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entityType: 'User',
      entityId: user.id,
    });

    return { 
      message: newStatus ? 'Usuario activado' : 'Usuario desactivado',
      isActive: newStatus,
    };
  }

  /**
   * Resetear contraseña
   */
  async resetPassword(id, resetBy) {
    const user = await this.User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const newPassword = this.generateTemporaryPassword();
    
    await user.update({ 
      password: newPassword,
      mustChangePassword: true,
    });

    // Registrar auditoría
    await this.AuditLog.create({
      userId: resetBy?.id,
      action: 'PASSWORD_RESET',
      entityType: 'User',
      entityId: user.id,
    });

    return { 
      message: 'Contraseña reseteada correctamente',
      temporaryPassword: newPassword,
    };
  }

  /**
   * Asignar roles a usuario
   */
  async assignRoles(id, roleIds, assignedBy) {
    const user = await this.User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const roles = await this.Role.findAll({ where: { id: roleIds } });
    const oldRoles = await user.getRoles();
    
    await user.setRoles(roles);

    // Registrar auditoría
    await this.AuditLog.create({
      userId: assignedBy?.id,
      action: 'ROLES_ASSIGNED',
      entityType: 'User',
      entityId: user.id,
      oldValues: { roles: oldRoles.map(r => r.name) },
      newValues: { roles: roles.map(r => r.name) },
    });

    return this.findById(id);
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getStats() {
    const total = await this.User.count();
    const active = await this.User.count({ where: { isActive: true } });
    const inactive = await this.User.count({ where: { isActive: false } });
    const withEmployee = await this.User.count({ where: { employeeId: { [Op.ne]: null } } });
    const withoutEmployee = await this.User.count({ where: { employeeId: null } });

    // Usuarios por rol
    const usersByRole = await this.Role.findAll({
      attributes: ['id', 'name'],
      include: [{
        association: 'users',
        attributes: ['id'],
        through: { attributes: [] },
      }],
    });

    return {
      total,
      active,
      inactive,
      withEmployee,
      withoutEmployee,
      byRole: usersByRole.map(role => ({
        roleId: role.id,
        roleName: role.name,
        count: role.users?.length || 0,
      })),
    };
  }

  /**
   * Generar contraseña temporal
   */
  generateTemporaryPassword() {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    return password;
  }
}

module.exports = UserService;
