const { Sequelize } = require('sequelize');
const config = require('../config');
const logger = require('../shared/utils/logger');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: config.env === 'development' ? (msg) => logger.debug(msg) : false,
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a PostgreSQL establecida correctamente');
    return true;
  } catch (error) {
    logger.error('❌ Error al conectar a PostgreSQL:', error);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
