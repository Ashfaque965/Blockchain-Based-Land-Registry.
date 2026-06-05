const Property = require('../models/Property');
const fabricClient = require('../utils/fabricClient');
const logger = require('../config/logger');

exports.registerProperty = async (req, res) => {
  try {
    const { propertyId, owner, location, area, metadata, coordinates } = req.body;

    // Validate input
    if (!propertyId || !owner || !location || !area) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if property exists
    const existingProperty = await Property.findOne({ propertyId });
    if (existingProperty) {
      return res.status(409).json({
        success: false,
        message: 'Property already registered'
      });
    }

    // Submit to blockchain
    const result = await fabricClient.submitTransaction('registerProperty', [
      propertyId,
      owner,
      location,
      area.toString(),
      JSON.stringify(metadata || {})
    ]);

    const blockchainResponse = JSON.parse(result);

    // Store in MongoDB
    const property = new Property({
      propertyId,
      owner,
      location,
      area,
      coordinates,
      metadata,
      blockchainHash: blockchainResponse.blockchainHash || propertyId,
      status: 'registered'
    });

    await property.save();

    logger.info(`Property ${propertyId} registered successfully`);

    res.status(201).json({
      success: true,
      message: 'Property registered successfully',
      data: property
    });
  } catch (error) {
    logger.error(`Error registering property: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error registering property',
      error: error.message
    });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Get from MongoDB
    const property = await Property.findOne({ propertyId });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Optionally verify with blockchain
    const blockchainData = await fabricClient.evaluateTransaction('getProperty', [propertyId]);
    const blockchainProperty = JSON.parse(blockchainData);

    res.json({
      success: true,
      data: {
        offChain: property,
        onChain: blockchainProperty
      }
    });
  } catch (error) {
    logger.error(`Error fetching property: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

exports.getPropertiesByOwner = async (req, res) => {
  try {
    const { owner } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const properties = await Property.find({ owner, status: { $ne: 'archived' } })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ registrationDate: -1 });

    const total = await Property.countDocuments({ owner, status: { $ne: 'archived' } });

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Error fetching properties: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

exports.updatePropertyMetadata = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { metadata } = req.body;

    const property = await Property.findOne({ propertyId });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update on blockchain
    await fabricClient.submitTransaction('updatePropertyMetadata', [
      propertyId,
      JSON.stringify(metadata)
    ]);

    // Update in MongoDB
    property.metadata = metadata;
    property.lastUpdated = new Date();
    await property.save();

    logger.info(`Property ${propertyId} metadata updated`);

    res.json({
      success: true,
      message: 'Property metadata updated successfully',
      data: property
    });
  } catch (error) {
    logger.error(`Error updating property metadata: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating property metadata',
      error: error.message
    });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const skip = (page - 1) * limit;
    const query = status ? { status } : {};

    const properties = await Property.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ registrationDate: -1 });

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Error fetching all properties: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};
