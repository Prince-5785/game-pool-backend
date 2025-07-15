const Joi = require("joi");
const { unique, exists } = require("./custom.validation");

const createDmquinielaSchema = {
  body: Joi.object().keys({
    key: Joi.string()
      .alphanum()
      .max(64)
      .required()
      .external(unique("Dmquiniela", "key")),

    name: Joi.string()
      .max(128)
      .required()
      .description("Name of the pool, max 128 characters"),

    prize_type: Joi.number()
      .integer()
      .valid(0, 1)
      .required()
      .description(
        "Indicates if the prize is an actual amount (1) or a percentage of the pool price (0)"
      ),

    total_matches: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .description("Total number of matches in the pool, default is 0"),

    price: Joi.number()
      .precision(2)
      .required()
      .description("Price of the pool in USD"),

    percentage_profit: Joi.number()
      .precision(2)
      .required()
      .description("Percentage of profit from the pool price")
      .min(0)
      .max(100)
      .description("Percentage profit must be between 0 and 100"),

    game_type: Joi.number()
      .integer()
      .valid(0, 1)
      .required()
      .description(
        "Type of game logic used. Example: 0 = LEV-style win/draw/loss predictions, 1 = Marker"
      ),
    top_scoreboard: Joi.number()
      .integer()
      .optional()
      .min(0)
      .default(0)
      .description(
        "Number of top scores to display on the scoreboard, default is 0"
      ),

    dissemble_doubles_triples: Joi.boolean()
      .default(false)
      .description(
        "Indicates if the pool allows separate handling of doubles and triples, default is false"
      ),
    description: Joi.string()
      .max(512)
      .optional()
      .description("Description of the pool, max 512 characters"),

    legend: Joi.string()
      .max(512)
      .optional()
      .description(
        "Legend or additional information about the pool, max 512 characters"
      ),

    terms: Joi.string()
      .max(512)
      .optional()
      .description("Terms and conditions of the pool, max 512 characters"),

    status: Joi.number()
      .valid(0, 1, 2)
      .required()
      .description(
        "Filter by status: 0 = Pending, 1 = Authorized, 2 = Rejected"
      ),

    icon: Joi.string()
      .uri()
      .optional()
      .description("URL of the pool icon, optional"),

    prize_conditions: Joi.array()
      .items(
        Joi.object({
          condition_type: Joi.number()
            .integer()
            .valid(0, 1)
            .required()
            .description(
              "Type of condition for the prize: 0 = total correct answers, 1 = position"
            ),
          value: Joi.number()
            .precision(2)
            .required()
            .description(
              "Value associated with the condition (e.g., percentage or score)"
            ),
          award: Joi.number()
            .precision(2)
            .required()
            .description("Amount of the prize awarded if the condition is met"),
        })
      )
      .required()
      .description("Conditions for awarding prizes based on performance"),
  }),
};

const updateDmquinielaSchema = {
  params: Joi.object().keys({
    dmquiniela_id: Joi.number().integer().required().external(exists("Dmquiniela", "id")).description("ID of the Dmquiniela"),
  }),
  body: Joi.object()
    .keys({
      key: Joi.string()
        .alphanum()
        .max(64)
        .optional(),

      name: Joi.string()
        .max(128)
        .optional()
        .description("Name of the pool, max 128 characters"),

      prize_type: Joi.number()
        .integer()
        .valid(0, 1)
        .optional()
        .description(
          "Indicates if the prize is an actual amount (1) or a percentage of the pool price (0)"
        ),

      total_matches: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .optional()
        .description("Total number of matches in the pool, default is 0"),

      percentage_profit: Joi.number()
        .precision(2)
        .optional()
        .description("Percentage of profit from the pool price")
        .min(0)
        .max(100)
        .description("Percentage profit must be between 0 and 100"),

      price: Joi.number()
        .precision(2)
        .optional()
        .description("Price of the pool in USD"),

      game_type: Joi.number()
        .integer()
        .valid(0, 1)
        .optional()
        .description(
          "Type of game logic used. Example: 0 = LEV-style win/draw/loss predictions, 1 = Marker"
        ),
      top_scoreboard: Joi.number()
        .integer()
        .optional()
        .min(0)
        .default(0)
        .description(
          "Number of top scores to display on the scoreboard, default is 0"
        ),

      dissemble_doubles_triples: Joi.boolean()
        .default(false)
        .description(
          "Indicates if the pool allows separate handling of doubles and triples, default is false"
        ),
      description: Joi.string()
        .max(512)
        .optional()
        .description("Description of the pool, max 512 characters"),

      legend: Joi.string()
        .max(512)
        .optional()
        .description(
          "Legend or additional information about the pool, max 512 characters"
        ),

      terms: Joi.string()
        .max(512)
        .optional()
        .description("Terms and conditions of the pool, max 512 characters"),

      status: Joi.number()
        .valid(0, 1, 2)
        .optional()
        .description(
          "Filter by status: 0 = Pending, 1 = Authorized, 2 = Rejected"
        ),

      icon: Joi.string()
        .uri()
        .optional()
        .description("URL of the pool icon, optional"),

      prize_conditions: Joi.array()
        .items(
          Joi.object({
            condition_type: Joi.number()
              .integer()
              .valid(0, 1)
              .required()
              .description(
                "Type of condition for the prize: 0 = total correct answers, 1 = position"
              ),
            value: Joi.number()
              .precision(2)
              .required()
              .description(
                "Value associated with the condition (e.g., percentage or score)"
              ),
            award: Joi.number()
              .precision(2)
              .required()
              .description(
                "Amount of the prize awarded if the condition is met"
              ),
          })
        )
        .optional(),
    })
    .min(1),
};

const getDmquinielaByIdSchema = {
  params: Joi.object().keys({
    dmquiniela_id: Joi.number().integer().required().external(exists("Dmquiniela", "id")).description("ID of the Dmquiniela"),
  }),
};

const listDmquinielasSchema = {
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

const deleteDmquinielaSchema = {
  params: Joi.object().keys({
    dmquiniela_id: Joi.number().integer().required().external(exists("Dmquiniela", "id")).description("ID of the Dmquiniela"),
  }),
};


module.exports = {
  createDmquinielaSchema,
  updateDmquinielaSchema,
  getDmquinielaByIdSchema,
  deleteDmquinielaSchema,
  listDmquinielasSchema,
};
