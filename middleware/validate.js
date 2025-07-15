const Joi = require("joi");
const { status: httpStatus } = require("http-status");
const { pick } = require("../utils/helper");
const { sendError } = require('../utils/ApiResponse');
const logger = require("../config/logger");
 
const validate = (schema) => async (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  try {
    // Await the asynchronous validation
    const value = await Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validateAsync(object);
    // Merge the validated values back into req
    Object.assign(req, value);
    return next();
  } catch (error) {
    // Format the validation error messages
    if (error instanceof Joi.ValidationError) {
      const data = error.details.reduce((acc, curr) => {
        const field = curr.path[curr.path.length - 1];
        acc[field] = curr.message;
        return acc;
      }, {});
      const firstMessage = error.details[0]?.message || "Validation error occurred.";
      return sendError(res, firstMessage, httpStatus.BAD_REQUEST, data);
    }
    logger.error("Unexpected validation error:", error);
   
    return sendError(res, "Internal server error", httpStatus.INTERNAL_SERVER_ERROR);
 
  }
};
 
module.exports = validate;
 
 