const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, transferController.transferProperty);
router.get('/property/:propertyId', transferController.getTransactionHistory);
router.get('/owner/:owner', transferController.getOwnerTransactions);
router.get('/:transactionId', transferController.getTransactionDetails);

module.exports = router;
