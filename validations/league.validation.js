const { param } = require("../routes/league.route");
const { unique, exists } = require("./custom.validation");
const Joi = require("joi");

const createLeagueValidateSchema = {
  body: Joi.object().keys({
    key: Joi.string().required().external(unique("League", "key")).messages({
      "any.required": "League key is required",
      "string.external": "League key must be unique",
    }),
    name: Joi.string().required().messages({
      "any.required": "League name is required",
      "string.empty": "League name cannot be empty",
    }),
    sports_key: Joi.string()
      .required()
      .external(exists("Sport", "key"))
      .messages({
        "any.required": "Sport key is required",
        "string.external": "Sport key does not exist",
      }),
    region_key: Joi.string()
      .required()
      .external(exists("Region", "key"))
      .messages({
        "any.required": "Region key is required",
        "string.external": "Region key does not exist",
      }),
    country_key: Joi.string()
      .required()
      .external(exists("Country", "key"))
      .messages({
        "any.required": "Country key is required",
        "string.external": "Country key does not exist",
      }),
  }),
};

const updateLeagueValidateSchema = {
  params: Joi.object().keys({
    league_id: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": "League ID is required",
        "number.base": "League ID must be a valid number",
      }),
  }),
  body: Joi.object().keys({
    key: Joi.string().optional().messages({
      "string.external": "League key must be unique",
    }),
    name: Joi.string().optional().messages({
      "string.empty": "League name cannot be empty",
    }),
    sports_key: Joi.string()
      .optional()
      .external(exists("Sport", "key"))
      .messages({
        "string.external": "Sport key does not exist",
      }),
    region_key: Joi.string()
      .optional()
      .external(exists("Region", "key"))
      .messages({
        "string.external": "Region key does not exist",
      }),
    country_key: Joi.string()
      .optional()
      .external(exists("Country", "key"))
      .messages({
        "string.external": "Country key does not exist",
      }),
  }),
};

const getLeagueValidateSchema = {
  params: Joi.object().keys({
    league_id: Joi.number()
      .integer()
      .required()
      .external(exists("League", "id"))
      .messages({
        "any.required": "League ID is required",
        "number.base": "League ID must be a valid number",
      }),
  }),
};

const deleteLeagueValidateSchema = {
  params: Joi.object().keys({
    league_id: Joi.number()
      .integer()
      .required()
      .external(exists("League", "id"))
      .messages({
        "any.required": "League ID is required",
        "number.base": "League ID must be a valid number",
      }),
  }),
};

const createTournamentValidateSchema = {
  body: Joi.object().keys({
    key: Joi.string()
      .required()
      .external(unique("Tournament", "key"))
      .messages({
        "any.required": "Tournament key is required",
        "string.external": "Tournament key must be unique",
      }),
    name: Joi.string().required().messages({
      "any.required": "Tournament name is required",
      "string.empty": "Tournament name cannot be empty",
    }),
    start_date: Joi.date().iso().required().messages({
      "any.required": "Tournament start date is required",
      "date.base": "Tournament start date must be a valid date",
      "date.iso": "Tournament start date must be in ISO format",
    }),
    end_date: Joi.date()
      .iso()
      .greater(Joi.ref("start_date"))
      .required()
      .messages({
        "any.required": "Tournament end date is required",
        "date.base": "Tournament end date must be a valid date",
        "date.iso": "Tournament end date must be in ISO format",
        "date.greater": "Tournament end date must be after start date",
      }),
    league_key: Joi.string()
      .required()
      .external(exists("League", "key"))
      .messages({
        "any.required": "League key is required",
        "string.external": "League key does not exist",
      }),
    teams: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number()
            .integer()
            .required()
            .external(exists("Team", "id"))
            .messages({
              "any.required": "Team ID is required",
              "number.base": "Team ID must be a valid number",
            }),
        })
      )
      .min(1)
      .required()
      .messages({
        "any.required": "Team IDs are required",
        "array.base": "Team IDs must be an array",
        "array.min": "At least one team ID is required",
      }),
  }),
};

const updateTournamentValidateSchema = {
  params: Joi.object().keys({
    tournament_id: Joi.number()
      .integer()
      .required()
      .external(exists("Tournament", "id"))
      .messages({
        "any.required": "Tournament ID is required",
        "number.base": "Tournament ID must be a valid number",
      }),
  }),
  body: Joi.object().keys({
    key: Joi.string()
      .optional()
      .messages({
        "string.external": "Tournament key must be unique",
      }),
    name: Joi.string().optional().messages({
      "string.empty": "Tournament name cannot be empty",
    }),
    start_date: Joi.date().iso().optional().messages({
      "date.base": "Tournament start date must be a valid date",
      "date.iso": "Tournament start date must be in ISO format",
    }),
    end_date: Joi.date()
      .iso()
      .greater(Joi.ref("start_date"))
      .optional()
      .messages({
        "date.base": "Tournament end date must be a valid date",
        "date.iso": "Tournament end date must be in ISO format",
        "date.greater": "Tournament end date must be after start date",
      }),
    league_key: Joi.string()
      .optional()
      .external(exists("League", "key"))
      .messages({
        "string.external": "League key does not exist",
      }),
    teamsIds: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number()
            .integer()
            .required()
            .external(exists("Team", "id"))
            .messages({
              "any.required": "Team ID is required",
              "number.base": "Team ID must be a valid number",
            }),
        })
      )
      .min(1)
      .optional()
      .messages({
        "array.base": "Team IDs must be an array",
        "array.min": "At least one team ID is required",
        "any.required": "Team IDs are required",
      }),
  }),
};

const getTournamentValidateSchema = {
  params: Joi.object().keys({
    tournament_id: Joi.number()
      .integer()
      .required()
      .external(exists("Tournament", "id"))
      .messages({
        "any.required": "Tournament ID is required",
        "number.base": "Tournament ID must be a valid number",
      }),
  }),
};

const deleteTournamentValidateSchema = {
  params: Joi.object().keys({
    tournament_id: Joi.number()
      .integer()
      .required()
      .external(exists("Tournament", "id"))
      .messages({
        "any.required": "Tournament ID is required",
        "number.base": "Tournament ID must be a valid number",
      }),
  }),
};

const createTeamValidateSchema = {
  body: Joi.object().keys({
    key: Joi.string().required().external(unique("Team", "key")).messages({
      "any.required": "Team key is required",
      "string.external": "Team key must be unique",
    }),
    name: Joi.string().required().messages({
      "any.required": "Team name is required",
      "string.empty": "Team name cannot be empty",
    }),
    sports_key: Joi.string()
      .required()
      .external(exists("Sport", "key"))
      .messages({
        "any.required": "Sport key is required",
        "string.external": "Sport key does not exist",
      }),
    country_key: Joi.string()
      .required()
      .external(exists("Country", "key"))
      .messages({
        "any.required": "Country key is required",
        "string.external": "Country key does not exist",
      }),
  }),
};

const updateTeamValidateSchema = {
  params: Joi.object().keys({
    team_id: Joi.number()
      .integer()
      .required()
      .external(exists("Team", "id"))
      .messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a valid number",
      }),
  }),
  body: Joi.object().keys({
    key: Joi.string().optional().messages({
      "string.external": "Team key must be unique",
    }),
    name: Joi.string().optional().messages({
      "string.empty": "Team name cannot be empty",
    }),
    sports_key: Joi.string()
      .optional()
      .external(exists("Sport", "key"))
      .messages({
        "string.external": "Sport key does not exist",
      }),
    country_key: Joi.string()
      .optional()
      .external(exists("Country", "key"))
      .messages({
        "string.external": "Country key does not exist",
      }),
  }),
};

const getTeamValidateSchema = {
  params: Joi.object().keys({
    team_id: Joi.number()
      .integer()
      .required()
      .external(exists("Team", "id"))
      .messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a valid number",
      }),
  }),
};

const deleteTeamValidateSchema = {
  params: Joi.object().keys({
    team_id: Joi.number()
      .integer()
      .required()
      .external(exists("Team", "id"))
      .messages({
        "any.required": "Team ID is required",
        "number.base": "Team ID must be a valid number",
      }),
  }),
};

const createMatchValidateSchema = {
  body: Joi.object().keys({
    key: Joi.string().required().external(unique("Match", "key")).messages({
      "any.required": "Match key is required",
      "string.external": "Match key must be unique",
    }),
    match_start_date: Joi.date().iso().required().messages({
      "any.required": "Match start date is required",
      "date.base": "Match start date must be a valid date",
      "date.iso": "Match start date must be in ISO format",
    }),
    match_start_time: Joi.string().required().messages({
      "any.required": "Match start time is required",
      "string.empty": "Match start time cannot be empty",
    }),
    tournament_key: Joi.string()
      .required()
      .external(exists("Tournament", "key"))
      .messages({
        "any.required": "Tournament key is required",
        "string.external": "Tournament key does not exist",
      }),

    local_team_key: Joi.string()
      .required()
      .external(exists("Team", "key"))
      .messages({
        "any.required": "Local team key is required",
        "string.external": "Local team key does not exist",
      }),
    visit_team_key: Joi.string()
      .required()
      .external(exists("Team", "key"))
      .messages({
        "any.required": "Visit team key is required",
        "string.external": "Visit team key does not exist",
      }),
  }),
};

const updateMatchValidateSchema = {
  params: Joi.object().keys({
    match_id: Joi.number()
      .integer()
      .required()
      .external(exists("Match", "id"))
      .messages({
        "any.required": "Match ID is required",
        "number.base": "Match ID must be a valid number",
      }),
  }),
  body: Joi.object().keys({
    key: Joi.string().optional().messages({
      "string.external": "Match key must be unique",
    }),
    match_start_date: Joi.date().iso().optional().messages({
      "date.base": "Match start date must be a valid date",
      "date.iso": "Match start date must be in ISO format",
    }),
    match_start_time: Joi.string().optional().messages({
      "string.empty": "Match start time cannot be empty",
    }),
    tournament_key: Joi.string()
      .optional()
      .external(exists("Tournament", "key"))
      .messages({
        "string.external": "Tournament key does not exist",
      }),
    local_team_key: Joi.string()
      .optional()
      .external(exists("Team", "key"))
      .messages({
        "string.external": "Local team key does not exist",
      }),
    visit_team_key: Joi.string()
      .optional()
      .external(exists("Team", "key"))
      .messages({
        "string.external": "Visit team key does not exist",
      }),
    local_team_points: Joi.number().integer().optional().messages({
      "number.base": "Local team points must be a valid number",
    }),
    visit_team_points: Joi.number().integer().optional().messages({
      "number.base": "Visit team points must be a valid number",
    }),
    status: Joi.boolean().optional().messages({
      "boolean.base": "Status must be a boolean",
    }),
  }),
};

const getMatchValidateSchema = {
  params: Joi.object().keys({
    match_id: Joi.number()
      .integer()
      .required()
      .external(exists("Match", "id"))
      .messages({
        "any.required": "Match ID is required",
        "number.base": "Match ID must be a valid number",
      }),
  }),
};

const deleteMatchValidateSchema = {
  params: Joi.object().keys({
    match_id: Joi.number()
      .integer()
      .required()
      .external(exists("Match", "id"))
      .messages({
        "any.required": "Match ID is required",
        "number.base": "Match ID must be a valid number",
      }),
  }),
};

module.exports = {
  createLeagueValidateSchema,
  updateLeagueValidateSchema,
  getLeagueValidateSchema,
  createTournamentValidateSchema,
  updateTournamentValidateSchema,
  getTournamentValidateSchema,
  createTeamValidateSchema,
  updateTeamValidateSchema,
  getTeamValidateSchema,
  createMatchValidateSchema,
  updateMatchValidateSchema,
  getMatchValidateSchema,
  deleteLeagueValidateSchema,
  deleteTournamentValidateSchema,
  deleteTeamValidateSchema,
  deleteMatchValidateSchema,
};
