import PropTypes from 'prop-types';
import { usePermission, useAnyPermission, useAllPermissions } from '../../hooks/usePermission';

/**
 * Componente que renderiza sus hijos solo si el usuario tiene el permiso requerido
 * 
 * @example
 * <PermissionGate permission="employees:read:payroll">
 *   <Tab label="Nómina" value="payroll" />
 * </PermissionGate>
 */
export const PermissionGate = ({ 
  permission, 
  permissions,
  requireAll = false,
  children, 
  fallback = null 
}) => {
  // Si se proporciona un solo permiso
  const hasSinglePermission = usePermission(permission || '');
  
  // Si se proporciona una lista de permisos
  const hasAnyPermission = useAnyPermission(permissions || []);
  const hasAllPermissions = useAllPermissions(permissions || []);

  let hasAccess = false;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions : hasAnyPermission;
  }

  return hasAccess ? children : fallback;
};

PermissionGate.propTypes = {
  /** Permiso único requerido */
  permission: PropTypes.string,
  /** Lista de permisos (usar con requireAll) */
  permissions: PropTypes.arrayOf(PropTypes.string),
  /** Si true, requiere todos los permisos de la lista. Si false, requiere al menos uno */
  requireAll: PropTypes.bool,
  /** Contenido a renderizar si tiene permiso */
  children: PropTypes.node.isRequired,
  /** Contenido alternativo si no tiene permiso */
  fallback: PropTypes.node,
};

/**
 * Componente para ocultar elementos si NO tiene el permiso
 * Útil para botones de acción
 * 
 * @example
 * <CanDo permission="employees:create">
 *   <Button>Crear Empleado</Button>
 * </CanDo>
 */
export const CanDo = ({ permission, children }) => {
  const hasPermission = usePermission(permission);
  return hasPermission ? children : null;
};

CanDo.propTypes = {
  permission: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Componente para mostrar contenido solo a Super Admins
 */
export const SuperAdminOnly = ({ children, fallback = null }) => {
  const isSuperAdmin = usePermission('*:*');
  return isSuperAdmin ? children : fallback;
};

SuperAdminOnly.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default PermissionGate;
