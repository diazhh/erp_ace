require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    name: process.env.DB_NAME || 'erp_db',
    user: process.env.DB_USER || 'erp_user',
    password: process.env.DB_PASSWORD || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    expire: process.env.JWT_EXPIRE || '8h',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
