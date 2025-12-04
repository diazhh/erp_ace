const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler');

// Rutas
const authRoutes = require('./modules/auth/routes/authRoutes');
const employeeRoutes = require('./modules/employees/routes/employeeRoutes');
const organizationRoutes = require('./modules/employees/routes/organizationRoutes');
const employeeBankAccountRoutes = require('./modules/employees/routes/employeeBankAccountRoutes');
const payrollRoutes = require('./modules/payroll/routes/payrollRoutes');
const financeRoutes = require('./modules/finance/routes/financeRoutes');
const pettyCashRoutes = require('./modules/petty-cash/routes/pettyCashRoutes');
const projectRoutes = require('./modules/projects/routes/projectRoutes');

const app = express();

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging HTTP
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/employee-bank-accounts', employeeBankAccountRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/petty-cash', pettyCashRoutes);
app.use('/api/projects', projectRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler global
app.use(errorHandler);

module.exports = app;
