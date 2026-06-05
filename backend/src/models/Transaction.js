const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  propertyId: {
    type: String,
    required: true,
    index: true
  },
  fromOwner: {
    type: String,
    required: true
  },
  toOwner: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['transfer', 'registration', 'update', 'dispute'],
    default: 'transfer'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  blockchainHash: String,
  details: {
    price: Number,
    currency: { type: String, default: 'USD' },
    description: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  blockHeight: Number,
  networkConfirmations: {
    type: Number,
    default: 0
  },
  verificationDate: Date,
  documents: [{
    name: String,
    hash: String,
    url: String
  }]
}, {
  timestamps: true,
  collection: 'transactions'
});

transactionSchema.index({ propertyId: 1, timestamp: -1 });
transactionSchema.index({ fromOwner: 1, toOwner: 1 });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
