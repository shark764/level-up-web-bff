const { fieldsValidation } = require('../../middlewares');

function validateRequiredFields(body, fields) {
  const result = {
    code: 200,
  };

  const updates = Object.keys(body);

  for (const index in fields) {
    if (!updates.includes(fields[index])) {
      result.code = 400;
    }
  }

  return result;
}

module.exports.validateRequiredFields = validateRequiredFields;
