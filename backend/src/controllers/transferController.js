const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const fabricClient = require('../utils/fabricClient');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

exports.transferProperty = async (req, res) => {
  try {
    const { propertyId, newOwner, transferDetails } = req.body;

    // Validate input
    if (!propertyId || !newOwner || !transferDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check property exists
    const property = await Property.findOne({ propertyId });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const previousOwner = property.owner;

    // Submit to blockchain
    const result = await fabricClient.submitTransaction('transferOwnership', [
      propertyId,
      newOwner,
      JSON.stringify(transferDetails)
    ]);

    const blockchainResponse = JSON.parse(result);

    // Create transaction record
    const transactionId = `TXN-${uuidv4()}`;
    const transaction = new Transaction({
      transactionId,
      propertyId,
      fromOwner: previousOwner,
      toOwner: newOwner,
      type: 'transfer',
      status: 'confirmed',
      blockchainHash: blockchainResponse.transactionId,
      details: transferDetails,
      verificationDate: new Date()
    });

    await transaction.save();

    // Update property
    property.owner = newOwner;
    property.status = 'transferred';
    property.transactionHistory.push({
      transactionId,
      type: 'transfer',
      from: previousOwner,
      to: newOwner,
      timestamp: new Date(),
      details: transferDetails
    });
    await property.save();

    logger.info(`Property ${propertyId} transferred from ${previousOwner} to ${newOwner}`);

    res.status(201).json({
      success: true,
      message: 'Property transferred successfully',
      data: {
        transaction,
        property
      }
    });
  } catch (error) {
    logger.error(`Error transferring property: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error transferring property',
      error: error.message
    });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ propertyId })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await Transaction.countDocuments({ propertyId });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Error fetching transaction history: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction history',
      error: error.message
    });
  }
};

exports.getOwnerTransactions = async (req, res) => {
  try {
    const { owner } = req.params;
    const { page = 1, limit = 10, type } = req.query;

    const skip = (page - 1) * limit;
    const query = {
      $or: [
        { fromOwner: owner },
        { toOwner: owner }
      ]
    };

    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Error fetching owner transactions: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

exports.getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error(`Error fetching transaction details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error.message
    });
  }
};
