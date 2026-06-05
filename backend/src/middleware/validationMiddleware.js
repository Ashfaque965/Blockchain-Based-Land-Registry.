const { body, validationResult } = require('express-validator');

exports.validatePropertyRegistration = [
  body('propertyId').isString().notEmpty().trim(),
  body('owner').isString().notEmpty().trim(),
  body('location').isString().notEmpty().trim(),
  body('area').isFloat({ gt: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateTransferOwnership = [
  body('propertyId').isString().notEmpty().trim(),
  body('newOwner').isString().notEmpty().trim(),
  body('transferDetails').isObject(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateVerification = [
  body('propertyId').isString().notEmpty().trim(),
  body('owner').isString().notEmpty().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    next();
  }
];
