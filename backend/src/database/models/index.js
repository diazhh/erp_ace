const { sequelize } = require('../index');
const User = require('../../modules/auth/models/User');
const Role = require('../../modules/auth/models/Role');
const Permission = require('../../modules/auth/models/Permission');
const AuditLog = require('../../modules/audit/models/AuditLog');
const Employee = require('../../modules/employees/models/Employee');
const EmployeeDocument = require('../../modules/employees/models/EmployeeDocument');
const Department = require('../../modules/employees/models/Department');
const Position = require('../../modules/employees/models/Position');
const EmployeeBankAccount = require('../../modules/employees/models/EmployeeBankAccount');
// Payroll models
const PayrollPeriod = require('../../modules/payroll/models/PayrollPeriod');
const PayrollEntry = require('../../modules/payroll/models/PayrollEntry');
const EmployeeLoan = require('../../modules/payroll/models/EmployeeLoan');
const LoanPayment = require('../../modules/payroll/models/LoanPayment');
// Finance models
const BankAccount = require('../../modules/finance/models/BankAccount');
const Transaction = require('../../modules/finance/models/Transaction');
const ExchangeRate = require('../../modules/finance/models/ExchangeRate');
const TransactionCategory = require('../../modules/finance/models/TransactionCategory');
// Petty Cash models
const PettyCash = require('../../modules/petty-cash/models/PettyCash');
const PettyCashEntry = require('../../modules/petty-cash/models/PettyCashEntry');
// Project models
const Project = require('../../modules/projects/models/Project');
const ProjectMember = require('../../modules/projects/models/ProjectMember');
const ProjectMilestone = require('../../modules/projects/models/ProjectMilestone');
const ProjectExpense = require('../../modules/projects/models/ProjectExpense');

// Inicializar modelos
const models = {
  User: User(sequelize),
  Role: Role(sequelize),
  Permission: Permission(sequelize),
  AuditLog: AuditLog(sequelize),
  Employee: Employee(sequelize),
  EmployeeDocument: EmployeeDocument(sequelize),
  Department: Department(sequelize),
  Position: Position(sequelize),
  EmployeeBankAccount: EmployeeBankAccount(sequelize),
  // Payroll
  PayrollPeriod: PayrollPeriod(sequelize),
  PayrollEntry: PayrollEntry(sequelize),
  EmployeeLoan: EmployeeLoan(sequelize),
  LoanPayment: LoanPayment(sequelize),
  // Finance
  BankAccount: BankAccount(sequelize),
  Transaction: Transaction(sequelize),
  ExchangeRate: ExchangeRate(sequelize),
  TransactionCategory: TransactionCategory(sequelize),
  // Petty Cash
  PettyCash: PettyCash(sequelize),
  PettyCashEntry: PettyCashEntry(sequelize),
  // Projects
  Project: Project(sequelize),
  ProjectMember: ProjectMember(sequelize),
  ProjectMilestone: ProjectMilestone(sequelize),
  ProjectExpense: ProjectExpense(sequelize),
};

// Definir asociaciones
// User <-> Role (many-to-many)
models.User.belongsToMany(models.Role, {
  through: 'user_roles',
  foreignKey: 'user_id',
  otherKey: 'role_id',
  as: 'roles',
});
models.Role.belongsToMany(models.User, {
  through: 'user_roles',
  foreignKey: 'role_id',
  otherKey: 'user_id',
  as: 'users',
});

// Role <-> Permission (many-to-many)
models.Role.belongsToMany(models.Permission, {
  through: 'role_permissions',
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions',
});
models.Permission.belongsToMany(models.Role, {
  through: 'role_permissions',
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles',
});

// AuditLog -> User
models.AuditLog.belongsTo(models.User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Employee -> User (opcional)
models.Employee.belongsTo(models.User, {
  foreignKey: 'user_id',
  as: 'user',
});
models.User.hasOne(models.Employee, {
  foreignKey: 'user_id',
  as: 'employee',
});

// Employee <-> EmployeeDocument
models.Employee.hasMany(models.EmployeeDocument, {
  foreignKey: 'employee_id',
  as: 'documents',
});
models.EmployeeDocument.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});

// ========== ORGANIZATION STRUCTURE ==========

// Department self-reference (hierarchy)
models.Department.belongsTo(models.Department, {
  foreignKey: 'parent_id',
  as: 'parent',
});
models.Department.hasMany(models.Department, {
  foreignKey: 'parent_id',
  as: 'children',
});

// Department -> Employee (manager)
models.Department.belongsTo(models.Employee, {
  foreignKey: 'manager_id',
  as: 'manager',
});

// Position -> Department
models.Position.belongsTo(models.Department, {
  foreignKey: 'department_id',
  as: 'department',
});
models.Department.hasMany(models.Position, {
  foreignKey: 'department_id',
  as: 'positions',
});

// Employee -> Department
models.Employee.belongsTo(models.Department, {
  foreignKey: 'department_id',
  as: 'departmentRef',
});
models.Department.hasMany(models.Employee, {
  foreignKey: 'department_id',
  as: 'employees',
});

// Employee -> Position
models.Employee.belongsTo(models.Position, {
  foreignKey: 'position_id',
  as: 'positionRef',
});
models.Position.hasMany(models.Employee, {
  foreignKey: 'position_id',
  as: 'employees',
});

// Employee self-reference (supervisor/subordinates)
models.Employee.belongsTo(models.Employee, {
  foreignKey: 'supervisor_id',
  as: 'supervisor',
});
models.Employee.hasMany(models.Employee, {
  foreignKey: 'supervisor_id',
  as: 'subordinates',
});

// Employee <-> EmployeeBankAccount
models.Employee.hasMany(models.EmployeeBankAccount, {
  foreignKey: 'employee_id',
  as: 'bankAccounts',
});
models.EmployeeBankAccount.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});

// EmployeeBankAccount -> User (verifiedBy)
models.EmployeeBankAccount.belongsTo(models.User, {
  foreignKey: 'verified_by',
  as: 'verifier',
});

// ========== PAYROLL ASSOCIATIONS ==========

// PayrollPeriod -> User (createdBy, approvedBy)
models.PayrollPeriod.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.PayrollPeriod.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});

// PayrollPeriod <-> PayrollEntry
models.PayrollPeriod.hasMany(models.PayrollEntry, {
  foreignKey: 'period_id',
  as: 'entries',
});
models.PayrollEntry.belongsTo(models.PayrollPeriod, {
  foreignKey: 'period_id',
  as: 'period',
});

// PayrollEntry -> Employee
models.PayrollEntry.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});
models.Employee.hasMany(models.PayrollEntry, {
  foreignKey: 'employee_id',
  as: 'payrollEntries',
});

// EmployeeLoan -> Employee
models.EmployeeLoan.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});
models.Employee.hasMany(models.EmployeeLoan, {
  foreignKey: 'employee_id',
  as: 'loans',
});

// EmployeeLoan -> User (approvedBy, createdBy)
models.EmployeeLoan.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});
models.EmployeeLoan.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// LoanPayment -> EmployeeLoan
models.LoanPayment.belongsTo(models.EmployeeLoan, {
  foreignKey: 'loan_id',
  as: 'loan',
});
models.EmployeeLoan.hasMany(models.LoanPayment, {
  foreignKey: 'loan_id',
  as: 'payments',
});

// LoanPayment -> PayrollEntry (optional)
models.LoanPayment.belongsTo(models.PayrollEntry, {
  foreignKey: 'payroll_entry_id',
  as: 'payrollEntry',
});

// ========== FINANCE ASSOCIATIONS ==========

// BankAccount -> User (createdBy)
models.BankAccount.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// BankAccount <-> Transaction
models.BankAccount.hasMany(models.Transaction, {
  foreignKey: 'account_id',
  as: 'transactions',
});
models.Transaction.belongsTo(models.BankAccount, {
  foreignKey: 'account_id',
  as: 'account',
});
models.Transaction.belongsTo(models.BankAccount, {
  foreignKey: 'destination_account_id',
  as: 'destinationAccount',
});

// Transaction -> User (createdBy, reconciledBy)
models.Transaction.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.Transaction.belongsTo(models.User, {
  foreignKey: 'reconciled_by',
  as: 'reconciler',
});

// Transaction -> Employee (optional)
models.Transaction.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});

// ExchangeRate -> User (createdBy)
models.ExchangeRate.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// TransactionCategory self-reference
models.TransactionCategory.belongsTo(models.TransactionCategory, {
  foreignKey: 'parent_id',
  as: 'parent',
});
models.TransactionCategory.hasMany(models.TransactionCategory, {
  foreignKey: 'parent_id',
  as: 'subcategories',
});

// ========== PETTY CASH ASSOCIATIONS ==========

// PettyCash -> Employee (custodian)
models.PettyCash.belongsTo(models.Employee, {
  foreignKey: 'custodian_id',
  as: 'custodian',
});
models.Employee.hasMany(models.PettyCash, {
  foreignKey: 'custodian_id',
  as: 'pettyCashes',
});

// PettyCash -> User (createdBy)
models.PettyCash.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// PettyCash -> BankAccount (for replenishments)
models.PettyCash.belongsTo(models.BankAccount, {
  foreignKey: 'bank_account_id',
  as: 'bankAccount',
});

// PettyCash <-> PettyCashEntry
models.PettyCash.hasMany(models.PettyCashEntry, {
  foreignKey: 'petty_cash_id',
  as: 'entries',
});
models.PettyCashEntry.belongsTo(models.PettyCash, {
  foreignKey: 'petty_cash_id',
  as: 'pettyCash',
});

// PettyCashEntry -> Employee (beneficiary)
models.PettyCashEntry.belongsTo(models.Employee, {
  foreignKey: 'beneficiary_id',
  as: 'beneficiary',
});

// PettyCashEntry -> User (createdBy, approvedBy)
models.PettyCashEntry.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.PettyCashEntry.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});

// PettyCashEntry -> Transaction (for replenishments)
models.PettyCashEntry.belongsTo(models.Transaction, {
  foreignKey: 'transaction_id',
  as: 'transaction',
});

// ========== PROJECT ASSOCIATIONS ==========

// Project -> Employee (manager)
models.Project.belongsTo(models.Employee, {
  foreignKey: 'manager_id',
  as: 'manager',
});
models.Employee.hasMany(models.Project, {
  foreignKey: 'manager_id',
  as: 'managedProjects',
});

// Project -> Department
models.Project.belongsTo(models.Department, {
  foreignKey: 'department_id',
  as: 'department',
});
models.Department.hasMany(models.Project, {
  foreignKey: 'department_id',
  as: 'projects',
});

// Project -> PettyCash
models.Project.belongsTo(models.PettyCash, {
  foreignKey: 'petty_cash_id',
  as: 'pettyCash',
});
models.PettyCash.hasOne(models.Project, {
  foreignKey: 'petty_cash_id',
  as: 'project',
});

// Project -> User (createdBy)
models.Project.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Project <-> ProjectMember
models.Project.hasMany(models.ProjectMember, {
  foreignKey: 'project_id',
  as: 'members',
});
models.ProjectMember.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// ProjectMember -> Employee
models.ProjectMember.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});
models.Employee.hasMany(models.ProjectMember, {
  foreignKey: 'employee_id',
  as: 'projectAssignments',
});

// Project <-> ProjectMilestone
models.Project.hasMany(models.ProjectMilestone, {
  foreignKey: 'project_id',
  as: 'milestones',
});
models.ProjectMilestone.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// ProjectMilestone -> Employee (assignee)
models.ProjectMilestone.belongsTo(models.Employee, {
  foreignKey: 'assignee_id',
  as: 'assignee',
});

// ProjectMilestone -> User (createdBy, completedBy)
models.ProjectMilestone.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.ProjectMilestone.belongsTo(models.User, {
  foreignKey: 'completed_by',
  as: 'completer',
});

// Project <-> ProjectExpense
models.Project.hasMany(models.ProjectExpense, {
  foreignKey: 'project_id',
  as: 'expenses',
});
models.ProjectExpense.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// ProjectExpense -> Employee
models.ProjectExpense.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});

// ProjectExpense -> ProjectMilestone
models.ProjectExpense.belongsTo(models.ProjectMilestone, {
  foreignKey: 'milestone_id',
  as: 'milestone',
});

// ProjectExpense -> Transaction
models.ProjectExpense.belongsTo(models.Transaction, {
  foreignKey: 'transaction_id',
  as: 'transaction',
});

// ProjectExpense -> PettyCashEntry
models.ProjectExpense.belongsTo(models.PettyCashEntry, {
  foreignKey: 'petty_cash_entry_id',
  as: 'pettyCashEntry',
});

// ProjectExpense -> User (createdBy, approvedBy)
models.ProjectExpense.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.ProjectExpense.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});

module.exports = models;
