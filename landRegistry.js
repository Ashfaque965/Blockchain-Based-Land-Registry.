'use strict';

const { Contract } = require('fabric-contract-api');

class LandRegistryContract extends Contract {
  /**
   * Register a new property on the blockchain
   * @param ctx - Transaction context
   * @param propertyId - Unique property identifier
   * @param owner - Owner's name/ID
   * @param location - Property location
   * @param area - Property area in sq. ft
   * @param metadata - Additional property details
   */
  async registerProperty(ctx, propertyId, owner, location, area, metadata) {
    // Check if property already exists
    const exists = await ctx.stub.getState(propertyId);
    if (exists && exists.length > 0) {
      throw new Error(`Property ${propertyId} already exists`);
    }

    const property = {
      docType: 'property',
      propertyId: propertyId,
      owner: owner,
      location: location,
      area: area,
      metadata: metadata,
      registrationDate: new Date().toISOString(),
      transferHistory: [],
      status: 'registered'
    };

    await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
    
    // Emit event for property registration
    ctx.stub.setEvent('PropertyRegistered', Buffer.from(JSON.stringify({
      propertyId,
      owner,
      location,
      timestamp: new Date().toISOString()
    })));

    return JSON.stringify(property);
  }

  /**
   * Transfer property ownership
   * @param ctx - Transaction context
   * @param propertyId - Property identifier
   * @param newOwner - New owner's name/ID
   * @param transferDetails - Details of the transfer (price, date, etc.)
   */
  async transferOwnership(ctx, propertyId, newOwner, transferDetails) {
    const propertyBytes = await ctx.stub.getState(propertyId);
    
    if (!propertyBytes || propertyBytes.length === 0) {
      throw new Error(`Property ${propertyId} does not exist`);
    }

    const property = JSON.parse(propertyBytes.toString());
    const previousOwner = property.owner;

    // Record transfer in history
    const transfer = {
      from: previousOwner,
      to: newOwner,
      timestamp: new Date().toISOString(),
      details: transferDetails,
      transactionId: ctx.stub.getTxID()
    };

    property.transferHistory.push(transfer);
    property.owner = newOwner;

    await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));

    // Emit event for ownership transfer
    ctx.stub.setEvent('OwnershipTransferred', Buffer.from(JSON.stringify({
      propertyId,
      from: previousOwner,
      to: newOwner,
      timestamp: transfer.timestamp,
      txId: transfer.transactionId
    })));

    return JSON.stringify(transfer);
  }

  /**
   * Get property details
   * @param ctx - Transaction context
   * @param propertyId - Property identifier
   */
  async getProperty(ctx, propertyId) {
    const propertyBytes = await ctx.stub.getState(propertyId);
    
    if (!propertyBytes || propertyBytes.length === 0) {
      throw new Error(`Property ${propertyId} does not exist`);
    }

    return propertyBytes.toString();
  }

  /**
   * Get property transfer history
   * @param ctx - Transaction context
   * @param propertyId - Property identifier
   */
  async getTransferHistory(ctx, propertyId) {
    const propertyBytes = await ctx.stub.getState(propertyId);
    
    if (!propertyBytes || propertyBytes.length === 0) {
      throw new Error(`Property ${propertyId} does not exist`);
    }

    const property = JSON.parse(propertyBytes.toString());
    return JSON.stringify(property.transferHistory);
  }

  /**
   * Verify property ownership
   * @param ctx - Transaction context
   * @param propertyId - Property identifier
   * @param owner - Owner to verify
   */
  async verifyOwnership(ctx, propertyId, owner) {
    const propertyBytes = await ctx.stub.getState(propertyId);
    
    if (!propertyBytes || propertyBytes.length === 0) {
      throw new Error(`Property ${propertyId} does not exist`);
    }

    const property = JSON.parse(propertyBytes.toString());
    const isOwner = property.owner === owner;

    return JSON.stringify({
      propertyId,
      owner,
      isOwner,
      currentOwner: property.owner,
      verificationDate: new Date().toISOString()
    });
  }

  /**
   * Update property metadata
   * @param ctx - Transaction context
   * @param propertyId - Property identifier
   * @param newMetadata - Updated metadata
   */
  async updatePropertyMetadata(ctx, propertyId, newMetadata) {
    const propertyBytes = await ctx.stub.getState(propertyId);
    
    if (!propertyBytes || propertyBytes.length === 0) {
      throw new Error(`Property ${propertyId} does not exist`);
    }

    const property = JSON.parse(propertyBytes.toString());
    property.metadata = JSON.parse(newMetadata);
    property.lastUpdated = new Date().toISOString();

    await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));

    ctx.stub.setEvent('PropertyUpdated', Buffer.from(JSON.stringify({
      propertyId,
      timestamp: property.lastUpdated
    })));

    return JSON.stringify(property);
  }

  /**
   * Query properties by owner
   * @param ctx - Transaction context
   * @param owner - Owner name/ID
   */
  async queryPropertiesByOwner(ctx, owner) {
    const queryString = JSON.stringify({
      selector: {
        docType: 'property',
        owner: owner
      }
    });

    return await this._queryWithString(ctx, queryString);
  }

  /**
   * Query all properties
   * @param ctx - Transaction context
   */
  async queryAllProperties(ctx) {
    const queryString = JSON.stringify({
      selector: {
        docType: 'property'
      }
    });

    return await this._queryWithString(ctx, queryString);
  }

  /**
   * Helper method for querying
   */
  async _queryWithString(ctx, queryString) {
    let resultsIterator = await ctx.stub.getQueryResultsForQueryString(queryString);
    let allResults = [];

    let result = await resultsIterator.next();
    while (!result.done) {
      if (result.value) {
        allResults.push(JSON.parse(result.value.value.toString('utf8')));
      }
      result = await resultsIterator.next();
    }

    await resultsIterator.close();
    return JSON.stringify(allResults);
  }
}

module.exports = LandRegistryContract;
