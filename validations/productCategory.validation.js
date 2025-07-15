const Joi = require("joi");
const { unique, exists } = require("./custom.validation");

const createProductCategoryValidateSchema = {
  body: Joi.object().keys({
    key: Joi.string()
      .required()
      .external(unique("ProductCategory", "key"))
      .messages({
        "any.required": "Key is required",
        "string.external": "Key must be unique",
      }),
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.base": "Name must be a string",
    }),
    status: Joi.boolean().required().default(true).messages({
      "any.required": "Status is required",
      "boolean.base": "Status must be a boolean",
    }),
  }),
};

const updateProductCategoryValidateSchema = {
  params: Joi.object().keys({
    categoryId: Joi.number()
      .required()
      .external(exists("ProductCategory", "id"))
      .messages({
        "any.required": "Product Category ID is required",
        "number.external": "Product Category ID does not exist",
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
    status: Joi.boolean().optional().default(true).messages({
      "boolean.base": "Status must be a boolean",
    }),
  }),
};

const listProductCategoriesValidateSchema = {
  query: Joi.object()
    .keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    })
    .custom((value, helpers) => {
      if (value.page < 1) {
        return helpers.error("any.invalid", {
          message: "Page must be greater than or equal to 1",
        });
      }
      if (value.limit < 1 || value.limit > 100) {
        return helpers.error("any.invalid", {
          message: "Limit must be between 1 and 100",
        });
      }
      return value;
    }),
};

const getProductCategoryValidateSchema = {
  params: Joi.object().keys({
    categoryId: Joi.number()
      .required()
      .external(exists("ProductCategory", "id"))
      .messages({
        "any.required": "Product Category ID is required",
        "number.external": "Product Category ID does not exist",
      }),
  }),
};

const deleteProductCategoryValidateSchema = {
  params: Joi.object().keys({
    categoryId: Joi.number()
      .required()
      .external(exists("ProductCategory", "id"))
      .messages({
        "any.required": "Product Category ID is required",
        "number.external": "Product Category ID does not exist",
      }),
  }),
};


module.exports = {
  createProductCategoryValidateSchema,
  updateProductCategoryValidateSchema,
  getProductCategoryValidateSchema,
  listProductCategoriesValidateSchema,
  deleteProductCategoryValidateSchema,
};
  