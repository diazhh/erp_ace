const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Directorio base para uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../../../uploads');

// Tipos de archivo permitidos
const ALLOWED_MIME_TYPES = {
  // Imágenes
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/heic': ['.heic'],
  'image/heif': ['.heif'],
  // Documentos
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
};

// Límites
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
const MAX_FILES = parseInt(process.env.MAX_FILES) || 10;

/**
 * Crea el directorio si no existe
 */
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Obtiene el directorio de destino basado en el tipo de entidad
 */
const getDestinationDir = (entityType) => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Mapeo de entityType a carpeta
  const folderMap = {
    'transaction': 'finance/transactions',
    'petty_cash_entry': 'finance/petty-cash',
    'vehicle_maintenance': 'fleet/maintenance',
    'fuel_log': 'fleet/fuel',
    'contractor_payment': 'projects/payments',
    'project_expense': 'projects/expenses',
    'project': 'projects/general',
    'incident': 'hse/incidents',
    'inspection': 'hse/inspections',
    'quote': 'procurement/quotes',
    'purchase_order': 'procurement/orders',
    'contractor_invoice': 'contractors/invoices',
    'inventory_movement': 'inventory/movements',
    'loan_payment': 'payroll/loans',
    'employee_document': 'employees/documents',
    'training': 'hse/training',
  };

  const folder = folderMap[entityType] || 'general';
  return path.join(UPLOAD_DIR, folder, String(year), month);
};

/**
 * Configuración de almacenamiento para multer
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const entityType = req.params.entityType || 'general';
    const destDir = getDestinationDir(entityType);
    ensureDir(destDir);
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

/**
 * Filtro de archivos
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

/**
 * Instancia de multer configurada
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

/**
 * Genera thumbnail para imágenes
 * @param {string} filePath - Path del archivo original
 * @param {string} mimeType - Tipo MIME del archivo
 * @returns {Promise<string|null>} - Path del thumbnail o null
 */
const generateThumbnail = async (filePath, mimeType) => {
  // Solo generar thumbnails para imágenes
  if (!mimeType.startsWith('image/')) {
    return null;
  }

  try {
    // Intentar cargar sharp dinámicamente
    let sharp;
    try {
      sharp = require('sharp');
    } catch (e) {
      console.warn('Sharp no está instalado, no se generarán thumbnails');
      return null;
    }

    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const thumbDir = path.join(UPLOAD_DIR, 'thumbnails', path.relative(UPLOAD_DIR, dir));
    
    ensureDir(thumbDir);
    
    const thumbPath = path.join(thumbDir, `${baseName}_thumb${ext}`);
    
    await sharp(filePath)
      .resize(300, 300, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toFile(thumbPath.replace(ext, '.jpg'));

    return thumbPath.replace(ext, '.jpg');
  } catch (error) {
    console.error('Error generando thumbnail:', error.message);
    return null;
  }
};

/**
 * Obtiene metadatos de una imagen
 * @param {string} filePath - Path del archivo
 * @param {string} mimeType - Tipo MIME
 * @returns {Promise<Object>} - Metadatos
 */
const getImageMetadata = async (filePath, mimeType) => {
  if (!mimeType.startsWith('image/')) {
    return {};
  }

  try {
    let sharp;
    try {
      sharp = require('sharp');
    } catch (e) {
      return {};
    }

    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      space: metadata.space,
      hasAlpha: metadata.hasAlpha,
    };
  } catch (error) {
    console.error('Error obteniendo metadatos:', error.message);
    return {};
  }
};

/**
 * Convierte path absoluto a URL relativa
 * @param {string} absolutePath - Path absoluto del archivo
 * @returns {string} - URL relativa
 */
const pathToUrl = (absolutePath) => {
  if (!absolutePath) return null;
  const relativePath = path.relative(UPLOAD_DIR, absolutePath);
  return `/uploads/${relativePath.replace(/\\/g, '/')}`;
};

/**
 * Convierte URL relativa a path absoluto
 * @param {string} url - URL relativa
 * @returns {string} - Path absoluto
 */
const urlToPath = (url) => {
  if (!url) return null;
  const relativePath = url.replace('/uploads/', '');
  return path.join(UPLOAD_DIR, relativePath);
};

/**
 * Elimina un archivo del sistema de archivos
 * @param {string} fileUrl - URL del archivo
 * @returns {Promise<boolean>} - true si se eliminó correctamente
 */
const deleteFile = async (fileUrl) => {
  try {
    const filePath = urlToPath(fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error eliminando archivo:', error.message);
    return false;
  }
};

/**
 * Verifica si un tipo MIME es una imagen
 * @param {string} mimeType - Tipo MIME
 * @returns {boolean}
 */
const isImage = (mimeType) => {
  return mimeType && mimeType.startsWith('image/');
};

/**
 * Verifica si un tipo MIME es un documento
 * @param {string} mimeType - Tipo MIME
 * @returns {boolean}
 */
const isDocument = (mimeType) => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ];
  return documentTypes.includes(mimeType);
};

/**
 * Formatea el tamaño del archivo
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = {
  upload,
  generateThumbnail,
  getImageMetadata,
  pathToUrl,
  urlToPath,
  deleteFile,
  isImage,
  isDocument,
  formatFileSize,
  ensureDir,
  getDestinationDir,
  UPLOAD_DIR,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES,
};
