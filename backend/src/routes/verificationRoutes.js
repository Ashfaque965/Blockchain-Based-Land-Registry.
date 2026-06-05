const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

router.post('/ownership', verificationController.verifyOwnership);
router.get('/history/:propertyId', verificationController.verifyTransactionHistory);
router.get('/audit/:propertyId', verificationController.auditTrail);
router.get('/certificate/:propertyId', verificationController.generateCertificate);

module.exports = router;
