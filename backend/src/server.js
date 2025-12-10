require('dotenv').config();
const app = require('./app');
const config = require('./config');
const { connectDB, sequelize } = require('./database');
const logger = require('./shared/utils/logger');

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Sincronizar modelos (solo en desarrollo)
    if (config.env === 'development') {
      // Importar modelos para que se registren las asociaciones
      const models = require('./database/models');
      
      // Sincronizar sin alter para evitar conflictos con constraints existentes
      // Para cambios de esquema, usar migraciones
      try {
        await sequelize.sync();
        logger.info('✅ Modelos sincronizados con la base de datos');
      } catch (syncError) {
        logger.warn('⚠️ Advertencia al sincronizar modelos (puede ignorarse si las tablas ya existen):', syncError.message);
      }

      // Initialize WhatsApp user controller with models
      const userWhatsappController = require('./modules/whatsapp/controllers/userWhatsappController');
      userWhatsappController.setModels(models);
    } else {
      // Production: also initialize models
      const models = require('./database/models');
      const userWhatsappController = require('./modules/whatsapp/controllers/userWhatsappController');
      userWhatsappController.setModels(models);
    }

    // Iniciar servidor
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Servidor corriendo en puerto ${config.port}`);
      logger.info(`📍 Entorno: ${config.env}`);
      logger.info(`🔗 Health check: http://localhost:${config.port}/health`);
    });

    // Manejo de señales de terminación
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} recibido. Cerrando servidor...`);
      
      server.close(async () => {
        logger.info('Servidor HTTP cerrado');
        
        try {
          await sequelize.close();
          logger.info('Conexión a base de datos cerrada');
          process.exit(0);
        } catch (error) {
          logger.error('Error al cerrar conexión a BD:', error);
          process.exit(1);
        }
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        logger.error('Cierre forzado después de timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
