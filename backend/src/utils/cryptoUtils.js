const crypto = require('crypto');

exports.generateHash = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

exports.verifyHash = (data, hash) => {
  const computedHash = exports.generateHash(data);
  return computedHash === hash;
};

exports.encryptData = (data, key) => {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

exports.decryptData = (encryptedData, key) => {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
};

exports.generateTransactionId = () => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
};

exports.formatProperty = (property) => {
  return {
    propertyId: property.propertyId,
    owner: property.owner,
    location: property.location,
    area: property.area,
    registeredDate: property.registrationDate,
    status: property.status,
    lastModified: property.lastUpdated
  };
};
