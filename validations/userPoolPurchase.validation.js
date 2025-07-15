const Joi = require("joi");
const { unique, exists } = require("./custom.validation");

const getUserPurchasedPoolsSchema = Joi.object({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).required(),
    per_page: Joi.number().integer().min(1).max(100).required(),
    pool_id: Joi.number().integer().external(exists("Pool", "id")).optional(),
    distributor_id: Joi.number()
      .integer()
      .external(exists("Distributer", "id"))
      .optional(),
  }),
});

const getUserPurchasedPoolsByIdSchema = Joi.object({
  params: Joi.object().keys({
    user_id: Joi.string()
      .required()
      .external(exists("UserPurchasedPool", "id"))
      .messages({
        "any.required": "User ID is required",
        "string.external": "User ID does not exist",
      }),
  }),
});

const deleteUserPurchasedPoolSchema = Joi.object({
  params: Joi.object().keys({
    user_id: Joi.string()
      .required()
      .external(exists("UserPurchasedPool", "id"))
      .messages({
        "any.required": "User Purchased Pool ID is required",
        "string.external": "User Purchased Pool ID does not exist",
      }),
  }),
});

const listPoolTicketsCancellationRequestsSchema = Joi.object({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1).optional().messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
    }),
    per_page: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .optional()
      .messages({
        "number.base": "Per page must be a number",
        "number.integer": "Per page must be an integer",
        "number.min": "Per page must be at least 1",
        "number.max": "Per page cannot exceed 100",
      }),
    distributor_id: Joi.number()
      .integer()
      .external(exists("Distributer", "id"))
      .optional()
      .messages({
        "number.base": "Distributor ID must be a number",
        "number.integer": "Distributor ID must be an integer",
        "string.external": "Distributor ID does not exist",
      }),
  }),
});

module.exports = {
  getUserPurchasedPoolsSchema,
  getUserPurchasedPoolsByIdSchema,
  deleteUserPurchasedPoolSchema,
  listPoolTicketsCancellationRequestsSchema,
};
