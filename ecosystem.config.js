module.exports = {
  apps: [
    {
      name: 'erp-backend',
      script: 'src/server.js',
      cwd: '/var/erp_ace/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    },
    {
      name: 'erp-frontend',
      script: 'npx',
      args: 'serve -s dist -l 5004',
      cwd: '/var/erp_ace/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};