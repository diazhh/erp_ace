const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');

const execAsync = promisify(exec);

const BACKUP_DIR = path.join(__dirname, '../../../backups');
const SCRIPTS_DIR = path.join(__dirname, '../../../scripts');

/**
 * Obtener información del último respaldo
 */
const getBackupStatus = async (req, res) => {
  try {
    const latestBackupPath = path.join(BACKUP_DIR, 'latest_backup.json');
    
    // Verificar si existe el directorio de backups
    try {
      await fs.access(BACKUP_DIR);
    } catch {
      await fs.mkdir(BACKUP_DIR, { recursive: true });
    }
    
    // Verificar si existe información del último backup
    try {
      const data = await fs.readFile(latestBackupPath, 'utf8');
      const backupInfo = JSON.parse(data);
      
      // Verificar si el archivo de backup aún existe
      try {
        await fs.access(backupInfo.path);
        backupInfo.exists = true;
      } catch {
        backupInfo.exists = false;
      }
      
      res.json({
        success: true,
        data: backupInfo
      });
    } catch {
      res.json({
        success: true,
        data: null,
        message: 'No hay respaldos disponibles'
      });
    }
  } catch (error) {
    console.error('Error al obtener estado del backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del respaldo',
      error: error.message
    });
  }
};

/**
 * Listar todos los respaldos disponibles
 */
const listBackups = async (req, res) => {
  try {
    // Verificar si existe el directorio
    try {
      await fs.access(BACKUP_DIR);
    } catch {
      await fs.mkdir(BACKUP_DIR, { recursive: true });
      return res.json({
        success: true,
        data: []
      });
    }
    
    const files = await fs.readdir(BACKUP_DIR);
    const backups = [];
    
    for (const file of files) {
      if (file.match(/^erp_backup_.*\.sql\.gz$/)) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        
        // Extraer timestamp del nombre del archivo
        const match = file.match(/erp_backup_(\d{8}_\d{6})\.sql\.gz/);
        const timestamp = match ? match[1] : null;
        
        backups.push({
          filename: file,
          path: filePath,
          size: formatBytes(stats.size),
          sizeBytes: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          timestamp
        });
      }
    }
    
    // Ordenar por fecha de creación (más reciente primero)
    backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    console.error('Error al listar backups:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar respaldos',
      error: error.message
    });
  }
};

/**
 * Crear un nuevo respaldo
 */
const createBackup = async (req, res) => {
  try {
    const backupScript = path.join(SCRIPTS_DIR, 'backup.sh');
    
    // Verificar que el script existe
    try {
      await fs.access(backupScript);
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Script de respaldo no encontrado'
      });
    }
    
    // Hacer el script ejecutable
    await execAsync(`chmod +x "${backupScript}"`);
    
    // Ejecutar el script de backup
    const { stdout, stderr } = await execAsync(`bash "${backupScript}"`, {
      timeout: 300000 // 5 minutos timeout
    });
    
    // Leer información del backup creado
    const latestBackupPath = path.join(BACKUP_DIR, 'latest_backup.json');
    let backupInfo = null;
    
    try {
      const data = await fs.readFile(latestBackupPath, 'utf8');
      backupInfo = JSON.parse(data);
    } catch {
      // No se pudo leer la info del backup
    }
    
    res.json({
      success: true,
      message: 'Respaldo creado exitosamente',
      data: backupInfo,
      log: stdout
    });
  } catch (error) {
    console.error('Error al crear backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear respaldo',
      error: error.message,
      stderr: error.stderr
    });
  }
};

/**
 * Restaurar desde un respaldo
 */
const restoreBackup = async (req, res) => {
  try {
    const { filename } = req.body;
    const restoreScript = path.join(SCRIPTS_DIR, 'restore.sh');
    
    // Verificar que el script existe
    try {
      await fs.access(restoreScript);
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Script de restauración no encontrado'
      });
    }
    
    // Determinar archivo a restaurar
    let backupFile;
    if (filename) {
      backupFile = path.join(BACKUP_DIR, filename);
      try {
        await fs.access(backupFile);
      } catch {
        return res.status(404).json({
          success: false,
          message: 'Archivo de respaldo no encontrado'
        });
      }
    }
    
    // Hacer el script ejecutable
    await execAsync(`chmod +x "${restoreScript}"`);
    
    // Ejecutar el script de restauración
    const command = filename 
      ? `bash "${restoreScript}" "${backupFile}"`
      : `bash "${restoreScript}"`;
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 600000 // 10 minutos timeout
    });
    
    res.json({
      success: true,
      message: 'Base de datos restaurada exitosamente',
      log: stdout
    });
  } catch (error) {
    console.error('Error al restaurar backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restaurar respaldo',
      error: error.message,
      stderr: error.stderr
    });
  }
};

/**
 * Descargar un archivo de respaldo
 */
const downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename || !filename.match(/^erp_backup_.*\.sql\.gz$/)) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de archivo inválido'
      });
    }
    
    const filePath = path.join(BACKUP_DIR, filename);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'Archivo de respaldo no encontrado'
      });
    }
    
    res.download(filePath, filename);
  } catch (error) {
    console.error('Error al descargar backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error al descargar respaldo',
      error: error.message
    });
  }
};

/**
 * Eliminar un respaldo específico
 */
const deleteBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename || !filename.match(/^erp_backup_.*\.sql\.gz$/)) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de archivo inválido'
      });
    }
    
    const filePath = path.join(BACKUP_DIR, filename);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'Archivo de respaldo no encontrado'
      });
    }
    
    await fs.unlink(filePath);
    
    // Si era el último backup, eliminar también el archivo de metadatos
    const latestBackupPath = path.join(BACKUP_DIR, 'latest_backup.json');
    try {
      const data = await fs.readFile(latestBackupPath, 'utf8');
      const backupInfo = JSON.parse(data);
      if (backupInfo.filename === filename) {
        await fs.unlink(latestBackupPath);
      }
    } catch {
      // Ignorar errores al leer/eliminar metadatos
    }
    
    res.json({
      success: true,
      message: 'Respaldo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar respaldo',
      error: error.message
    });
  }
};

/**
 * Formatear bytes a unidades legibles
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {
  getBackupStatus,
  listBackups,
  createBackup,
  restoreBackup,
  downloadBackup,
  deleteBackup
};
