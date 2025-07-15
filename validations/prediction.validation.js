const Joi = require("joi");
const { query } = require("winston");

const makePoolPredictionSchema = {
  query: Joi.object().keys({
    pool_id: Joi.number().integer().required(),
    distributer_id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    predictions: Joi.array()
      .items(
        Joi.object({
          matchId: Joi.number().integer().required(),
          PredictionId: Joi.number().integer().required(),
        })
      )
      .min(1)
      .required(),
  }),
};

const getPoolPredictionsSchema = {
  query: Joi.object().keys({
    pool_id: Joi.number().integer().required(),
    distributer_id: Joi.number().integer().required(),
  }),
};

module.exports = {
  makePoolPredictionSchema,
  getPoolPredictionsSchema,
};
