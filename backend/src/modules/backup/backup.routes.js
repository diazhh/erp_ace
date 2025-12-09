const express = require('express');
const router = express.Router();
const authenticate = require('../auth/middleware/authenticate');
const { authorize } = require('../auth/middleware/authorize');
const backupController = require('./backup.controller');

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticate);
router.use(authorize('admin'));

// GET /api/backup/status - Obtener estado del último respaldo
router.get('/status', backupController.getBackupStatus);

// GET /api/backup/list - Listar todos los respaldos
router.get('/list', backupController.listBackups);

// POST /api/backup/create - Crear nuevo respaldo
router.post('/create', backupController.createBackup);

// POST /api/backup/restore - Restaurar desde respaldo
router.post('/restore', backupController.restoreBackup);

// GET /api/backup/download/:filename - Descargar archivo de respaldo
router.get('/download/:filename', backupController.downloadBackup);

// DELETE /api/backup/:filename - Eliminar un respaldo
router.delete('/:filename', backupController.deleteBackup);

module.exports = router;
