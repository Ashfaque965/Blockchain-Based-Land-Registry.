const Property = require('../models/Property');
const fabricClient = require('../utils/fabricClient');
const logger = require('../config/logger');

exports.verifyOwnership = async (req, res) => {
  try {
    const { propertyId, owner } = req.body;

    if (!propertyId || !owner) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and owner required'
      });
    }

    // Verify on blockchain
    const result = await fabricClient.evaluateTransaction('verifyOwnership', [
      propertyId,
      owner
    ]);

    const verification = JSON.parse(result);

    // Cross-check with off-chain data
    const property = await Property.findOne({ propertyId });

    const response = {
      onChain: verification,
      offChain: property ? {
        propertyId: property.propertyId,
        owner: property.owner,
        isOwner: property.owner === owner,
        status: property.status
      } : null,
      isVerified: verification.isOwner && property && property.owner === owner
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error(`Error verifying ownership: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error verifying ownership',
      error: error.message
    });
  }
};

exports.verifyTransactionHistory = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Property ID required'
      });
    }

    // Get from blockchain
    const blockchainHistory = await fabricClient.evaluateTransaction('getTransferHistory', [
      propertyId
    ]);

    const onChainHistory = JSON.parse(blockchainHistory);

    // Get from MongoDB
    const property = await Property.findOne({ propertyId });
    const offChainHistory = property ? property.transactionHistory : [];

    // Verify consistency
    const isConsistent = onChainHistory.length === offChainHistory.length;

    res.json({
      success: true,
      data: {
        onChain: onChainHistory,
        offChain: offChainHistory,
        isConsistent,
        propertyId
      }
    });
  } catch (error) {
    logger.error(`Error verifying transaction history: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error verifying transaction history',
      error: error.message
    });
  }
};

exports.auditTrail = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { propertyId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const property = await Property.findOne({ propertyId });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    let auditTrail = property.transactionHistory;
    
    if (query.timestamp) {
      auditTrail = auditTrail.filter(t => {
        const timestamp = new Date(t.timestamp);
        if (query.timestamp.$gte && timestamp < query.timestamp.$gte) return false;
        if (query.timestamp.$lte && timestamp > query.timestamp.$lte) return false;
        return true;
      });
    }

    res.json({
      success: true,
      data: {
        propertyId,
        auditTrail,
        totalTransactions: auditTrail.length
      }
    });
  } catch (error) {
    logger.error(`Error retrieving audit trail: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving audit trail',
      error: error.message
    });
  }
};

exports.generateCertificate = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findOne({ propertyId });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const certificate = {
      certificateId: `CERT-${propertyId}-${Date.now()}`,
      propertyId,
      owner: property.owner,
      location: property.location,
      area: property.area,
      registrationDate: property.registrationDate,
      issuanceDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      blockchainHash: property.blockchainHash,
      status: 'valid',
      coordinates: property.coordinates
    };

    res.json({
      success: true,
      message: 'Digital ownership certificate generated',
      data: certificate
    });
  } catch (error) {
    logger.error(`Error generating certificate: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error generating certificate',
      error: error.message
    });
  }
};
