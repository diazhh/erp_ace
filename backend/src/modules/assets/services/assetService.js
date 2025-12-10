const { Op } = require('sequelize');
const models = require('../../../database/models');

const {
  Asset,
  AssetCategory,
  AssetMaintenance,
  AssetTransfer,
  AssetDepreciation,
  Contractor,
  PurchaseOrder,
  Warehouse,
  Employee,
  Project,
  Department,
  User,
  Transaction,
} = models;

// ========== CATÁLOGOS ==========

const getCatalogs = () => {
  return {
    depreciationMethods: [
      { value: 'STRAIGHT_LINE', label: 'Línea Recta' },
      { value: 'DECLINING_BALANCE', label: 'Saldo Decreciente' },
      { value: 'UNITS_OF_PRODUCTION', label: 'Unidades de Producción' },
    ],
    assetStatuses: [
      { value: 'ACTIVE', label: 'Activo' },
      { value: 'IN_MAINTENANCE', label: 'En Mantenimiento' },
      { value: 'STORED', label: 'Almacenado' },
      { value: 'DISPOSED', label: 'Dado de Baja' },
      { value: 'SOLD', label: 'Vendido' },
      { value: 'LOST', label: 'Perdido' },
      { value: 'DAMAGED', label: 'Dañado' },
    ],
    conditions: [
      { value: 'EXCELLENT', label: 'Excelente' },
      { value: 'GOOD', label: 'Bueno' },
      { value: 'FAIR', label: 'Regular' },
      { value: 'POOR', label: 'Malo' },
    ],
    maintenanceTypes: [
      { value: 'PREVENTIVE', label: 'Preventivo' },
      { value: 'CORRECTIVE', label: 'Correctivo' },
      { value: 'PREDICTIVE', label: 'Predictivo' },
      { value: 'CALIBRATION', label: 'Calibración' },
      { value: 'INSPECTION', label: 'Inspección' },
    ],
    maintenanceStatuses: [
      { value: 'SCHEDULED', label: 'Programado' },
      { value: 'IN_PROGRESS', label: 'En Progreso' },
      { value: 'COMPLETED', label: 'Completado' },
      { value: 'CANCELLED', label: 'Cancelado' },
    ],
    transferTypes: [
      { value: 'LOCATION', label: 'Cambio de Ubicación' },
      { value: 'EMPLOYEE', label: 'Asignación a Empleado' },
      { value: 'PROJECT', label: 'Asignación a Proyecto' },
      { value: 'DEPARTMENT', label: 'Asignación a Departamento' },
      { value: 'RETURN', label: 'Devolución' },
    ],
    transferStatuses: [
      { value: 'PENDING', label: 'Pendiente' },
      { value: 'APPROVED', label: 'Aprobado' },
      { value: 'IN_TRANSIT', label: 'En Tránsito' },
      { value: 'COMPLETED', label: 'Completado' },
      { value: 'CANCELLED', label: 'Cancelado' },
    ],
    disposalMethods: [
      { value: 'SOLD', label: 'Vendido' },
      { value: 'SCRAPPED', label: 'Desechado' },
      { value: 'DONATED', label: 'Donado' },
      { value: 'LOST', label: 'Perdido' },
      { value: 'OTHER', label: 'Otro' },
    ],
    currencies: [
      { value: 'USD', label: 'Dólares (USD)' },
      { value: 'VES', label: 'Bolívares (VES)' },
      { value: 'EUR', label: 'Euros (EUR)' },
    ],
  };
};

// ========== CATEGORÍAS ==========

const getCategories = async (query = {}) => {
  const { search, isActive, parentId, page = 1, limit = 50 } = query;
  
  const where = {};
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
    ];
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }
  
  if (parentId === 'null') {
    where.parentId = null;
  } else if (parentId) {
    where.parentId = parentId;
  }
  
  const { count, rows } = await AssetCategory.findAndCountAll({
    where,
    include: [
      { model: AssetCategory, as: 'parent', attributes: ['id', 'code', 'name'] },
      { model: AssetCategory, as: 'children', attributes: ['id', 'code', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
    ],
    order: [['code', 'ASC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
  });
  
  return {
    items: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / parseInt(limit)),
  };
};

const getCategoryById = async (id) => {
  return await AssetCategory.findByPk(id, {
    include: [
      { model: AssetCategory, as: 'parent', attributes: ['id', 'code', 'name'] },
      { model: AssetCategory, as: 'children', attributes: ['id', 'code', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
    ],
  });
};

const createCategory = async (data, userId) => {
  // Generar código si no se proporciona
  if (!data.code) {
    const lastCategory = await AssetCategory.findOne({
      order: [['createdAt', 'DESC']],
    });
    const nextNum = lastCategory ? parseInt(lastCategory.code.replace('CAT-', '')) + 1 : 1;
    data.code = `CAT-${String(nextNum).padStart(3, '0')}`;
  }
  
  return await AssetCategory.create({
    ...data,
    createdBy: userId,
  });
};

const updateCategory = async (id, data) => {
  const category = await AssetCategory.findByPk(id);
  if (!category) {
    throw new Error('Categoría no encontrada');
  }
  
  await category.update(data);
  return await getCategoryById(id);
};

const deleteCategory = async (id) => {
  const category = await AssetCategory.findByPk(id);
  if (!category) {
    throw new Error('Categoría no encontrada');
  }
  
  // Verificar que no tenga activos asociados
  const assetsCount = await Asset.count({ where: { categoryId: id } });
  if (assetsCount > 0) {
    throw new Error(`No se puede eliminar la categoría porque tiene ${assetsCount} activos asociados`);
  }
  
  // Verificar que no tenga subcategorías
  const childrenCount = await AssetCategory.count({ where: { parentId: id } });
  if (childrenCount > 0) {
    throw new Error(`No se puede eliminar la categoría porque tiene ${childrenCount} subcategorías`);
  }
  
  await category.destroy();
  return { message: 'Categoría eliminada correctamente' };
};

// ========== ACTIVOS ==========

const getAssets = async (query = {}) => {
  const {
    search,
    categoryId,
    status,
    condition,
    assignedToEmployeeId,
    assignedToProjectId,
    assignedToDepartmentId,
    locationId,
    page = 1,
    limit = 20,
  } = query;
  
  const where = {};
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
      { serialNumber: { [Op.iLike]: `%${search}%` } },
      { brand: { [Op.iLike]: `%${search}%` } },
      { model: { [Op.iLike]: `%${search}%` } },
    ];
  }
  
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;
  if (condition) where.condition = condition;
  if (assignedToEmployeeId) where.assignedToEmployeeId = assignedToEmployeeId;
  if (assignedToProjectId) where.assignedToProjectId = assignedToProjectId;
  if (assignedToDepartmentId) where.assignedToDepartmentId = assignedToDepartmentId;
  if (locationId) where.locationId = locationId;
  
  const { count, rows } = await Asset.findAndCountAll({
    where,
    include: [
      { model: AssetCategory, as: 'category', attributes: ['id', 'code', 'name'] },
      { model: Warehouse, as: 'location', attributes: ['id', 'code', 'name'] },
      { model: Employee, as: 'assignedToEmployee', attributes: ['id', 'firstName', 'lastName'] },
      { model: Project, as: 'assignedToProject', attributes: ['id', 'code', 'name'] },
      { model: Department, as: 'assignedToDepartment', attributes: ['id', 'code', 'name'] },
    ],
    order: [['code', 'ASC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
  });
  
  return {
    items: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / parseInt(limit)),
  };
};

const getAssetById = async (id) => {
  return await Asset.findByPk(id, {
    include: [
      { model: AssetCategory, as: 'category' },
      { model: Contractor, as: 'supplier', attributes: ['id', 'name', 'rif'] },
      { model: PurchaseOrder, as: 'purchaseOrder', attributes: ['id', 'code'] },
      { model: Warehouse, as: 'location', attributes: ['id', 'code', 'name'] },
      { model: Employee, as: 'assignedToEmployee', attributes: ['id', 'firstName', 'lastName', 'idNumber'] },
      { model: Project, as: 'assignedToProject', attributes: ['id', 'code', 'name'] },
      { model: Department, as: 'assignedToDepartment', attributes: ['id', 'code', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
      { model: User, as: 'disposer', attributes: ['id', 'username'] },
    ],
  });
};

const getAssetFull = async (id) => {
  const asset = await getAssetById(id);
  if (!asset) return null;
  
  // Obtener mantenimientos
  const maintenances = await AssetMaintenance.findAll({
    where: { assetId: id },
    include: [
      { model: Contractor, as: 'serviceProvider', attributes: ['id', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
      { model: User, as: 'completer', attributes: ['id', 'username'] },
    ],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });
  
  // Obtener transferencias
  const transfers = await AssetTransfer.findAll({
    where: { assetId: id },
    include: [
      { model: Warehouse, as: 'fromLocation', attributes: ['id', 'code', 'name'] },
      { model: Warehouse, as: 'toLocation', attributes: ['id', 'code', 'name'] },
      { model: Employee, as: 'fromEmployee', attributes: ['id', 'firstName', 'lastName'] },
      { model: Employee, as: 'toEmployee', attributes: ['id', 'firstName', 'lastName'] },
      { model: Project, as: 'fromProject', attributes: ['id', 'code', 'name'] },
      { model: Project, as: 'toProject', attributes: ['id', 'code', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
    ],
    order: [['transferDate', 'DESC']],
    limit: 10,
  });
  
  // Obtener depreciaciones
  const depreciations = await AssetDepreciation.findAll({
    where: { assetId: id },
    order: [['year', 'DESC'], ['month', 'DESC']],
    limit: 24,
  });
  
  return {
    ...asset.toJSON(),
    maintenances,
    transfers,
    depreciations,
  };
};

const createAsset = async (data, userId) => {
  // Generar código si no se proporciona
  if (!data.code) {
    const lastAsset = await Asset.findOne({
      order: [['createdAt', 'DESC']],
    });
    const nextNum = lastAsset ? parseInt(lastAsset.code.replace('ACT-', '')) + 1 : 1;
    data.code = `ACT-${String(nextNum).padStart(5, '0')}`;
  }
  
  // Calcular valor en libros inicial
  data.bookValue = parseFloat(data.acquisitionCost) - parseFloat(data.accumulatedDepreciation || 0);
  
  // Si no se especifica fecha de inicio de depreciación, usar fecha de adquisición
  if (!data.depreciationStartDate) {
    data.depreciationStartDate = data.acquisitionDate;
  }
  
  const asset = await Asset.create({
    ...data,
    createdBy: userId,
  });
  
  return await getAssetById(asset.id);
};

const updateAsset = async (id, data) => {
  const asset = await Asset.findByPk(id);
  if (!asset) {
    throw new Error('Activo no encontrado');
  }
  
  // Recalcular valor en libros si cambia el costo o la depreciación
  if (data.acquisitionCost !== undefined || data.accumulatedDepreciation !== undefined) {
    const cost = data.acquisitionCost !== undefined ? parseFloat(data.acquisitionCost) : parseFloat(asset.acquisitionCost);
    const depreciation = data.accumulatedDepreciation !== undefined ? parseFloat(data.accumulatedDepreciation) : parseFloat(asset.accumulatedDepreciation);
    data.bookValue = cost - depreciation;
  }
  
  await asset.update(data);
  return await getAssetById(id);
};

const deleteAsset = async (id) => {
  const asset = await Asset.findByPk(id);
  if (!asset) {
    throw new Error('Activo no encontrado');
  }
  
  // Verificar que no tenga mantenimientos
  const maintenancesCount = await AssetMaintenance.count({ where: { assetId: id } });
  if (maintenancesCount > 0) {
    throw new Error(`No se puede eliminar el activo porque tiene ${maintenancesCount} mantenimientos registrados`);
  }
  
  // Verificar que no tenga transferencias
  const transfersCount = await AssetTransfer.count({ where: { assetId: id } });
  if (transfersCount > 0) {
    throw new Error(`No se puede eliminar el activo porque tiene ${transfersCount} transferencias registradas`);
  }
  
  await asset.destroy();
  return { message: 'Activo eliminado correctamente' };
};

const disposeAsset = async (id, data, userId) => {
  const asset = await Asset.findByPk(id);
  if (!asset) {
    throw new Error('Activo no encontrado');
  }
  
  if (['DISPOSED', 'SOLD'].includes(asset.status)) {
    throw new Error('El activo ya fue dado de baja');
  }
  
  await asset.update({
    status: data.disposalMethod === 'SOLD' ? 'SOLD' : 'DISPOSED',
    disposalDate: data.disposalDate || new Date(),
    disposalMethod: data.disposalMethod,
    disposalAmount: data.disposalAmount || 0,
    disposalNotes: data.disposalNotes,
    disposedBy: userId,
    assignedToEmployeeId: null,
    assignedToProjectId: null,
    assignedToDepartmentId: null,
  });
  
  return await getAssetById(id);
};

// ========== MANTENIMIENTOS ==========

const getMaintenances = async (query = {}) => {
  const {
    assetId,
    status,
    maintenanceType,
    fromDate,
    toDate,
    page = 1,
    limit = 20,
  } = query;
  
  const where = {};
  
  if (assetId) where.assetId = assetId;
  if (status) where.status = status;
  if (maintenanceType) where.maintenanceType = maintenanceType;
  
  if (fromDate || toDate) {
    where.scheduledDate = {};
    if (fromDate) where.scheduledDate[Op.gte] = fromDate;
    if (toDate) where.scheduledDate[Op.lte] = toDate;
  }
  
  const { count, rows } = await AssetMaintenance.findAndCountAll({
    where,
    include: [
      { model: Asset, as: 'asset', attributes: ['id', 'code', 'name'] },
      { model: Contractor, as: 'serviceProvider', attributes: ['id', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
      { model: User, as: 'completer', attributes: ['id', 'username'] },
    ],
    order: [['scheduledDate', 'DESC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
  });
  
  return {
    items: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / parseInt(limit)),
  };
};

const getMaintenanceById = async (id) => {
  return await AssetMaintenance.findByPk(id, {
    include: [
      { model: Asset, as: 'asset' },
      { model: Contractor, as: 'serviceProvider' },
      { model: Transaction, as: 'transaction' },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
      { model: User, as: 'completer', attributes: ['id', 'username'] },
    ],
  });
};

const createMaintenance = async (data, userId) => {
  // Verificar que el activo existe
  const asset = await Asset.findByPk(data.assetId);
  if (!asset) {
    throw new Error('Activo no encontrado');
  }
  
  const maintenance = await AssetMaintenance.create({
    ...data,
    createdBy: userId,
  });
  
  // Si el mantenimiento está en progreso, actualizar estado del activo
  if (data.status === 'IN_PROGRESS') {
    await asset.update({ status: 'IN_MAINTENANCE' });
  }
  
  return await getMaintenanceById(maintenance.id);
};

const updateMaintenance = async (id, data) => {
  const maintenance = await AssetMaintenance.findByPk(id);
  if (!maintenance) {
    throw new Error('Mantenimiento no encontrado');
  }
  
  await maintenance.update(data);
  return await getMaintenanceById(id);
};

const completeMaintenance = async (id, data, userId) => {
  const maintenance = await AssetMaintenance.findByPk(id, {
    include: [{ model: Asset, as: 'asset' }],
  });
  
  if (!maintenance) {
    throw new Error('Mantenimiento no encontrado');
  }
  
  if (maintenance.status === 'COMPLETED') {
    throw new Error('El mantenimiento ya fue completado');
  }
  
  await maintenance.update({
    status: 'COMPLETED',
    completedDate: data.completedDate || new Date(),
    result: data.result,
    conditionAfter: data.conditionAfter,
    nextMaintenanceDate: data.nextMaintenanceDate,
    laborCost: data.laborCost,
    partsCost: data.partsCost,
    otherCost: data.otherCost,
    completedBy: userId,
  });
  
  // Actualizar condición y estado del activo
  const updateData = { status: 'ACTIVE' };
  if (data.conditionAfter) {
    updateData.condition = data.conditionAfter;
  }
  await maintenance.asset.update(updateData);
  
  return await getMaintenanceById(id);
};

// ========== TRANSFERENCIAS ==========

const getTransfers = async (query = {}) => {
  const {
    assetId,
    status,
    transferType,
    fromDate,
    toDate,
    page = 1,
    limit = 20,
  } = query;
  
  const where = {};
  
  if (assetId) where.assetId = assetId;
  if (status) where.status = status;
  if (transferType) where.transferType = transferType;
  
  if (fromDate || toDate) {
    where.transferDate = {};
    if (fromDate) where.transferDate[Op.gte] = fromDate;
    if (toDate) where.transferDate[Op.lte] = toDate;
  }
  
  const { count, rows } = await AssetTransfer.findAndCountAll({
    where,
    include: [
      { model: Asset, as: 'asset', attributes: ['id', 'code', 'name'] },
      { model: Warehouse, as: 'fromLocation', attributes: ['id', 'code', 'name'] },
      { model: Warehouse, as: 'toLocation', attributes: ['id', 'code', 'name'] },
      { model: Employee, as: 'fromEmployee', attributes: ['id', 'firstName', 'lastName'] },
      { model: Employee, as: 'toEmployee', attributes: ['id', 'firstName', 'lastName'] },
      { model: Project, as: 'fromProject', attributes: ['id', 'code', 'name'] },
      { model: Project, as: 'toProject', attributes: ['id', 'code', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
    ],
    order: [['transferDate', 'DESC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
  });
  
  return {
    items: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / parseInt(limit)),
  };
};

const getTransferById = async (id) => {
  return await AssetTransfer.findByPk(id, {
    include: [
      { model: Asset, as: 'asset' },
      { model: Warehouse, as: 'fromLocation' },
      { model: Warehouse, as: 'toLocation' },
      { model: Employee, as: 'fromEmployee' },
      { model: Employee, as: 'toEmployee' },
      { model: Project, as: 'fromProject' },
      { model: Project, as: 'toProject' },
      { model: Department, as: 'fromDepartment' },
      { model: Department, as: 'toDepartment' },
      { model: User, as: 'requester', attributes: ['id', 'username'] },
      { model: User, as: 'approver', attributes: ['id', 'username'] },
      { model: User, as: 'deliverer', attributes: ['id', 'username'] },
      { model: User, as: 'receiver', attributes: ['id', 'username'] },
      { model: User, as: 'creator', attributes: ['id', 'username'] },
    ],
  });
};

const createTransfer = async (data, userId) => {
  const asset = await Asset.findByPk(data.assetId);
  if (!asset) {
    throw new Error('Activo no encontrado');
  }
  
  // Guardar valores actuales como origen
  const transferData = {
    ...data,
    fromLocationId: asset.locationId,
    fromEmployeeId: asset.assignedToEmployeeId,
    fromProjectId: asset.assignedToProjectId,
    fromDepartmentId: asset.assignedToDepartmentId,
    conditionAtTransfer: asset.condition,
    requestedBy: userId,
    createdBy: userId,
  };
  
  const transfer = await AssetTransfer.create(transferData);
  return await getTransferById(transfer.id);
};

const approveTransfer = async (id, userId) => {
  const transfer = await AssetTransfer.findByPk(id);
  if (!transfer) {
    throw new Error('Transferencia no encontrada');
  }
  
  if (transfer.status !== 'PENDING') {
    throw new Error('Solo se pueden aprobar transferencias pendientes');
  }
  
  await transfer.update({
    status: 'APPROVED',
    approvedBy: userId,
  });
  
  return await getTransferById(id);
};

const completeTransfer = async (id, data, userId) => {
  const transfer = await AssetTransfer.findByPk(id, {
    include: [{ model: Asset, as: 'asset' }],
  });
  
  if (!transfer) {
    throw new Error('Transferencia no encontrada');
  }
  
  if (!['PENDING', 'APPROVED', 'IN_TRANSIT'].includes(transfer.status)) {
    throw new Error('La transferencia no puede ser completada en su estado actual');
  }
  
  // Actualizar transferencia
  await transfer.update({
    status: 'COMPLETED',
    receivedBy: userId,
    conditionAtReturn: data.conditionAtReturn,
    notes: data.notes,
  });
  
  // Actualizar activo con nuevos valores
  const assetUpdate = {};
  if (transfer.toLocationId) assetUpdate.locationId = transfer.toLocationId;
  if (transfer.toEmployeeId !== undefined) assetUpdate.assignedToEmployeeId = transfer.toEmployeeId;
  if (transfer.toProjectId !== undefined) assetUpdate.assignedToProjectId = transfer.toProjectId;
  if (transfer.toDepartmentId !== undefined) assetUpdate.assignedToDepartmentId = transfer.toDepartmentId;
  if (data.conditionAtReturn) assetUpdate.condition = data.conditionAtReturn;
  
  await transfer.asset.update(assetUpdate);
  
  return await getTransferById(id);
};

// ========== DEPRECIACIÓN ==========

const calculateDepreciation = async (assetId, year, month, userId) => {
  const asset = await Asset.findByPk(assetId);
  if (!asset) {
    throw new Error('Activo no encontrado');
  }
  
  if (['DISPOSED', 'SOLD'].includes(asset.status)) {
    throw new Error('No se puede calcular depreciación para activos dados de baja');
  }
  
  // Verificar si ya existe depreciación para este período
  const existing = await AssetDepreciation.findOne({
    where: { assetId, year, month },
  });
  
  if (existing) {
    throw new Error(`Ya existe depreciación calculada para ${month}/${year}`);
  }
  
  // Calcular depreciación según método
  const depreciableAmount = parseFloat(asset.acquisitionCost) - parseFloat(asset.salvageValue);
  let depreciationAmount = 0;
  
  const periodStart = new Date(year, month - 1, 1);
  const periodEnd = new Date(year, month, 0);
  
  switch (asset.depreciationMethod) {
    case 'STRAIGHT_LINE':
      // Depreciación mensual = (Costo - Valor Residual) / (Vida útil en años * 12)
      depreciationAmount = depreciableAmount / (asset.usefulLifeYears * 12);
      break;
      
    case 'DECLINING_BALANCE':
      // Tasa = 2 / Vida útil en años (doble declinación)
      const rate = 2 / asset.usefulLifeYears;
      depreciationAmount = parseFloat(asset.bookValue) * rate / 12;
      // No depreciar por debajo del valor residual
      if (parseFloat(asset.bookValue) - depreciationAmount < parseFloat(asset.salvageValue)) {
        depreciationAmount = parseFloat(asset.bookValue) - parseFloat(asset.salvageValue);
      }
      break;
      
    case 'UNITS_OF_PRODUCTION':
      throw new Error('Para el método de unidades de producción, use calculateDepreciationByUnits');
  }
  
  // Redondear a 2 decimales
  depreciationAmount = Math.round(depreciationAmount * 100) / 100;
  
  // No permitir depreciación negativa
  if (depreciationAmount < 0) depreciationAmount = 0;
  
  // No depreciar si ya se alcanzó el valor residual
  if (parseFloat(asset.bookValue) <= parseFloat(asset.salvageValue)) {
    depreciationAmount = 0;
  }
  
  const openingBookValue = parseFloat(asset.bookValue);
  const openingAccumulatedDepreciation = parseFloat(asset.accumulatedDepreciation);
  const closingAccumulatedDepreciation = openingAccumulatedDepreciation + depreciationAmount;
  const closingBookValue = parseFloat(asset.acquisitionCost) - closingAccumulatedDepreciation;
  
  // Crear registro de depreciación
  const depreciation = await AssetDepreciation.create({
    assetId,
    year,
    month,
    periodStart,
    periodEnd,
    openingBookValue,
    openingAccumulatedDepreciation,
    depreciationAmount,
    closingBookValue,
    closingAccumulatedDepreciation,
    depreciationMethod: asset.depreciationMethod,
    calculatedBy: userId,
    createdBy: userId,
  });
  
  // Actualizar activo
  await asset.update({
    accumulatedDepreciation: closingAccumulatedDepreciation,
    bookValue: closingBookValue,
  });
  
  return depreciation;
};

const getDepreciations = async (query = {}) => {
  const { assetId, year, status, page = 1, limit = 50 } = query;
  
  const where = {};
  if (assetId) where.assetId = assetId;
  if (year) where.year = parseInt(year);
  if (status) where.status = status;
  
  const { count, rows } = await AssetDepreciation.findAndCountAll({
    where,
    include: [
      { model: Asset, as: 'asset', attributes: ['id', 'code', 'name'] },
      { model: User, as: 'calculator', attributes: ['id', 'username'] },
      { model: User, as: 'poster', attributes: ['id', 'username'] },
    ],
    order: [['year', 'DESC'], ['month', 'DESC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
  });
  
  return {
    items: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / parseInt(limit)),
  };
};

const runMonthlyDepreciation = async (year, month, userId) => {
  // Obtener todos los activos activos que requieren depreciación
  const assets = await Asset.findAll({
    where: {
      status: { [Op.notIn]: ['DISPOSED', 'SOLD'] },
      depreciationStartDate: { [Op.lte]: new Date(year, month - 1, 1) },
    },
  });
  
  const results = {
    processed: 0,
    skipped: 0,
    errors: [],
  };
  
  for (const asset of assets) {
    try {
      // Verificar si ya tiene depreciación para este período
      const existing = await AssetDepreciation.findOne({
        where: { assetId: asset.id, year, month },
      });
      
      if (existing) {
        results.skipped++;
        continue;
      }
      
      // Verificar si ya alcanzó el valor residual
      if (parseFloat(asset.bookValue) <= parseFloat(asset.salvageValue)) {
        results.skipped++;
        continue;
      }
      
      await calculateDepreciation(asset.id, year, month, userId);
      results.processed++;
    } catch (error) {
      results.errors.push({ assetId: asset.id, code: asset.code, error: error.message });
    }
  }
  
  return results;
};

// ========== ESTADÍSTICAS ==========

const getStats = async () => {
  const totalAssets = await Asset.count();
  const activeAssets = await Asset.count({ where: { status: 'ACTIVE' } });
  const inMaintenanceAssets = await Asset.count({ where: { status: 'IN_MAINTENANCE' } });
  const disposedAssets = await Asset.count({ where: { status: { [Op.in]: ['DISPOSED', 'SOLD'] } } });
  
  // Valor total de activos
  const totalValue = await Asset.sum('acquisitionCost', {
    where: { status: { [Op.notIn]: ['DISPOSED', 'SOLD'] } },
  }) || 0;
  
  // Valor en libros total
  const totalBookValue = await Asset.sum('bookValue', {
    where: { status: { [Op.notIn]: ['DISPOSED', 'SOLD'] } },
  }) || 0;
  
  // Depreciación acumulada total
  const totalDepreciation = await Asset.sum('accumulatedDepreciation', {
    where: { status: { [Op.notIn]: ['DISPOSED', 'SOLD'] } },
  }) || 0;
  
  // Activos por categoría
  const byCategory = await Asset.findAll({
    attributes: [
      'categoryId',
      [models.sequelize.fn('COUNT', models.sequelize.col('Asset.id')), 'count'],
      [models.sequelize.fn('SUM', models.sequelize.col('book_value')), 'totalValue'],
    ],
    where: { status: { [Op.notIn]: ['DISPOSED', 'SOLD'] } },
    include: [{ model: AssetCategory, as: 'category', attributes: ['name'] }],
    group: ['categoryId', 'category.id'],
    raw: true,
    nest: true,
  });
  
  // Activos por estado
  const byStatus = await Asset.findAll({
    attributes: [
      'status',
      [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  });
  
  // Mantenimientos pendientes
  const pendingMaintenances = await AssetMaintenance.count({
    where: { status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS'] } },
  });
  
  // Transferencias pendientes
  const pendingTransfers = await AssetTransfer.count({
    where: { status: { [Op.in]: ['PENDING', 'APPROVED', 'IN_TRANSIT'] } },
  });
  
  return {
    totalAssets,
    activeAssets,
    inMaintenanceAssets,
    disposedAssets,
    totalValue,
    totalBookValue,
    totalDepreciation,
    byCategory,
    byStatus,
    pendingMaintenances,
    pendingTransfers,
  };
};

const getAlerts = async () => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  // Garantías por vencer
  const warrantyExpiring = await Asset.findAll({
    where: {
      status: { [Op.notIn]: ['DISPOSED', 'SOLD'] },
      warrantyExpiry: {
        [Op.between]: [today, thirtyDaysFromNow],
      },
    },
    attributes: ['id', 'code', 'name', 'warrantyExpiry'],
    order: [['warrantyExpiry', 'ASC']],
    limit: 10,
  });
  
  // Mantenimientos programados próximos
  const upcomingMaintenances = await AssetMaintenance.findAll({
    where: {
      status: 'SCHEDULED',
      scheduledDate: {
        [Op.between]: [today, thirtyDaysFromNow],
      },
    },
    include: [{ model: Asset, as: 'asset', attributes: ['id', 'code', 'name'] }],
    order: [['scheduledDate', 'ASC']],
    limit: 10,
  });
  
  // Activos en mal estado
  const poorConditionAssets = await Asset.findAll({
    where: {
      status: { [Op.notIn]: ['DISPOSED', 'SOLD'] },
      condition: 'POOR',
    },
    attributes: ['id', 'code', 'name', 'condition'],
    limit: 10,
  });
  
  // Activos totalmente depreciados
  const fullyDepreciated = await Asset.findAll({
    where: {
      status: { [Op.notIn]: ['DISPOSED', 'SOLD'] },
      bookValue: { [Op.lte]: models.sequelize.col('salvage_value') },
    },
    attributes: ['id', 'code', 'name', 'bookValue', 'salvageValue'],
    limit: 10,
  });
  
  return {
    warrantyExpiring,
    upcomingMaintenances,
    poorConditionAssets,
    fullyDepreciated,
  };
};

module.exports = {
  // Catálogos
  getCatalogs,
  // Categorías
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // Activos
  getAssets,
  getAssetById,
  getAssetFull,
  createAsset,
  updateAsset,
  deleteAsset,
  disposeAsset,
  // Mantenimientos
  getMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  completeMaintenance,
  // Transferencias
  getTransfers,
  getTransferById,
  createTransfer,
  approveTransfer,
  completeTransfer,
  // Depreciación
  calculateDepreciation,
  getDepreciations,
  runMonthlyDepreciation,
  // Estadísticas
  getStats,
  getAlerts,
};
