const { fieldsValidation } = require('./field-validation');
const validateExistenceAccessHeader = require('./validateExistenceAccessHeader');
const validateTokenAlive = require('./validateTokenAlive');
const validateAuth = require('./validateAuth');
const validateSession = require('./validateSession');

module.exports = {
  fieldsValidation,
  validateExistenceAccessHeader,
  validateSession,
  validateTokenAlive,
  validateAuth,
};
