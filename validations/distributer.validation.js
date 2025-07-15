// validation/distributor.schema.js
const Joi = require("joi");
const { unique, exists } = require("./custom.validation");
const { query } = require("winston");
const { param } = require("../routes/distributer.route");

const page = Joi.number()
  .integer()
  .min(1)
  .required()
  .description("Page number (1-based)")
  .default(1);

const perPage = Joi.number()
  .integer()
  .min(1)
  .max(100)
  .required()
  .description("Items per page (max 100)")
  .default(10); 

const distributorSchema = {
  body: Joi.object().keys({
    key: Joi.string()
      .alphanum()
      .max(32)
      .required()
      .external(unique("Distributer", "key")),

    name: Joi.string().max(128).required(),

    rfc: Joi.string()
      .pattern(/^[A-Z0-9]{10,13}$/) // adjust pattern to your RFC rules
      .required()
      .external(unique("Distributer", "key")),

    contact: Joi.string().max(64).required(),

    outstanding_balance: Joi.number().precision(2).min(0).required(),

    allow_status: Joi.boolean().required(),

    status: Joi.boolean().required(),

    publish: Joi.boolean().required(),

    street: Joi.string().max(128).required(),

    exterior_number: Joi.string().max(16).required(),

    interior_number: Joi.string().max(16).allow("", null), // optional

    neighborhood: Joi.string().max(64).required(),

    locality: Joi.string().max(64).required(),

    state: Joi.string().max(64).required(),

    postal_code: Joi.string().max(16).required(),

    country: Joi.string().max(64).required(),

    phone: Joi.string()
      .pattern(/^[+0-9\-() ]{7,20}$/) // basic phone format
      .required(),

    email: Joi.string()
      .email()
      .required()
      .external(unique("Distributer", "email")),

    website: Joi.string().uri().optional(),

    latitude: Joi.number().min(-90).max(90).required(),

    longitude: Joi.number().min(-180).max(180).required(),

    account_number: Joi.string()
      .pattern(/^[0-9]{6,20}$/)
      .required(),

    clabe: Joi.string()
      .pattern(/^[0-9]{18}$/) // Mexican CLABE is exactly 18 digits
      .required(),

    bank: Joi.string().max(64).required(),

    comments: Joi.string().max(512).allow("", null), // optional
  }),
};
const updateDistributorSchema = {
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")), // use distributor_id instead of distributerId
  }),
  body: Joi.object()
    .keys({
      key: Joi.string()
        .alphanum()
        .max(32)
        .external(unique("Distributer", "key"))
        .optional(),

      name: Joi.string().max(128).optional(),

      rfc: Joi.string()
        .pattern(/^[A-Z0-9]{10,13}$/)
        .external(unique("Distributer", "rfc"))
        .optional(),

      contact: Joi.string().max(64).optional(),

      outstanding_balance: Joi.number().precision(2).min(0).optional(),

      allow_status: Joi.boolean().optional(),

      status: Joi.boolean().optional(),

      publish: Joi.boolean().optional(),

      street: Joi.string().max(128).optional(),

      exterior_number: Joi.string().max(16).optional(),

      interior_number: Joi.string().max(16).allow("", null).optional(),

      neighborhood: Joi.string().max(64).optional(),

      locality: Joi.string().max(64).optional(),

      state: Joi.string().max(64).optional(),

      postal_code: Joi.string().max(16).optional(),

      country: Joi.string().max(64).optional(),

      phone: Joi.string()
        .pattern(/^[+0-9\-() ]{7,20}$/)
        .optional(),

      email: Joi.string()
        .email()
        .external(unique("Distributer", "email"))
        .optional(),

      website: Joi.string().uri().optional(),

      latitude: Joi.number().min(-90).max(90).optional(),

      longitude: Joi.number().min(-180).max(180).optional(),

      account_number: Joi.string()
        .pattern(/^[0-9]{6,20}$/)
        .optional(),

      clabe: Joi.string()
        .pattern(/^[0-9]{18}$/)
        .optional(),

      bank: Joi.string().max(64).optional(),

      comments: Joi.string().max(512).allow("", null).optional(),
    })
    .min(1),
};


const getByIdSchema = {
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")),
  }),
};

const listDistributorsSchema = {
  query: Joi.object({
    page,

    per_page: perPage,

    // legacy or alternative filter params
    filter_by_state: Joi.string().trim().optional(),
    filter_by_country: Joi.string().trim().optional(),
    filter_by_locality: Joi.string().trim().optional(),

    // direct filter params
    state: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
    locality: Joi.string().trim().optional(),

    status: Joi.number()
      .valid(0, 1)
      .optional()
      .description("Filter by status: 0 (inactive), 1 (active)"),
  }),
};


const deleteDistributorSchema = {
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")), // use distributor_id instead of distributerId
  }),
};

// Update allow status schema
const updateAllowStatusSchema = Joi.object({
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")), // use distributor_id instead of
  }),
  body: Joi.object()
    .keys({
      allow_status: Joi.boolean()
        .required()
        .description("Allow status: true or false"),
    })
    .min(1),
});

const poolSalesSchema = Joi.object({
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")), // use distributor_id instead of distributerId
  }),
});

const poolSalesFilteredSchema = Joi.object({
  params: Joi.object().keys({
    distributor_id: Joi.number()
      .integer()
      .required()
      .external(exists("Distributer", "id")), // use distributor_id instead of distributerId
  }),
  query: Joi.object({
    start_date: Joi.date()
      .iso()
      .required()
      .description("Start date for the sales filter"),
    end_date: Joi.date()
      .iso()
      .required()
      .description("End date for the sales filter"),
  })
    .required()
    .description("Filter sales by date range"),
});

module.exports = {
  distributorSchema,
  updateDistributorSchema,
  getByIdSchema,
  listDistributorsSchema,
  deleteDistributorSchema,
  updateAllowStatusSchema,
  poolSalesFilteredSchema,
  poolSalesSchema,
};
