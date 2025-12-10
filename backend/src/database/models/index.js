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
const Contractor = require('../../modules/projects/models/Contractor');
const ContractorBankAccount = require('../../modules/projects/models/ContractorBankAccount');
const ContractorDocument = require('../../modules/projects/models/ContractorDocument');
const ContractorInvoice = require('../../modules/projects/models/ContractorInvoice');
const ContractorPayment = require('../../modules/projects/models/ContractorPayment');
const PurchaseOrder = require('../../modules/projects/models/PurchaseOrder');
const PurchaseOrderItem = require('../../modules/projects/models/PurchaseOrderItem');
const Project = require('../../modules/projects/models/Project');
const ProjectMember = require('../../modules/projects/models/ProjectMember');
const ProjectMilestone = require('../../modules/projects/models/ProjectMilestone');
const ProjectExpense = require('../../modules/projects/models/ProjectExpense');
const ProjectUpdate = require('../../modules/projects/models/ProjectUpdate');
const ProjectPhoto = require('../../modules/projects/models/ProjectPhoto');
const ProjectValuation = require('../../modules/projects/models/ProjectValuation');
// Inventory models
const Warehouse = require('../../modules/inventory/models/Warehouse');
const InventoryCategory = require('../../modules/inventory/models/InventoryCategory');
const InventoryItem = require('../../modules/inventory/models/InventoryItem');
const WarehouseStock = require('../../modules/inventory/models/WarehouseStock');
const InventoryMovement = require('../../modules/inventory/models/InventoryMovement');
const Product = require('../../modules/inventory/models/Product');
const InventoryUnit = require('../../modules/inventory/models/InventoryUnit');
const InventoryUnitHistory = require('../../modules/inventory/models/InventoryUnitHistory');
// Fleet models
const Vehicle = require('../../modules/fleet/models/Vehicle');
const VehicleAssignment = require('../../modules/fleet/models/VehicleAssignment');
const VehicleMaintenance = require('../../modules/fleet/models/VehicleMaintenance');
const FuelLog = require('../../modules/fleet/models/FuelLog');
// Procurement models
const Quote = require('../../modules/procurement/models/Quote');
const QuoteItem = require('../../modules/procurement/models/QuoteItem');
const QuoteRequest = require('../../modules/procurement/models/QuoteRequest');
// HSE models
const Incident = require('../../modules/hse/models/Incident');
const Inspection = require('../../modules/hse/models/Inspection');
const Training = require('../../modules/hse/models/Training');
const TrainingAttendance = require('../../modules/hse/models/TrainingAttendance');
const SafetyEquipment = require('../../modules/hse/models/SafetyEquipment');
// Document models
const DocumentCategory = require('../../modules/documents/models/DocumentCategory');
const Document = require('../../modules/documents/models/Document');
const DocumentVersion = require('../../modules/documents/models/DocumentVersion');
const DocumentShare = require('../../modules/documents/models/DocumentShare');
// Attachment model
const Attachment = require('../../modules/attachments/models/Attachment');
// WhatsApp models
const WhatsAppSession = require('../../modules/whatsapp/models/WhatsAppSession');
const UserWhatsApp = require('../../modules/whatsapp/models/UserWhatsApp');
// Email models
const EmailConfig = require('../../modules/email/models/EmailConfig');
const EmailTemplate = require('../../modules/email/models/EmailTemplate');
const UserEmail = require('../../modules/email/models/UserEmail');
const EmailLog = require('../../modules/email/models/EmailLog');

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
  // Projects & Contractors
  Contractor: Contractor(sequelize),
  ContractorBankAccount: ContractorBankAccount(sequelize),
  ContractorDocument: ContractorDocument(sequelize),
  ContractorInvoice: ContractorInvoice(sequelize),
  ContractorPayment: ContractorPayment(sequelize),
  PurchaseOrder: PurchaseOrder(sequelize),
  PurchaseOrderItem: PurchaseOrderItem(sequelize),
  Project: Project(sequelize),
  ProjectMember: ProjectMember(sequelize),
  ProjectMilestone: ProjectMilestone(sequelize),
  ProjectExpense: ProjectExpense(sequelize),
  ProjectUpdate: ProjectUpdate(sequelize),
  ProjectPhoto: ProjectPhoto(sequelize),
  ProjectValuation: ProjectValuation(sequelize),
  // Inventory
  Warehouse: Warehouse(sequelize),
  InventoryCategory: InventoryCategory(sequelize),
  InventoryItem: InventoryItem(sequelize),
  WarehouseStock: WarehouseStock(sequelize),
  InventoryMovement: InventoryMovement(sequelize),
  Product: Product(sequelize),
  InventoryUnit: InventoryUnit(sequelize),
  InventoryUnitHistory: InventoryUnitHistory(sequelize),
  // Fleet
  Vehicle: Vehicle(sequelize),
  VehicleAssignment: VehicleAssignment(sequelize),
  VehicleMaintenance: VehicleMaintenance(sequelize),
  FuelLog: FuelLog(sequelize),
  // Procurement
  Quote: Quote(sequelize),
  QuoteItem: QuoteItem(sequelize),
  QuoteRequest: QuoteRequest(sequelize),
  // HSE
  Incident: Incident(sequelize),
  Inspection: Inspection(sequelize),
  Training: Training(sequelize),
  TrainingAttendance: TrainingAttendance(sequelize),
  SafetyEquipment: SafetyEquipment(sequelize),
  // Documents
  DocumentCategory: DocumentCategory(sequelize),
  Document: Document(sequelize),
  DocumentVersion: DocumentVersion(sequelize),
  DocumentShare: DocumentShare(sequelize),
  // Attachments
  Attachment: Attachment(sequelize),
  // WhatsApp
  WhatsAppSession: WhatsAppSession(sequelize),
  UserWhatsApp: UserWhatsApp(sequelize),
  // Email
  EmailConfig: EmailConfig(sequelize),
  EmailTemplate: EmailTemplate(sequelize),
  UserEmail: UserEmail(sequelize),
  EmailLog: EmailLog(sequelize),
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

// Employee -> User (opcional, legacy)
models.Employee.belongsTo(models.User, {
  foreignKey: 'user_id',
  as: 'user',
});
models.User.hasOne(models.Employee, {
  foreignKey: 'user_id',
  as: 'employeeLegacy',
});

// User -> Employee (nueva relación principal)
models.User.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});
models.Employee.hasOne(models.User, {
  foreignKey: 'employee_id',
  as: 'userAccount',
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

// Contractor -> User (createdBy)
models.Contractor.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Contractor <-> Project
models.Contractor.hasMany(models.Project, {
  foreignKey: 'contractor_id',
  as: 'projects',
});
models.Project.belongsTo(models.Contractor, {
  foreignKey: 'contractor_id',
  as: 'contractor',
});

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

// ========== CONTRACTOR EXTENDED ASSOCIATIONS ==========

// Contractor <-> ContractorBankAccount
models.Contractor.hasMany(models.ContractorBankAccount, {
  foreignKey: 'contractor_id',
  as: 'bankAccounts',
});
models.ContractorBankAccount.belongsTo(models.Contractor, {
  foreignKey: 'contractor_id',
  as: 'contractor',
});
models.ContractorBankAccount.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.ContractorBankAccount.belongsTo(models.User, {
  foreignKey: 'verified_by',
  as: 'verifier',
});

// Contractor <-> ContractorDocument
models.Contractor.hasMany(models.ContractorDocument, {
  foreignKey: 'contractor_id',
  as: 'documents',
});
models.ContractorDocument.belongsTo(models.Contractor, {
  foreignKey: 'contractor_id',
  as: 'contractor',
});
models.ContractorDocument.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.ContractorDocument.belongsTo(models.User, {
  foreignKey: 'verified_by',
  as: 'verifier',
});

// Contractor <-> ContractorInvoice
models.Contractor.hasMany(models.ContractorInvoice, {
  foreignKey: 'contractor_id',
  as: 'invoices',
});
models.ContractorInvoice.belongsTo(models.Contractor, {
  foreignKey: 'contractor_id',
  as: 'contractor',
});
models.ContractorInvoice.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.ContractorInvoice.belongsTo(models.PurchaseOrder, {
  foreignKey: 'purchase_order_id',
  as: 'purchaseOrder',
});
models.ContractorInvoice.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.ContractorInvoice.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});

// Contractor <-> ContractorPayment
models.Contractor.hasMany(models.ContractorPayment, {
  foreignKey: 'contractor_id',
  as: 'payments',
});
models.ContractorPayment.belongsTo(models.Contractor, {
  foreignKey: 'contractor_id',
  as: 'contractor',
});
models.ContractorPayment.belongsTo(models.ContractorInvoice, {
  foreignKey: 'invoice_id',
  as: 'invoice',
});
models.ContractorPayment.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.ContractorPayment.belongsTo(models.ContractorBankAccount, {
  foreignKey: 'bank_account_id',
  as: 'bankAccount',
});
models.ContractorPayment.belongsTo(models.BankAccount, {
  foreignKey: 'source_bank_account_id',
  as: 'sourceBankAccount',
});
models.ContractorPayment.belongsTo(models.Transaction, {
  foreignKey: 'transaction_id',
  as: 'transaction',
});
models.ContractorPayment.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.ContractorPayment.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});
models.ContractorPayment.belongsTo(models.User, {
  foreignKey: 'processed_by',
  as: 'processor',
});

// ========== PURCHASE ORDER ASSOCIATIONS ==========

// Contractor <-> PurchaseOrder
models.Contractor.hasMany(models.PurchaseOrder, {
  foreignKey: 'contractor_id',
  as: 'purchaseOrders',
});
models.PurchaseOrder.belongsTo(models.Contractor, {
  foreignKey: 'contractor_id',
  as: 'contractor',
});
models.PurchaseOrder.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.PurchaseOrder.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.PurchaseOrder.belongsTo(models.User, {
  foreignKey: 'requested_by',
  as: 'requester',
});
models.PurchaseOrder.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});

// PurchaseOrder <-> PurchaseOrderItem
models.PurchaseOrder.hasMany(models.PurchaseOrderItem, {
  foreignKey: 'purchase_order_id',
  as: 'items',
});
models.PurchaseOrderItem.belongsTo(models.PurchaseOrder, {
  foreignKey: 'purchase_order_id',
  as: 'purchaseOrder',
});

// PurchaseOrder <-> ContractorInvoice
models.PurchaseOrder.hasMany(models.ContractorInvoice, {
  foreignKey: 'purchase_order_id',
  as: 'invoices',
});

// Project <-> ContractorInvoice
models.Project.hasMany(models.ContractorInvoice, {
  foreignKey: 'project_id',
  as: 'contractorInvoices',
});

// Project <-> ContractorPayment
models.Project.hasMany(models.ContractorPayment, {
  foreignKey: 'project_id',
  as: 'contractorPayments',
});

// Project <-> PurchaseOrder
models.Project.hasMany(models.PurchaseOrder, {
  foreignKey: 'project_id',
  as: 'purchaseOrders',
});

// ContractorInvoice <-> ContractorPayment
models.ContractorInvoice.hasMany(models.ContractorPayment, {
  foreignKey: 'invoice_id',
  as: 'payments',
});

// ========== PROJECT UPDATE & PHOTO ASSOCIATIONS ==========

// Project <-> ProjectUpdate
models.Project.hasMany(models.ProjectUpdate, {
  foreignKey: 'project_id',
  as: 'updates',
});
models.ProjectUpdate.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// ProjectUpdate -> Employee (reportedBy)
models.ProjectUpdate.belongsTo(models.Employee, {
  foreignKey: 'reported_by',
  as: 'reporter',
});
models.Employee.hasMany(models.ProjectUpdate, {
  foreignKey: 'reported_by',
  as: 'projectUpdates',
});

// ProjectUpdate -> ContractorPayment (optional)
models.ProjectUpdate.belongsTo(models.ContractorPayment, {
  foreignKey: 'payment_id',
  as: 'payment',
});

// ProjectUpdate -> ProjectMilestone (optional)
models.ProjectUpdate.belongsTo(models.ProjectMilestone, {
  foreignKey: 'milestone_id',
  as: 'milestone',
});

// Project <-> ProjectPhoto
models.Project.hasMany(models.ProjectPhoto, {
  foreignKey: 'project_id',
  as: 'photos',
});
models.ProjectPhoto.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// ProjectPhoto -> ProjectUpdate (optional)
models.ProjectPhoto.belongsTo(models.ProjectUpdate, {
  foreignKey: 'update_id',
  as: 'update',
});
models.ProjectUpdate.hasMany(models.ProjectPhoto, {
  foreignKey: 'update_id',
  as: 'photos',
});

// ProjectPhoto -> User (uploadedBy)
models.ProjectPhoto.belongsTo(models.User, {
  foreignKey: 'uploaded_by',
  as: 'uploader',
});

// PettyCashEntry -> Project (trazabilidad de gastos de caja chica a proyectos)
models.PettyCashEntry.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Project.hasMany(models.PettyCashEntry, {
  foreignKey: 'project_id',
  as: 'pettyCashEntries',
});

// ========== PROJECT VALUATION ASSOCIATIONS ==========

// Project <-> ProjectValuation
models.Project.hasMany(models.ProjectValuation, {
  foreignKey: 'project_id',
  as: 'valuations',
});
models.ProjectValuation.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// Contractor <-> ProjectValuation
models.Contractor.hasMany(models.ProjectValuation, {
  foreignKey: 'contractor_id',
  as: 'valuations',
});
models.ProjectValuation.belongsTo(models.Contractor, {
  foreignKey: 'contractor_id',
  as: 'contractor',
});

// ProjectValuation <-> ContractorInvoice
models.ProjectValuation.belongsTo(models.ContractorInvoice, {
  foreignKey: 'invoice_id',
  as: 'invoice',
});
models.ContractorInvoice.hasOne(models.ProjectValuation, {
  foreignKey: 'invoice_id',
  as: 'valuation',
});

// ProjectValuation -> User (submittedBy, reviewedBy, approvedBy, createdBy)
models.ProjectValuation.belongsTo(models.User, {
  foreignKey: 'submitted_by',
  as: 'submitter',
});
models.ProjectValuation.belongsTo(models.User, {
  foreignKey: 'reviewed_by',
  as: 'reviewer',
});
models.ProjectValuation.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});
models.ProjectValuation.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// ========== INVENTORY ASSOCIATIONS ==========

// Warehouse -> Employee (manager)
models.Warehouse.belongsTo(models.Employee, {
  foreignKey: 'manager_id',
  as: 'manager',
});
models.Employee.hasMany(models.Warehouse, {
  foreignKey: 'manager_id',
  as: 'managedWarehouses',
});

// Warehouse -> Project
models.Warehouse.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Project.hasMany(models.Warehouse, {
  foreignKey: 'project_id',
  as: 'warehouses',
});

// Warehouse -> User (createdBy)
models.Warehouse.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// InventoryCategory self-reference (hierarchy)
models.InventoryCategory.belongsTo(models.InventoryCategory, {
  foreignKey: 'parent_id',
  as: 'parent',
});
models.InventoryCategory.hasMany(models.InventoryCategory, {
  foreignKey: 'parent_id',
  as: 'children',
});

// InventoryCategory -> User (createdBy)
models.InventoryCategory.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// InventoryItem -> InventoryCategory
models.InventoryItem.belongsTo(models.InventoryCategory, {
  foreignKey: 'category_id',
  as: 'category',
});
models.InventoryCategory.hasMany(models.InventoryItem, {
  foreignKey: 'category_id',
  as: 'items',
});

// InventoryItem -> Contractor (preferred supplier)
models.InventoryItem.belongsTo(models.Contractor, {
  foreignKey: 'preferred_supplier_id',
  as: 'preferredSupplier',
});

// InventoryItem -> User (createdBy)
models.InventoryItem.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// WarehouseStock -> Warehouse
models.WarehouseStock.belongsTo(models.Warehouse, {
  foreignKey: 'warehouse_id',
  as: 'warehouse',
});
models.Warehouse.hasMany(models.WarehouseStock, {
  foreignKey: 'warehouse_id',
  as: 'stocks',
});

// WarehouseStock -> InventoryItem
models.WarehouseStock.belongsTo(models.InventoryItem, {
  foreignKey: 'item_id',
  as: 'item',
});
models.InventoryItem.hasMany(models.WarehouseStock, {
  foreignKey: 'item_id',
  as: 'warehouseStocks',
});

// InventoryMovement -> InventoryItem
models.InventoryMovement.belongsTo(models.InventoryItem, {
  foreignKey: 'item_id',
  as: 'item',
});
models.InventoryItem.hasMany(models.InventoryMovement, {
  foreignKey: 'item_id',
  as: 'movements',
});

// InventoryMovement -> Warehouse (source)
models.InventoryMovement.belongsTo(models.Warehouse, {
  foreignKey: 'source_warehouse_id',
  as: 'sourceWarehouse',
});

// InventoryMovement -> Warehouse (destination)
models.InventoryMovement.belongsTo(models.Warehouse, {
  foreignKey: 'destination_warehouse_id',
  as: 'destinationWarehouse',
});

// InventoryMovement -> Project
models.InventoryMovement.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Project.hasMany(models.InventoryMovement, {
  foreignKey: 'project_id',
  as: 'inventoryMovements',
});

// InventoryMovement -> Employee
models.InventoryMovement.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});

// InventoryMovement -> Contractor (supplier)
models.InventoryMovement.belongsTo(models.Contractor, {
  foreignKey: 'supplier_id',
  as: 'supplier',
});

// InventoryMovement -> User (createdBy, approvedBy)
models.InventoryMovement.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.InventoryMovement.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});

// ========== FLEET ASSOCIATIONS ==========

// Vehicle -> User (createdBy)
models.Vehicle.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Vehicle <-> VehicleAssignment
models.Vehicle.hasMany(models.VehicleAssignment, {
  foreignKey: 'vehicle_id',
  as: 'assignments',
});
models.VehicleAssignment.belongsTo(models.Vehicle, {
  foreignKey: 'vehicle_id',
  as: 'vehicle',
});

// VehicleAssignment -> Employee
models.VehicleAssignment.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});
models.Employee.hasMany(models.VehicleAssignment, {
  foreignKey: 'employee_id',
  as: 'vehicleAssignments',
});

// VehicleAssignment -> Project
models.VehicleAssignment.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Project.hasMany(models.VehicleAssignment, {
  foreignKey: 'project_id',
  as: 'vehicleAssignments',
});

// VehicleAssignment -> Department
models.VehicleAssignment.belongsTo(models.Department, {
  foreignKey: 'department_id',
  as: 'department',
});
models.Department.hasMany(models.VehicleAssignment, {
  foreignKey: 'department_id',
  as: 'vehicleAssignments',
});

// VehicleAssignment -> User (createdBy)
models.VehicleAssignment.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Vehicle <-> VehicleMaintenance
models.Vehicle.hasMany(models.VehicleMaintenance, {
  foreignKey: 'vehicle_id',
  as: 'maintenances',
});
models.VehicleMaintenance.belongsTo(models.Vehicle, {
  foreignKey: 'vehicle_id',
  as: 'vehicle',
});

// VehicleMaintenance -> Transaction
models.VehicleMaintenance.belongsTo(models.Transaction, {
  foreignKey: 'transaction_id',
  as: 'transaction',
});

// VehicleMaintenance -> User (createdBy, completedBy)
models.VehicleMaintenance.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.VehicleMaintenance.belongsTo(models.User, {
  foreignKey: 'completed_by',
  as: 'completer',
});

// Vehicle <-> FuelLog
models.Vehicle.hasMany(models.FuelLog, {
  foreignKey: 'vehicle_id',
  as: 'fuelLogs',
});
models.FuelLog.belongsTo(models.Vehicle, {
  foreignKey: 'vehicle_id',
  as: 'vehicle',
});

// FuelLog -> Employee (driver)
models.FuelLog.belongsTo(models.Employee, {
  foreignKey: 'driver_id',
  as: 'driver',
});
models.Employee.hasMany(models.FuelLog, {
  foreignKey: 'driver_id',
  as: 'fuelLogs',
});

// FuelLog -> Project
models.FuelLog.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Project.hasMany(models.FuelLog, {
  foreignKey: 'project_id',
  as: 'fuelLogs',
});

// FuelLog -> Transaction
models.FuelLog.belongsTo(models.Transaction, {
  foreignKey: 'transaction_id',
  as: 'transaction',
});

// FuelLog -> PettyCashEntry
models.FuelLog.belongsTo(models.PettyCashEntry, {
  foreignKey: 'petty_cash_entry_id',
  as: 'pettyCashEntry',
});

// FuelLog -> User (createdBy)
models.FuelLog.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// FuelLog -> User (approvedBy)
models.FuelLog.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});

// FuelLog -> User (paidBy)
models.FuelLog.belongsTo(models.User, {
  foreignKey: 'paid_by',
  as: 'payer',
});

// PettyCashEntry -> User (paidBy)
models.PettyCashEntry.belongsTo(models.User, {
  foreignKey: 'paid_by',
  as: 'payer',
});

// ========== PROCUREMENT ASSOCIATIONS ==========

// Quote -> Contractor
models.Quote.belongsTo(models.Contractor, {
  foreignKey: 'contractor_id',
  as: 'contractor',
});
models.Contractor.hasMany(models.Quote, {
  foreignKey: 'contractor_id',
  as: 'quotes',
});

// Quote -> Project
models.Quote.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Project.hasMany(models.Quote, {
  foreignKey: 'project_id',
  as: 'quotes',
});

// Quote -> QuoteRequest
models.Quote.belongsTo(models.QuoteRequest, {
  foreignKey: 'quote_request_id',
  as: 'quoteRequest',
});
models.QuoteRequest.hasMany(models.Quote, {
  foreignKey: 'quote_request_id',
  as: 'quotes',
});

// Quote -> PurchaseOrder (generated)
models.Quote.belongsTo(models.PurchaseOrder, {
  foreignKey: 'purchase_order_id',
  as: 'purchaseOrder',
});

// Quote <-> QuoteItem
models.Quote.hasMany(models.QuoteItem, {
  foreignKey: 'quote_id',
  as: 'items',
});
models.QuoteItem.belongsTo(models.Quote, {
  foreignKey: 'quote_id',
  as: 'quote',
});

// QuoteItem -> InventoryItem
models.QuoteItem.belongsTo(models.InventoryItem, {
  foreignKey: 'inventory_item_id',
  as: 'inventoryItem',
});

// Quote -> User (createdBy, reviewedBy, approvedBy)
models.Quote.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.Quote.belongsTo(models.User, {
  foreignKey: 'reviewed_by',
  as: 'reviewer',
});
models.Quote.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});

// QuoteRequest -> Project
models.QuoteRequest.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// QuoteRequest -> Department
models.QuoteRequest.belongsTo(models.Department, {
  foreignKey: 'department_id',
  as: 'department',
});

// QuoteRequest -> Quote (selected)
models.QuoteRequest.belongsTo(models.Quote, {
  foreignKey: 'selected_quote_id',
  as: 'selectedQuote',
  constraints: false,
});

// QuoteRequest -> PurchaseOrder (generated)
models.QuoteRequest.belongsTo(models.PurchaseOrder, {
  foreignKey: 'purchase_order_id',
  as: 'purchaseOrder',
});

// QuoteRequest -> User (requestedBy, approvedBy, createdBy)
models.QuoteRequest.belongsTo(models.User, {
  foreignKey: 'requested_by',
  as: 'requester',
});
models.QuoteRequest.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});
models.QuoteRequest.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// ========== HSE ASSOCIATIONS ==========

// Incident associations
models.Incident.belongsTo(models.Employee, {
  foreignKey: 'reported_by_id',
  as: 'reportedBy',
});
models.Incident.belongsTo(models.Employee, {
  foreignKey: 'affected_employee_id',
  as: 'affectedEmployee',
});
models.Incident.belongsTo(models.Employee, {
  foreignKey: 'investigated_by_id',
  as: 'investigatedBy',
});
models.Incident.belongsTo(models.Employee, {
  foreignKey: 'closed_by_id',
  as: 'closedBy',
});
models.Incident.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Incident.belongsTo(models.Vehicle, {
  foreignKey: 'vehicle_id',
  as: 'vehicle',
});
models.Incident.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Inspection associations
models.Inspection.belongsTo(models.Employee, {
  foreignKey: 'inspector_id',
  as: 'inspector',
});
models.Inspection.belongsTo(models.Employee, {
  foreignKey: 'approved_by_id',
  as: 'approvedBy',
});
models.Inspection.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Inspection.belongsTo(models.Vehicle, {
  foreignKey: 'vehicle_id',
  as: 'vehicle',
});
models.Inspection.belongsTo(models.Warehouse, {
  foreignKey: 'warehouse_id',
  as: 'warehouse',
});
models.Inspection.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Training associations
models.Training.belongsTo(models.Employee, {
  foreignKey: 'instructor_id',
  as: 'instructor',
});
models.Training.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.Training.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.Training.hasMany(models.TrainingAttendance, {
  foreignKey: 'training_id',
  as: 'attendances',
});

// TrainingAttendance associations
models.TrainingAttendance.belongsTo(models.Training, {
  foreignKey: 'training_id',
  as: 'training',
});
models.TrainingAttendance.belongsTo(models.Employee, {
  foreignKey: 'employee_id',
  as: 'employee',
});

// SafetyEquipment associations
models.SafetyEquipment.belongsTo(models.Employee, {
  foreignKey: 'assigned_to_id',
  as: 'assignedTo',
});
models.SafetyEquipment.belongsTo(models.Warehouse, {
  foreignKey: 'warehouse_id',
  as: 'warehouse',
});
models.SafetyEquipment.belongsTo(models.Project, {
  foreignKey: 'project_id',
  as: 'project',
});
models.SafetyEquipment.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// ========== DOCUMENT ASSOCIATIONS ==========

// DocumentCategory self-reference (hierarchy)
models.DocumentCategory.belongsTo(models.DocumentCategory, {
  foreignKey: 'parent_id',
  as: 'parent',
});
models.DocumentCategory.hasMany(models.DocumentCategory, {
  foreignKey: 'parent_id',
  as: 'children',
});

// DocumentCategory -> User (createdBy)
models.DocumentCategory.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Document -> DocumentCategory
models.Document.belongsTo(models.DocumentCategory, {
  foreignKey: 'category_id',
  as: 'category',
});
models.DocumentCategory.hasMany(models.Document, {
  foreignKey: 'category_id',
  as: 'documents',
});

// Document -> User (createdBy, approvedBy, archivedBy)
models.Document.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.Document.belongsTo(models.User, {
  foreignKey: 'approved_by',
  as: 'approver',
});
models.Document.belongsTo(models.User, {
  foreignKey: 'archived_by',
  as: 'archiver',
});

// Document <-> DocumentVersion
models.Document.hasMany(models.DocumentVersion, {
  foreignKey: 'document_id',
  as: 'versions',
});
models.DocumentVersion.belongsTo(models.Document, {
  foreignKey: 'document_id',
  as: 'document',
});

// DocumentVersion -> User (createdBy)
models.DocumentVersion.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Document <-> DocumentShare
models.Document.hasMany(models.DocumentShare, {
  foreignKey: 'document_id',
  as: 'shares',
});
models.DocumentShare.belongsTo(models.Document, {
  foreignKey: 'document_id',
  as: 'document',
});

// DocumentShare -> User (sharedWithUser, sharedBy)
models.DocumentShare.belongsTo(models.User, {
  foreignKey: 'shared_with_user_id',
  as: 'sharedWithUser',
});
models.DocumentShare.belongsTo(models.User, {
  foreignKey: 'shared_by',
  as: 'sharer',
});

// DocumentShare -> Department
models.DocumentShare.belongsTo(models.Department, {
  foreignKey: 'shared_with_department_id',
  as: 'sharedWithDepartment',
});

// ========== ATTACHMENT ASSOCIATIONS ==========

// Attachment -> User (uploadedBy)
models.Attachment.belongsTo(models.User, {
  foreignKey: 'uploaded_by',
  as: 'uploader',
});
models.User.hasMany(models.Attachment, {
  foreignKey: 'uploaded_by',
  as: 'uploadedAttachments',
});

// ========== PRODUCT & INVENTORY UNIT ASSOCIATIONS ==========

// Product -> InventoryCategory
models.Product.belongsTo(models.InventoryCategory, {
  foreignKey: 'category_id',
  as: 'category',
});
models.InventoryCategory.hasMany(models.Product, {
  foreignKey: 'category_id',
  as: 'products',
});

// Product -> Contractor (preferred supplier)
models.Product.belongsTo(models.Contractor, {
  foreignKey: 'preferred_supplier_id',
  as: 'preferredSupplier',
});

// Product -> User (createdBy)
models.Product.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});

// Product <-> InventoryUnit
models.Product.hasMany(models.InventoryUnit, {
  foreignKey: 'product_id',
  as: 'units',
});
models.InventoryUnit.belongsTo(models.Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// InventoryUnit -> Warehouse
models.InventoryUnit.belongsTo(models.Warehouse, {
  foreignKey: 'warehouse_id',
  as: 'warehouse',
});
models.Warehouse.hasMany(models.InventoryUnit, {
  foreignKey: 'warehouse_id',
  as: 'units',
});

// InventoryUnit -> Employee (assignedTo)
models.InventoryUnit.belongsTo(models.Employee, {
  foreignKey: 'assigned_to_employee_id',
  as: 'assignedToEmployee',
});
models.Employee.hasMany(models.InventoryUnit, {
  foreignKey: 'assigned_to_employee_id',
  as: 'assignedUnits',
});

// InventoryUnit -> Project (assignedTo)
models.InventoryUnit.belongsTo(models.Project, {
  foreignKey: 'assigned_to_project_id',
  as: 'assignedToProject',
});
models.Project.hasMany(models.InventoryUnit, {
  foreignKey: 'assigned_to_project_id',
  as: 'assignedUnits',
});

// InventoryUnit -> Contractor (supplier)
models.InventoryUnit.belongsTo(models.Contractor, {
  foreignKey: 'supplier_id',
  as: 'supplier',
});

// InventoryUnit -> PurchaseOrder
models.InventoryUnit.belongsTo(models.PurchaseOrder, {
  foreignKey: 'purchase_order_id',
  as: 'purchaseOrder',
});
models.PurchaseOrder.hasMany(models.InventoryUnit, {
  foreignKey: 'purchase_order_id',
  as: 'inventoryUnits',
});

// InventoryUnit -> User (createdBy, retiredBy)
models.InventoryUnit.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.InventoryUnit.belongsTo(models.User, {
  foreignKey: 'retired_by',
  as: 'retirer',
});

// InventoryUnit <-> InventoryUnitHistory
models.InventoryUnit.hasMany(models.InventoryUnitHistory, {
  foreignKey: 'unit_id',
  as: 'history',
});
models.InventoryUnitHistory.belongsTo(models.InventoryUnit, {
  foreignKey: 'unit_id',
  as: 'unit',
});

// InventoryUnitHistory -> Warehouse (from/to)
models.InventoryUnitHistory.belongsTo(models.Warehouse, {
  foreignKey: 'from_warehouse_id',
  as: 'fromWarehouse',
});
models.InventoryUnitHistory.belongsTo(models.Warehouse, {
  foreignKey: 'to_warehouse_id',
  as: 'toWarehouse',
});

// InventoryUnitHistory -> Employee (from/to/delivered/received)
models.InventoryUnitHistory.belongsTo(models.Employee, {
  foreignKey: 'from_employee_id',
  as: 'fromEmployee',
});
models.InventoryUnitHistory.belongsTo(models.Employee, {
  foreignKey: 'to_employee_id',
  as: 'toEmployee',
});
models.InventoryUnitHistory.belongsTo(models.Employee, {
  foreignKey: 'delivered_by',
  as: 'deliveredByEmployee',
});
models.InventoryUnitHistory.belongsTo(models.Employee, {
  foreignKey: 'received_by',
  as: 'receivedByEmployee',
});

// InventoryUnitHistory -> Project (from/to)
models.InventoryUnitHistory.belongsTo(models.Project, {
  foreignKey: 'from_project_id',
  as: 'fromProject',
});
models.InventoryUnitHistory.belongsTo(models.Project, {
  foreignKey: 'to_project_id',
  as: 'toProject',
});

// InventoryUnitHistory -> User (performedBy, authorizedBy)
models.InventoryUnitHistory.belongsTo(models.User, {
  foreignKey: 'performed_by',
  as: 'performer',
});
models.InventoryUnitHistory.belongsTo(models.User, {
  foreignKey: 'authorized_by',
  as: 'authorizer',
});

// ========== WHATSAPP ASSOCIATIONS ==========

// UserWhatsApp -> User
models.UserWhatsApp.belongsTo(models.User, {
  foreignKey: 'user_id',
  as: 'user',
});
models.User.hasOne(models.UserWhatsApp, {
  foreignKey: 'user_id',
  as: 'whatsapp',
});

// ========== EMAIL ASSOCIATIONS ==========

// EmailConfig -> User (createdBy, updatedBy)
models.EmailConfig.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.EmailConfig.belongsTo(models.User, {
  foreignKey: 'updated_by',
  as: 'updater',
});

// EmailTemplate -> User (createdBy, updatedBy)
models.EmailTemplate.belongsTo(models.User, {
  foreignKey: 'created_by',
  as: 'creator',
});
models.EmailTemplate.belongsTo(models.User, {
  foreignKey: 'updated_by',
  as: 'updater',
});

// UserEmail -> User
models.UserEmail.belongsTo(models.User, {
  foreignKey: 'user_id',
  as: 'user',
});
models.User.hasOne(models.UserEmail, {
  foreignKey: 'user_id',
  as: 'emailConfig',
});

// EmailLog -> EmailTemplate
models.EmailLog.belongsTo(models.EmailTemplate, {
  foreignKey: 'template_id',
  as: 'template',
});

// EmailLog -> User
models.EmailLog.belongsTo(models.User, {
  foreignKey: 'user_id',
  as: 'user',
});

module.exports = models;
