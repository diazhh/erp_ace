const contractService = require('../services/contractService');

// ==================== CONTRACT CONTROLLERS ====================

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await contractService.getDashboard();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.findAllContracts = async (req, res, next) => {
  try {
    const result = await contractService.findAllContracts(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.findContractById = async (req, res, next) => {
  try {
    const contract = await contractService.findContractById(req.params.id);
    res.json(contract);
  } catch (error) {
    next(error);
  }
};

exports.createContract = async (req, res, next) => {
  try {
    const contract = await contractService.createContract(req.body, req.user.id);
    res.status(201).json(contract);
  } catch (error) {
    next(error);
  }
};

exports.updateContract = async (req, res, next) => {
  try {
    const contract = await contractService.updateContract(req.params.id, req.body, req.user.id);
    res.json(contract);
  } catch (error) {
    next(error);
  }
};

exports.deleteContract = async (req, res, next) => {
  try {
    const result = await contractService.deleteContract(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.activateContract = async (req, res, next) => {
  try {
    const contract = await contractService.activateContract(req.params.id, req.user.id);
    res.json(contract);
  } catch (error) {
    next(error);
  }
};

exports.terminateContract = async (req, res, next) => {
  try {
    const contract = await contractService.terminateContract(req.params.id, req.user.id);
    res.json(contract);
  } catch (error) {
    next(error);
  }
};

// ==================== PARTY CONTROLLERS ====================

exports.getContractParties = async (req, res, next) => {
  try {
    const parties = await contractService.getContractParties(req.params.id);
    res.json(parties);
  } catch (error) {
    next(error);
  }
};

exports.addParty = async (req, res, next) => {
  try {
    const party = await contractService.addParty(req.params.id, req.body);
    res.status(201).json(party);
  } catch (error) {
    next(error);
  }
};

exports.updateParty = async (req, res, next) => {
  try {
    const party = await contractService.updateParty(req.params.partyId, req.body);
    res.json(party);
  } catch (error) {
    next(error);
  }
};

exports.deleteParty = async (req, res, next) => {
  try {
    const result = await contractService.deleteParty(req.params.partyId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ==================== WORKING INTEREST CONTROLLERS ====================

exports.getWorkingInterests = async (req, res, next) => {
  try {
    const wis = await contractService.getWorkingInterests(req.params.id, req.query);
    res.json(wis);
  } catch (error) {
    next(error);
  }
};

exports.addWorkingInterest = async (req, res, next) => {
  try {
    const wi = await contractService.addWorkingInterest(req.params.id, req.body, req.user.id);
    res.status(201).json(wi);
  } catch (error) {
    next(error);
  }
};

exports.updateWorkingInterest = async (req, res, next) => {
  try {
    const wi = await contractService.updateWorkingInterest(req.params.wiId, req.body);
    res.json(wi);
  } catch (error) {
    next(error);
  }
};

// ==================== ROYALTY CONTROLLERS ====================

exports.getRoyalties = async (req, res, next) => {
  try {
    const result = await contractService.getRoyalties(req.params.id, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.calculateRoyalty = async (req, res, next) => {
  try {
    const royalty = await contractService.calculateRoyalty(req.params.id, req.body, req.user.id);
    res.status(201).json(royalty);
  } catch (error) {
    next(error);
  }
};

exports.payRoyalty = async (req, res, next) => {
  try {
    const royalty = await contractService.payRoyalty(req.params.royaltyId, req.body, req.user.id);
    res.json(royalty);
  } catch (error) {
    next(error);
  }
};

// ==================== CONCESSION CONTROLLERS ====================

exports.findAllConcessions = async (req, res, next) => {
  try {
    const result = await contractService.findAllConcessions(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.findConcessionById = async (req, res, next) => {
  try {
    const concession = await contractService.findConcessionById(req.params.id);
    res.json(concession);
  } catch (error) {
    next(error);
  }
};

exports.createConcession = async (req, res, next) => {
  try {
    const concession = await contractService.createConcession(req.body, req.user.id);
    res.status(201).json(concession);
  } catch (error) {
    next(error);
  }
};

exports.updateConcession = async (req, res, next) => {
  try {
    const concession = await contractService.updateConcession(req.params.id, req.body);
    res.json(concession);
  } catch (error) {
    next(error);
  }
};

exports.deleteConcession = async (req, res, next) => {
  try {
    const result = await contractService.deleteConcession(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
