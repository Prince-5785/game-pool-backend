// validation/distributor.schema.js
const Joi = require("joi");
const { unique, exists } = require("./custom.validation");
const { query } = require("winston");
const { param } = require("../routes/distributer.route");



const listDigitalProductsForDistributorSchema = {
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")), // use distributor_id instead of
  }),
  query: Joi.object().keys({
    page: Joi.number()
      .integer()
      .min(1)
      .required()
      .description("Page number (1-based)")
      .default(1),

    per_page: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .required()
      .description("Items per page (max 100)")
      .default(10),
  }),
};

const getDigitalProductPoolSchema = {
  query: Joi.object().keys({
    digital_product_id: Joi.number()
      .integer()
      .required()
      .external(exists("DigitalProduct", "id")),
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")), // use distributor_id instead of
  }),
};

const getPoolMatchesSchema = {
  params: Joi.object().keys({
    pool_id: Joi.number().integer().required().external(exists("Pool", "id")),
  }),
};



const makeUserPoolPurchaseSchema = Joi.object({
  body: Joi.object().keys({
    phone_number: Joi.string()
      .pattern(/^[+0-9\-() ]{7,20}$/)
      .length(10)
      .required()
      .description("Phone number of the user"),

    pool_id: Joi.number()
      .integer()
      .required()
      .external(exists("Pool", "id"))
      .description("ID of the pool being purchased"),

    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id"))
      .description("ID of the distributor"),

    purchase_quantity: Joi.number()
      .integer()
      .min(1)
      .required()
      .description("Quantity of pools being purchased"),

    matchesWithPredictions: Joi.array()
      .items(
        Joi.object({
          match_id: Joi.number()
            .integer()
            .required()
            .external(exists("Match", "id"))
            .description("ID of the match"),
          prediction_id: Joi.number()
            .integer()
            .optional()
            .external(exists("Prediction", "id"))
            .description("ID of the prediction (optional)"),
        })
      )
      .optional()
      .description("Array of matches with optional predictions"),
  }),
});




const poolTicketCancellationRequestSchema = Joi.object({
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")), // use distributor_id instead of distributerId
  }),
  body: Joi.object().keys({
    user_purchased_pool_id: Joi.number()
      .integer()
      .required()
      .description("ID of the user purchased pool for cancellation")
      .external(exists("UserPoolPurchase", "id")),

    comments: Joi.string()
      .max(512)
      .required()
      .description("Comments for the cancellation request"),

    attention_date: Joi.date()
      .iso()
      .required()
      .description("Date for attention"),

    attention_time: Joi.string()
      .pattern(/^\d{2}:\d{2}:\d{2}$/)
      .required()
      .description("Time for attention in HH:mm:ss format"),

    attended_by: Joi.string()
      .max(64)
      .optional()
      .description("Name of the person who attended the request"),

    request_status: Joi.number()
      .valid(0, 1, 2)
      .required()
      .default(0) // Default to Pending
      .description(
        "Filter by status: 0 = Pending, 1 = Authorized, 2 = Rejected"
      ),
  }),
});


const publicTicketValidateSchema = {
    body: Joi.object().keys({
        phone_number: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .external(exists('UserPurchasedPool', 'phone_number'))
        .messages({
            'string.pattern.base': 'Phone number must be a 10-digit number',
            'any.required': 'Phone number is required'
        }),
        
        full_code: Joi.string()
        .required()
        .external(exists('UserPurchasedPool', 'full_code'))
        .messages({
            'any.required': 'Full code is required',
            'string.external': 'Full code does not exist'
        })
    })
};


module.exports = {
  makeUserPoolPurchaseSchema,
  listDigitalProductsForDistributorSchema,
  getDigitalProductPoolSchema,
  getPoolMatchesSchema,
  poolTicketCancellationRequestSchema,
  publicTicketValidateSchema
};
