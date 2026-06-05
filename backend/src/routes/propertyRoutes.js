const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticate } = require('../middleware/authMiddleware');
const { validatePropertyRegistration } = require('../middleware/validationMiddleware');

router.post('/', authenticate, validatePropertyRegistration, propertyController.registerProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:propertyId', propertyController.getProperty);
router.get('/owner/:owner', propertyController.getPropertiesByOwner);
router.put('/:propertyId', authenticate, propertyController.updatePropertyMetadata);

module.exports = router;
