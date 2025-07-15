const models = require("../models");
const { Op } = require("sequelize");
 
/**
 * Higher order function to catch errors in validator functions.
 * Wraps the given function and, on error, always returns a Joi validation error
 * (including the field name) instead of throwing an ApiError.
 * @param {Function} fn - The validator function to wrap.
 * @returns {Function} A new function with error handling.
 */
const catchValidationError = (fn) => {
  return async (value, helpers) => {
    try {
      return await fn(value, helpers);
    } catch (error) {
      // Get the field name from helpers.state.path if available.
      const fieldName =
        helpers.state && helpers.state.path && helpers.state.path.length
          ? helpers.state.path[helpers.state.path.length - 1]
          : "value";
 
      // Specific handling for Sequelize invalid UUID syntax error.
      if (
        error.name === "SequelizeDatabaseError" &&
        error.parent &&
        error.parent.code === "22P02"
      ) {
        return helpers.message(
          `${fieldName} has invalid input syntax for type uuid`
        );
      }
 
      // For any other error, return it as a validation error message for the given field.
      return helpers.message(`${fieldName} - ${error.message}`);
    }
  };
};
 
/**
 * Returns a custom validator function that checks if a value (or combination of values)
 * exists for a given field or fields in a given model.
 * @param {string} modelName - The name of the model (e.g., "User").
 * @param {string|string[]} fieldNames - The field name or an array of field names to check.
 * @returns {Function} An asynchronous Joi custom validator function.
 */
const exists = (modelName, fieldNames) => {
  return catchValidationError(async (value, helpers) => {
    if (!value) {
      return value;
    }
 
    const Model = models[modelName];
    if (!Model) {
      return helpers.error(`Model "${modelName}" not found`);
    }
 
    // Build the where clause dynamically for single or composite fields.
    let where = {};
    if (Array.isArray(fieldNames)) {
      for (const fieldName of fieldNames) {
        if (value[fieldName] !== undefined) {
          where[fieldName] = value[fieldName];
        }
      }
      // If none of the fields are provided, skip existence check.
      if (Object.keys(where).length === 0) {
        return value;
      }
    } else {
      if (value === undefined) {
        return value;
      }
      where[fieldNames] = value;
    }
 
    const existing = await Model.findOne({ where });
    if (!existing) {
      if (Array.isArray(fieldNames)) {
        return helpers.message(
          `Combination of ${fieldNames.join(" and ")} does not exist`
        );
      }
      return helpers.message(`${fieldNames} does not exist`);
    }
    return value;
  });
};
 
/**
 * Returns a custom validator function that checks if a value (or combination of values)
 * is unique for a given field or fields in a given model.
 * @param {string} modelName - The name of the model (e.g., "User").
 * @param {string|string[]} fieldNames - The field name or an array of field names to check.
 * @param {object} [options] - Optional settings.
 * @param {string} [options.excludeId] - A primary key value to exclude from the check.
 * @returns {Function} An asynchronous Joi custom validator function.
 */
 
const unique = (modelName, fieldNames, options = {}) => {
  return catchValidationError(async (value, helpers) => {
    if (!value) {
      return value;
    }
    const excludeId = options.excludeId || null;
    const Model = models[modelName];
    if (!Model) return helpers.error(`Model "${modelName}" not found`);
 
    // Build the where clause dynamically for single or composite fields.
    let where = {};
    if (Array.isArray(fieldNames)) {
      for (const fieldName of fieldNames) {
        if (value[fieldName] !== undefined) {
          where[fieldName] = value[fieldName];
        }
      }
      // If none of the fields are provided, skip the uniqueness check.
      if (Object.keys(where).length === 0) {
        return value;
      }
    } else {
      where[fieldNames] = value;
    }
 
    // If excludeId is provided, exclude that primary key from the search.
    if (excludeId) {
      // Use the first primary key field defined in the model.
      const pkField = Model.primaryKeyAttributes[0];
      where[pkField] = { [Op.ne]: excludeId };
    }
 
    const existing = await Model.findOne({ where });
    if (existing) {
      if (Array.isArray(fieldNames)) {
        return helpers.message(
          `Combination of ${fieldNames.join(" and ")} already exists`
        );
      } else {
        return helpers.message(`${fieldNames} already exists`);
      }
    }
    return value;
  });
};
 
/**
 * Validates a password based on length and character requirements.
 * @param {string} value - The password to validate.
 * @param {object} helpers - Joi helpers for validation messages.
 * @returns {string} The validated password if criteria are met.
 */
const password = catchValidationError((value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
});
 
/**
 * Validates a latitude value.
 * Latitude must be a number between -90 and 90.
 * @param {string} value - The latitude value to validate.
 * @param {object} helpers - Joi helpers for validation messages.
 * @returns {string} The validated latitude if it is correct.
 */
const latitude = catchValidationError((value, helpers) => {
  const latitudeRegex = /^(-?([1-8]?[0-9](\.\d+)?|90(\.0+)?))$/;
  if (!latitudeRegex.test(value)) {
    return helpers.message(
      '"{{#label}}" must be a valid latitude between -90 and 90'
    );
  }
  return value;
});
 
/**
 * Validates a longitude value.
 * Longitude must be a number between -180 and 180.
 * @param {string} value - The longitude value to validate.
 * @param {object} helpers - Joi helpers for validation messages.
 * @returns {string} The validated longitude if it is correct.
 */
const longitude = catchValidationError((value, helpers) => {
  const longitudeRegex = /^(-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?|180(\.0+)?))$/;
  if (!longitudeRegex.test(value)) {
    return helpers.message(
      '"{{#label}}" must be a valid longitude between -180 and 180'
    );
  }
  return value;
});

 
module.exports = {
  password,
  exists,
  unique,
  latitude,
  longitude,
};
 