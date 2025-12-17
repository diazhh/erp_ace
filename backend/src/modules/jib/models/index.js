const JointInterestBillingModel = require('./JointInterestBilling');
const JIBLineItemModel = require('./JIBLineItem');
const JIBPartnerShareModel = require('./JIBPartnerShare');
const CashCallModel = require('./CashCall');
const CashCallResponseModel = require('./CashCallResponse');

module.exports = {
  JointInterestBillingModel,
  JIBLineItemModel,
  JIBPartnerShareModel,
  CashCallModel,
  CashCallResponseModel,
};

module.exports.initModels = (sequelize) => {
  const JointInterestBilling = JointInterestBillingModel(sequelize);
  const JIBLineItem = JIBLineItemModel(sequelize);
  const JIBPartnerShare = JIBPartnerShareModel(sequelize);
  const CashCall = CashCallModel(sequelize);
  const CashCallResponse = CashCallResponseModel(sequelize);

  return {
    JointInterestBilling,
    JIBLineItem,
    JIBPartnerShare,
    CashCall,
    CashCallResponse,
  };
};

module.exports.associate = (models) => {
  const { 
    JointInterestBilling, 
    JIBLineItem, 
    JIBPartnerShare, 
    CashCall, 
    CashCallResponse,
    OGContract,
    ContractParty,
    AFE,
    AFEExpense,
    User,
  } = models;

  // JointInterestBilling associations
  JointInterestBilling.belongsTo(OGContract, { foreignKey: 'contract_id', as: 'contract' });
  JointInterestBilling.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  JointInterestBilling.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
  JointInterestBilling.hasMany(JIBLineItem, { foreignKey: 'jib_id', as: 'lineItems' });
  JointInterestBilling.hasMany(JIBPartnerShare, { foreignKey: 'jib_id', as: 'partnerShares' });

  // JIBLineItem associations
  JIBLineItem.belongsTo(JointInterestBilling, { foreignKey: 'jib_id', as: 'jib' });
  JIBLineItem.belongsTo(AFE, { foreignKey: 'afe_id', as: 'afe' });
  JIBLineItem.belongsTo(AFEExpense, { foreignKey: 'expense_id', as: 'expense' });

  // JIBPartnerShare associations
  JIBPartnerShare.belongsTo(JointInterestBilling, { foreignKey: 'jib_id', as: 'jib' });
  JIBPartnerShare.belongsTo(ContractParty, { foreignKey: 'party_id', as: 'party' });

  // CashCall associations
  CashCall.belongsTo(OGContract, { foreignKey: 'contract_id', as: 'contract' });
  CashCall.belongsTo(AFE, { foreignKey: 'afe_id', as: 'afe' });
  CashCall.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  CashCall.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
  CashCall.hasMany(CashCallResponse, { foreignKey: 'cash_call_id', as: 'responses' });

  // CashCallResponse associations
  CashCallResponse.belongsTo(CashCall, { foreignKey: 'cash_call_id', as: 'cashCall' });
  CashCallResponse.belongsTo(ContractParty, { foreignKey: 'party_id', as: 'party' });

  // Reverse associations
  OGContract.hasMany(JointInterestBilling, { foreignKey: 'contract_id', as: 'jibs' });
  OGContract.hasMany(CashCall, { foreignKey: 'contract_id', as: 'cashCalls' });
  ContractParty.hasMany(JIBPartnerShare, { foreignKey: 'party_id', as: 'jibShares' });
  ContractParty.hasMany(CashCallResponse, { foreignKey: 'party_id', as: 'cashCallResponses' });
};
