// validation/pool.schema.js
const Joi = require("joi");
const { unique, exists } = require("./custom.validation");
const e = require("express");
const { on } = require("winston-daily-rotate-file");

const poolSchema = {
  body: Joi.object().keys({
    key: Joi.string()
      .alphanum()
      .max(64)
      .required()
      .external(unique("Pool", "key")),

    start_sale_date: Joi.date()
      .iso()
      .required()
      .description("Start date for pool sales"),

    start_sale_time: Joi.string()
      .pattern(/^\d{2}:\d{2}:\d{2}$/)
      .required()
      .description("Start time for pool sales in HH:mm:ss format"),

    dmquiniela_id: Joi.number()
      .integer()
      .required()
      .external(exists("Dmquiniela", "id"))
      .description("ID of the associated Dmquiniela"),

    total_doubles: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .description("Total number of double predictions allowed, default is 0"),

    total_triples: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .description("Total number of triple predictions allowed, default is 0"),

    status: Joi.number()
      .valid(0, 1, 2)
      .required()
      .description(
        "Filter by status: 0 = Pending, 1 = Authorized, 2 = Rejected"
      ),

    view: Joi.number()
      .integer()
      .valid(0, 1)
      .required()
      .description("View type: 0 = General, 1 = Conditional"),

    conditional_distributor_ids: Joi.array()
      .items(
        Joi.number()
          .integer()
          .external(exists("Distributer", "id"))
          .description("ID of the conditional distributor")
      )
      .when("view", {
        is: 1,
        then: Joi.array().required(),
        otherwise: Joi.array().optional(),
      }),

    ecommerce_expiry: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .description(
        "Number of hours before the pool end sale that the pool closes for ecommerce, default is 0"
      ),

    online: Joi.boolean()
      .default(false)
      .description(
        "Indicates if the pool is available online, default is false"
      ),

    type: Joi.number()
      .integer()
      .valid(0, 1)
      .required()
      .description("Type of pool prediction: 0 = defined, 1 = free"),

    matchesWithPredictions: Joi.array()
      .items(
        Joi.object({
          match_id: Joi.number()
            .integer()
            .required()
            .external(exists("Match", "id")),
          prediction_value: Joi.string()
            .optional()
            .external(exists("Prediction", "value"))
            .description(
              "ID of the match prediction associated with the match"
            ),
        })
      )
      .required(),
  }),
};

const updatePoolSchema = {
  params: Joi.object().keys({
    pool_id: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      key: Joi.string()
        .alphanum()
        .max(64)
        .optional(),

      start_sale_date: Joi.date()
        .iso()
        .optional()
        .description("Start date for pool sales"),

      start_sale_time: Joi.string()
        .pattern(/^\d{2}:\d{2}:\d{2}$/)
        .optional()
        .description("Start time for pool sales in HH:mm:ss format"),

      dmquiniela_id: Joi.number()
        .integer()
        .optional()
        .external(exists("Dmquiniela", "id"))
        .description("ID of the associated Dmquiniela"),

      total_doubles: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .optional()
        .description(
          "Total number of double predictions allowed, default is 0"
        ),

      total_triples: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .optional()
        .description(
          "Total number of triple predictions allowed, default is 0"
        ),

      status: Joi.number()
        .valid(0, 1, 2)
        .optional()
        .description(
          "Filter by status: 0 = Pending, 1 = Authorized, 2 = Rejected"
        ),

      view: Joi.number()
        .integer()
        .valid(0, 1)
        .optional()
        .description("View type: 0 = General, 1 = Conditional"),

      conditional_distributor_ids: Joi.array()
        .items(
          Joi.number()
            .integer()
            .external(exists("Distributer", "id"))
            .description("ID of the conditional distributor")
        )
        .when("view", {
          is: 1,
          then: Joi.array().required(),
          otherwise: Joi.array().optional(),
        }),

      ecommerce_expiry: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .optional()
        .description(
          "Number of hours before the pool end sale that the pool closes for ecommerce, default is 0"
        ),

      online: Joi.boolean()
        .default(false)
        .optional()
        .description(
          "Indicates if the pool is available online, default is false"
        ),

      type: Joi.number()
        .integer()
        .valid(0, 1)
        .optional()
        .description("Type of pool prediction: 0 = defined, 1 = free"),

      matchesWithPredictions: Joi.array()
        .items(
          Joi.object({
            match_id: Joi.number()
              .integer()
              .required()
              .external(exists("Match", "id")),
            prediction_value: Joi.string()
              .optional()
              .external(exists("Prediction", "value"))
              .description(
                "ID of the match prediction associated with the match"
              ),
          })
        )
        .min(1)
        .optional(),
    })
    .min(1)
    .description("At least one field must be provided for update"),
};

const getByIdSchema = {
  params: Joi.object().keys({
    pool_id: Joi.number()
      .integer()
      .required()
      .external(exists("Pool", "id"))
      .description("ID of the pool to retrieve"),
  }),
};

const listPoolsSchema = {
  query: Joi.object({
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

    status: Joi.number()
      .valid(0, 1, 2)
      .optional()
      .description(
        "Filter by status: 0 = Pending, 1 = Authorized, 2 = Rejected"
      ),

    // search: Joi.string().trim().optional(),
  }),
};

const getPoolByIdSchema = {
  params: Joi.object().keys({
    pool_id: Joi.number()
      .integer()
      .required()
      .external(exists("Pool", "id"))
      .description("ID of the pool to retrieve"),
  }),
};

const deletePoolSchema = {
  params: Joi.object().keys({
    pool_id: Joi.number()
      .integer()
      .required()
      .external(exists("Pool", "id"))
      .description("ID of the pool to delete"),
  }),
};

const getMaskSalesByIdSchema = {
  params: Joi.object().keys({
    mask_sales_id: Joi.number()
      .integer()
      .required()
      .external(exists("DistributerSalePool", "id"))
      .description("ID of the mask sales to retrieve"),
  }),
};

const listDistributorPools = {
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id"))
      .description("ID of the distributor to retrieve pools for"),
  }),
};

const listDistributorPoolPredictionSchema = {
  params: Joi.object().keys({
    mask_sales_id: Joi.number()
      .integer()
      .required()
      .external(exists("DistributerPurchasedPool", "id")),
  }),
};

module.exports = {
  poolSchema,
  updatePoolSchema,
  getByIdSchema,
  listPoolsSchema,
  getPoolByIdSchema,
  deletePoolSchema,
  getMaskSalesByIdSchema,
  listDistributorPoolPredictionSchema,
  listDistributorPools,
};
