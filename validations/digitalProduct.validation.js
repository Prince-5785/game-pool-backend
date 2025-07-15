//digital product validation schema
const Joi = require("joi");
const { unique, exists } = require("./custom.validation");

const createDigitalProductValidateSchema = {
  body: Joi.object().keys({
    key: Joi.string()
      .required()
      .external(unique("DigitalProduct", "key"))
      .messages({
        "any.required": "Key is required",
        "string.external": "Key must be unique",
      }),
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.base": "Name must be a string",
    }),
    description: Joi.string().optional().allow("").messages({
      "string.base": "Description must be a string",
    }),
    barcode: Joi.string().optional().allow("").messages({
      "string.base": "Barcode must be a string",
    }),
    category_id: Joi.number()
      .required()
      .external(exists("ProductCategory", "id"))
      .messages({
        "any.required": "Category ID is required",
        "number.external": "Category ID does not exist",
      }),
    unit_price: Joi.number().required().min(0).precision(2).messages({
      "any.required": "Unit price is required",
      "number.base": "Unit price must be a number",
      "number.min": "Unit price must be at least 0",
    }),
    inventory_item: Joi.boolean().required().default(false).messages({
      "any.required": "Inventory item status is required",
      "boolean.base": "Inventory item status must be a boolean",
    }),
    item_for_sale: Joi.boolean().required().default(false).messages({
      "any.required": "Item for sale status is required",
      "boolean.base": "Item for sale status must be a boolean",
    }),
    purchase_item: Joi.boolean().required().default(false).messages({
      "any.required": "Purchase item status is required",
      "boolean.base": "Purchase item status must be a boolean",
    }),
    ecommerce_article: Joi.boolean().required().default(false).messages({
      "any.required": "Ecommerce article status is required",
      "boolean.base": "Ecommerce article status must be a boolean",
    }),
    status: Joi.number().integer().required().valid(0, 1).default(1).messages({
      "any.required": "Status is required",
      "number.base": "Status must be a number",
      "number.valid": "Status must be either 0 (Inactive) or 1 (Active)",
    }),
    poolsId: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number().required().external(exists("Pool", "id")).messages({
            "any.required": "Pool ID is required",
            "number.external": "Pool ID does not exist",
          }),
        })
      )
      .required()
      .min(1)
      .messages({
        "any.required": "Pools ID is required",
        "array.base": "Pools ID must be an array",
        "array.min": "Pools ID must contain at least one pool",
        "array.items": "Each pool must have a valid ID",
      }),
  }),
};

const updateDigitalProductValidateSchema = {
  params: Joi.object().keys({
    digitalProductId: Joi.number()
      .required()
      .external(exists("DigitalProduct", "id"))
      .messages({
        "any.required": "Digital Product ID is required",
        "number.external": "Digital Product ID does not exist",
      }),
  }),
  body: Joi.object().keys({
    key: Joi.string()
      .optional()
      .messages({
        "string.external": "Key must be unique",
      }),
    name: Joi.string().optional().messages({
      "string.base": "Name must be a string",
    }),
    description: Joi.string().optional().allow("").messages({
      "string.base": "Description must be a string",
    }),
    barcode: Joi.string().optional().allow("").messages({
      "string.base": "Barcode must be a string",
    }),
    category_id: Joi.number()
      .optional()
      .external(exists("ProductCategory", "id"))
      .messages({
        "number.external": "Category ID does not exist",
      }),
    unit_price: Joi.number().optional().min(0).precision(2).messages({
      "number.base": "Unit price must be a number",
      "number.min": "Unit price must be at least 0",
      "number.precision": "Unit price must have at most 2 decimal places",
    }),
    inventory_item: Joi.boolean().optional().default(false).messages({
      "boolean.base": "Inventory item status must be a boolean",
    }),
    item_for_sale: Joi.boolean().optional().default(false).messages({
      "boolean.base": "Item for sale status must be a boolean",
    }),
    purchase_item: Joi.boolean().optional().default(false).messages({
      "boolean.base": "Purchase item status must be a boolean",
    }),
    ecommerce_article: Joi.boolean().optional().default(false).messages({
      "boolean.base": "Ecommerce article status must be a boolean",
    }),
    status: Joi.number().integer().optional().valid(0, 1).default(1).messages({
      "number.base": "Status must be a number",
      "number.valid": "Status must be either 0 (Inactive) or 1 (Active)",
    }),
    poolsId: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number().required().external(exists("Pool", "id")).messages({
            "any.required": "Pool ID is required",
            "number.external": "Pool ID does not exist",
          }),
        })
      )
      .optional()
      .min(1)
      .messages({
        "array.min": "At least one pool ID must be provided",
      }),
  }),
};

const getDigitalProductPoolsValidateSchema = {
  params: Joi.object().keys({
    digitalProductId: Joi.number()
      .required()
      .external(exists("DigitalProduct", "id"))
      .messages({
        "any.required": "Digital Product ID is required",
        "number.external": "Digital Product ID does not exist",
      }),
  }),
};

const listDigitalProductsValidateSchema = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

const deleteDigitalProductValidateSchema = {
  params: Joi.object().keys({
    digitalProductId: Joi.number()
      .required()
      .external(exists("DigitalProduct", "id"))
      .messages({
        "any.required": "Digital Product ID is required",
        "number.external": "Digital Product ID does not exist",
      }),
  }),
};

const getPoolMatchesValidateSchema = {
  params: Joi.object().keys({
    poolId: Joi.number().required().external(exists("Pool", "id")).messages({
      "any.required": "Digital Product ID is required",
      "number.external": "Digital Product ID does not exist",
    }),
  }),
};

const listSamePricePoolsValidateSchema = {
  query: Joi.object().keys({
    price: Joi.number().required().min(0).precision(2).messages({
      "any.required": "Price is required",
      "number.base": "Price must be a number",
      "number.min": "Price must be at least 0",
      "number.precision": "Price must have at most 2 decimal places",
    }),
  }),
};


module.exports = {
  createDigitalProductValidateSchema,
  getDigitalProductPoolsValidateSchema,
  getPoolMatchesValidateSchema,
  listDigitalProductsValidateSchema,
  listSamePricePoolsValidateSchema,
  updateDigitalProductValidateSchema,
  deleteDigitalProductValidateSchema
};
