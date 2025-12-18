/**
 * Utilidad para construir URLs de archivos correctamente
 * El backend sirve archivos estáticos en /uploads, no en /api/uploads
 */

/**
 * Obtiene la URL base del servidor (sin /api)
 * @returns {string} URL base del servidor
 */
export const getServerBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  
  // Si es una URL absoluta, remover /api del final
  if (apiUrl.startsWith('http')) {
    return apiUrl.replace(/\/api\/?$/, '');
  }
  
  // Si es relativa (/api), usar el origen actual
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback para desarrollo
  return 'http://localhost:5000';
};

/**
 * Construye la URL completa para un archivo
 * @param {string} fileUrl - URL relativa del archivo (ej: /uploads/...)
 * @returns {string} URL completa del archivo
 */
export const getFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  
  // Si ya es una URL absoluta, devolverla tal cual
  if (fileUrl.startsWith('http')) {
    return fileUrl;
  }
  
  const baseUrl = getServerBaseUrl();
  return `${baseUrl}${fileUrl}`;
};

export default {
  getServerBaseUrl,
  getFileUrl,
};
