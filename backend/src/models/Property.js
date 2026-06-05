const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  owner: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'transferred', 'disputed', 'archived'],
    default: 'registered'
  },
  blockchainHash: {
    type: String,
    required: true,
    unique: true
  },
  transactionHistory: [{
    transactionId: String,
    type: String,
    from: String,
    to: String,
    timestamp: Date,
    details: mongoose.Schema.Types.Mixed
  }],
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadDate: Date
  }]
}, {
  timestamps: true,
  collection: 'properties'
});

propertySchema.index({ owner: 1, status: 1 });
propertySchema.index({ registrationDate: -1 });

module.exports = mongoose.model('Property', propertySchema);
