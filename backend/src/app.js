const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler');

// Rutas
const authRoutes = require('./modules/auth/routes/authRoutes');
const userRoutes = require('./modules/auth/routes/userRoutes');
const roleRoutes = require('./modules/auth/routes/roleRoutes');
const permissionRoutes = require('./modules/auth/routes/permissionRoutes');
const employeeRoutes = require('./modules/employees/routes/employeeRoutes');
const organizationRoutes = require('./modules/employees/routes/organizationRoutes');
const employeeBankAccountRoutes = require('./modules/employees/routes/employeeBankAccountRoutes');
const payrollRoutes = require('./modules/payroll/routes/payrollRoutes');
const financeRoutes = require('./modules/finance/routes/financeRoutes');
const pettyCashRoutes = require('./modules/petty-cash/routes/pettyCashRoutes');
const projectRoutes = require('./modules/projects/routes/projectRoutes');
const contractorRoutes = require('./modules/projects/routes/contractorRoutes');
const inventoryRoutes = require('./modules/inventory/routes/inventoryRoutes');
const fleetRoutes = require('./modules/fleet/routes/fleetRoutes');
const procurementRoutes = require('./modules/procurement/routes/procurementRoutes');
const hseRoutes = require('./modules/hse/routes/hseRoutes');
const documentRoutes = require('./modules/documents/routes/documentRoutes');
const dashboardRoutes = require('./modules/dashboard/routes/dashboardRoutes');
const attachmentRoutes = require('./modules/attachments/routes/attachmentRoutes');
const reportRoutes = require('./modules/reports/routes/reportRoutes');
const backupRoutes = require('./modules/backup/backup.routes');
const approvalRoutes = require('./modules/approvals/routes/approvalRoutes');
const whatsappRoutes = require('./modules/whatsapp/routes/whatsappRoutes');
const emailRoutes = require('./modules/email/routes/emailRoutes');

const app = express();

// Middleware de seguridad
app.use(helmet());

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5004',
  'https://erp.atilax.io',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/employee-bank-accounts', employeeBankAccountRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/petty-cash', pettyCashRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/hse', hseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/email', emailRoutes);

// Servir archivos estáticos de uploads
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use(notFoundHandler);

// Error handler global
app.use(errorHandler);

module.exports = app;
