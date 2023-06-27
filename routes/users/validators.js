const Joi = require("joi");

/**
 * Validate the request body parameters for creating a user.
 * @param {object} requestBody - The request body object.
 * @returns {object} - The validation result object.
 */
function validateCreateUser(requestBody) {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(2).max(50),
    email: Joi.string().required().trim().email().max(255),
  });

  return schema.validate(requestBody);
}

const validateUpdateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email().max(255),
  });

  return schema.validate(data);
};

module.exports = {
  validateUpdateUser,
  validateCreateUser,
};
