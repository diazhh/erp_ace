import { useSelector } from 'react-redux';
import { useMemo } from 'react';

/**
 * Verifica si un usuario tiene un permiso específico
 * Soporta permisos granulares: modulo:accion[:campo]
 * 
 * @param {string[]} userPermissions - Lista de permisos del usuario
 * @param {string} requiredPermission - Permiso requerido (ej: 'employees:read:payroll')
 * @returns {boolean}
 */
export const checkPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }

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
 * Hook para verificar un permiso específico
 * @param {string} permission - Permiso a verificar
 * @returns {boolean}
 */
export const usePermission = (permission) => {
  const permissions = useSelector(state => state.auth.permissions);
  
  return useMemo(() => {
    return checkPermission(permissions, permission);
  }, [permissions, permission]);
};

/**
 * Hook para verificar múltiples permisos
 * @param {string[]} permissionList - Lista de permisos a verificar
 * @returns {boolean[]} - Array de booleanos indicando si tiene cada permiso
 */
export const usePermissions = (permissionList) => {
  const permissions = useSelector(state => state.auth.permissions);
  
  return useMemo(() => {
    return permissionList.map(p => checkPermission(permissions, p));
  }, [permissions, permissionList]);
};

/**
 * Hook para verificar si tiene al menos uno de los permisos
 * @param {string[]} permissionList - Lista de permisos
 * @returns {boolean}
 */
export const useAnyPermission = (permissionList) => {
  const permissions = useSelector(state => state.auth.permissions);
  
  return useMemo(() => {
    return permissionList.some(p => checkPermission(permissions, p));
  }, [permissions, permissionList]);
};

/**
 * Hook para verificar si tiene todos los permisos
 * @param {string[]} permissionList - Lista de permisos
 * @returns {boolean}
 */
export const useAllPermissions = (permissionList) => {
  const permissions = useSelector(state => state.auth.permissions);
  
  return useMemo(() => {
    return permissionList.every(p => checkPermission(permissions, p));
  }, [permissions, permissionList]);
};

/**
 * Hook para obtener todos los permisos del usuario
 * @returns {string[]}
 */
export const useUserPermissions = () => {
  return useSelector(state => state.auth.permissions) || [];
};

/**
 * Hook para verificar si el usuario es Super Admin
 * @returns {boolean}
 */
export const useIsSuperAdmin = () => {
  const permissions = useSelector(state => state.auth.permissions);
  return permissions?.includes('*:*') || false;
};

export default usePermission;
