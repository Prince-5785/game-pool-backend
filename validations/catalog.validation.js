const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { unique, exists } = require('./custom.validation');

const createSport = {
  body: Joi.object().keys({
    key: Joi.string().required()
      .external(unique('Sport', 'key'))
      .messages({
        'any.required': 'Key is required',
        'string.external': 'Key must be unique',
      }),
    name: Joi.string().required(),
    allows_tie: Joi.boolean().default(false)
  }),
};

const updateSport = {
  params: Joi.object().keys({
    sport_id: Joi.number().integer().required()
        .external( exists('Sport', 'id') ),
  }),
  body: Joi.object()
    .keys({
      key: Joi.string().optional()
        .messages({
          'string.external': 'Key must be unique',
        }),
      name: Joi.string().optional(),
      allows_tie: Joi.boolean().optional().default(false)
    })
    .min(1),
};

const getSport = {
  params: Joi.object().keys({
    sport_id: Joi.number()
      .integer()
      .required()
      .external(exists("Sport", "id")),
  }),
};

const deleteSportValidateSchema = {
  params: Joi.object().keys({
    sport_id: Joi.number()
      .integer()
      .required()
      .external(exists("Sport", "id")),
  }),
};

const createRegion = {
  body: Joi.object().keys({
    key: Joi.string().required().external(unique('Region', 'key'))
        .messages({
          'any.required': 'Key is required',
          'string.external': 'Key must be unique',
        }),
    name: Joi.string().required()
      .messages({
        'any.required': 'Name is required',
      }),
  }),
};

const updateRegion = {
  params: Joi.object().keys({
    region_id: Joi.number().integer().required()
        .external( exists('Region', 'id') ),
  }),
  body: Joi.object()
    .keys({
      key: Joi.string().optional(),
      name: Joi.string().optional()
    })
    .min(1),
};

const getRegion = {
  params: Joi.object().keys({
    region_id: Joi.number().integer().required()
      .external(exists("Region", "id")),
  }),
};

const deleteRegionValidateSchema = {
  params: Joi.object().keys({
    region_id: Joi.number().integer().required()
      .external(exists("Region", "id")),
  }),
};

module.exports = {
  createSport,
  updateSport,
  getSport,
  createRegion,
  updateRegion,
  getRegion,
  deleteRegionValidateSchema,
  deleteSportValidateSchema
};
