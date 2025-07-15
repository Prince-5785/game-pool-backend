//pool.controller
const {
  Pool,
  Team,
  Match,
  PoolMatch,
  sequelize,
  Distributer,
  PredictionDistributor,
  PoolPrizeCondition,
  DigitalProduct,
  DigitalProductPool,
  Tournament,
  DistributerSalePool,
  DistributerPrediction,
  PoolMatchPrediction,
  PoolMatchPredictionDistributor,
  Prediction,
  Dmquiniela,
  ConditionalDistributorPool,
  UserPoolPurchased,
  UserPoolMatch,
} = require("../models");

const logger = require("../config/logger");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/ApiResponse");
const { status: httpStatus } = require("http-status");
const { Op, fn, col, or, where } = require("sequelize");
const attributes = require("../config/attributes");
const { raw } = require("express");

exports.createPool = catchAsync(async (req, res) => {
  const {
    key,
    start_sale_date,
    start_sale_time,
    dmquiniela_id,
    total_doubles,
    total_triples,
    status,
    view,
    conditional_distributor_ids,
    ecommerce_expiry,
    online,
    type,
    matchesWithPredictions,
  } = req.body;

  // Validate dmquiniela_id and fetch the Dmquiniela record
  const dm_quiniela = await Dmquiniela.findOne({
    where: { id: dmquiniela_id , status: 1 },
    transaction: req.transaction,
  });

  if (!dm_quiniela) {
    return sendError(
      res,
      `Dmquiniela with ID ${dmquiniela_id} not found or is inactive`,
      httpStatus.NOT_FOUND
    );
  }

  // Make sure total_matches exists on dm_quiniela
  if (
    dm_quiniela.total_matches === undefined ||
    dm_quiniela.total_matches === null
  ) {
    return sendError(
      res,
      `Dmquiniela with ID ${dmquiniela_id} has invalid total_matches`,
      httpStatus.BAD_REQUEST
    );
  }

  if (dm_quiniela.status !== 1) {
    return sendError(
      res,
      `Dmquiniela with ID ${dmquiniela_id} is not authorised`,
      httpStatus.BAD_REQUEST
    );
  }

  if (view === 1 && conditional_distributor_ids.length > 0) {
    const unauthorised_conditional_distributors = await Distributer.findAll({
      where: {
        id: {
          [Op.in]: conditional_distributor_ids,
        },
        status: 0 || 2,
      },
      transaction: req.transaction,
    });

    if (
      unauthorised_conditional_distributors &&
      unauthorised_conditional_distributors.length > 0
    ) {
      return sendError(
        res,
        `Some conditional distributors are not authorised: ${unauthorised_conditional_distributors
          .map((d) => d.name)
          .join(", ")}`,
        httpStatus.BAD_REQUEST
      );
    }
  }

  let matchesWithPredictionsId = [];

  // Validate matchesWithPredictions array
  if (
    !matchesWithPredictions ||
    !Array.isArray(matchesWithPredictions) ||
    matchesWithPredictions.length === 0
  ) {
    return sendError(
      res,
      "matchesWithPredictions array is required and must not be empty",
      httpStatus.BAD_REQUEST
    );
  }

  const matches = matchesWithPredictions.map((match) => ({
    match_id: match.match_id,
  }));

  if (type === 0) {
    const predictions_value = matchesWithPredictions.map((match) => ({
      prediction_value: match.prediction_value,
    }));

    const predictions = await Prediction.findAll({
      where: {
        value: {
          [Op.in]: predictions_value.map((p) => p.prediction_value),
        },
      },
      attributes: ["id", "value"],
      transaction: req.transaction,
    });

    // Create a map of prediction values to IDs (using the first occurrence of each value)
    const predictionValueToId = {};
    predictions.forEach((p) => {
      if (!predictionValueToId[p.value]) {
        predictionValueToId[p.value] = p.id;
      }
    });

    // Check if every prediction value has a corresponding ID
    const uniquePredictionValues = [
      ...new Set(predictions_value.map((p) => p.prediction_value)),
    ];
    if (uniquePredictionValues.some((value) => !predictionValueToId[value])) {
      return sendError(
        res,
        "All matches must have a corresponding prediction.",
        httpStatus.BAD_REQUEST
      );
    }

    matchesWithPredictionsId = matchesWithPredictions.map((match) => ({
      match_id: match.match_id,
      prediction_id: predictionValueToId[match.prediction_value],
    }));

    if (matchesWithPredictionsId.some((m) => !m.prediction_id)) {
      return sendError(
        res,
        "All matches must have a corresponding prediction.",
        httpStatus.BAD_REQUEST
      );
    }
  }

  // Check that the number of matches matches the required count from Dmquiniela
  if (matches.length !== dm_quiniela.total_matches) {
    return sendError(
      res,
      `The number of matches provided (${matches.length}) does not match the required count (${dm_quiniela.total_matches}).`,
      httpStatus.BAD_REQUEST
    );
  }

  const matchIds = matches.map((match) => match.match_id);

  const existingMatches = await Match.findAll({
    where: {
      id: {
        [Op.in]: matchIds,
      },
    },
    order: [["match_start_date", "ASC"]],
    order: [["match_start_time", "ASC"]],
    transaction: req.transaction,
  });

  if (existingMatches.length !== matches.length) {
    return sendError(
      res,
      "Some matches do not exist. Please check the match IDs.",
      httpStatus.BAD_REQUEST
    );
  }

  const checkUpcomingMatches = existingMatches.filter((match) => {
    if (new Date(match.match_start_time) < new Date()) {
      return sendError(
        res,
        "Ongoing or past matches cannot be included in a pool.",
        httpStatus.BAD_REQUEST
      );
    }
  });

  // Allow empty conditional_distributor_ids array when view is 1 (Conditional)
  if (
    view === 1 &&
    (!conditional_distributor_ids ||
      !Array.isArray(conditional_distributor_ids))
  ) {
    return sendError(
      res,
      "Conditional pools require a valid conditional_distributor_ids array (can be empty).",
      httpStatus.BAD_REQUEST
    );
  }

  // Fix: get both date and time from the first match if available
  const firstMatch = existingMatches[0];
  const firstMatchStartDate = new Date(firstMatch.match_start_date);
  const firstMatchStartTime = new Date(
    `1970-01-01T${firstMatch.match_start_time}`
  ); // Parse time as a Date object

  if (
    isNaN(firstMatchStartDate.getTime()) ||
    isNaN(firstMatchStartTime.getTime())
  ) {
    throw new Error("Invalid date or time for the first match.");
  }

  const first_match_start_date = new Date(
    firstMatchStartDate.getFullYear(),
    firstMatchStartDate.getMonth(),
    firstMatchStartDate.getDate(),
    firstMatchStartTime.getHours(),
    firstMatchStartTime.getMinutes(),
    firstMatchStartTime.getSeconds()
  );
  const lastIndex = existingMatches.length - 1;
  const lastMatchStartDate = new Date(
    existingMatches[lastIndex].match_start_date
  );
  const lastMatchStartTime = new Date(
    `1970-01-01T${existingMatches[lastIndex].match_start_time}`
  ); // Parse time as a Date object

  if (
    isNaN(lastMatchStartDate.getTime()) ||
    isNaN(lastMatchStartTime.getTime())
  ) {
    throw new Error("Invalid date or time for the last match.");
  }

  const last_match_start_date = new Date(
    lastMatchStartDate.getFullYear(),
    lastMatchStartDate.getMonth(),
    lastMatchStartDate.getDate(),
    lastMatchStartTime.getHours(),
    lastMatchStartTime.getMinutes(),
    lastMatchStartTime.getSeconds()
  );

  const end_sale_date = new Date(first_match_start_date); // Clone the date object
  end_sale_date.setUTCHours(end_sale_date.getUTCHours() - ecommerce_expiry); // Subtract hours directly in UTC

  const pool = await Pool.create(
    {
      key,
      start_sale_date,
      start_sale_time,
      dmquiniela_id,
      total_doubles,
      total_triples,
      status,
      view,
      ecommerce_expiry,
      online,
      type,
      first_match_start_date,
      last_match_start_date,
      end_sale_date,
    },
    {
      transaction: req.transaction,
    }
  );
  if (type === 1) {
    // For type 1,
    const poolMatchData = existingMatches.map((match) => ({
      pool_id: pool.id,
      match_id: match.id,
      prediction_id: null,
    }));
    await PoolMatch.bulkCreate(poolMatchData, { transaction: req.transaction });
  } else if (type === 0) {
    // Only allow predictions if type === 0, and require prediction_id for each match
    const matchIdsWithPredictionsIds = matchesWithPredictionsId.map(
      (match) => ({
        match_id: match.match_id,
        prediction_id: match.prediction_id,
      })
    );
    // Create PoolMatch records with prediction_id
    const poolMatchData = existingMatches.map((match) => {
      const matchWithPredictions = matchIdsWithPredictionsIds.find(
        (m) => m.match_id === match.id
      );
      return {
        pool_id: pool.id,
        match_id: match.id,
        prediction_id: matchWithPredictions
          ? matchWithPredictions.prediction_id
          : null,
      };
    });
    // Ensure every match has a prediction_id
    if (poolMatchData.some((m) => !m.prediction_id)) {
      return sendError(
        res,
        "Predictions are required for all matches in type 0 pools.",
        httpStatus.BAD_REQUEST
      );
    }
    await PoolMatch.bulkCreate(poolMatchData, { transaction: req.transaction });
  } else {
    // If type is not 0 or 1, do not allow predictions
    return sendError(
      res,
      "Invalid pool type. Only 0 (defined) and 1 (free) are allowed.",
      httpStatus.BAD_REQUEST
    );
  }

  // Handle conditional distributors for conditional pools (view = 1)
  if (
    pool.view === 1 &&
    conditional_distributor_ids &&
    Array.isArray(conditional_distributor_ids)
  ) {
    // Only create conditional distributor entries if there are IDs in the array
    if (conditional_distributor_ids.length > 0) {
      const conditionalDistributers = conditional_distributor_ids.map((id) => ({
        pool_id: pool.id,
        distributor_id: id,
      }));
      await ConditionalDistributorPool.bulkCreate(conditionalDistributers, {
        transaction: req.transaction,
      });
    }
    // If array is empty, we don't need to create any entries
  }

  sendSuccess(res, "Pool created successfully", httpStatus.OK, {
    pool,
    matchesWithPredictions: await PoolMatch.findAll({
      where: { pool_id: pool.id },
      include: [
        { model: Match, as: "match", attributes: ["id", "local_team_key", "visit_team_key", "match_start_time"] },
        { model: Prediction, as: "prediction", attributes: ["id", "value"] },
      ],
      transaction: req.transaction,
    }),
    matches: existingMatches.map((match) => ({
      id: match.id,
      local_team_key: match.local_team_key,
      visit_team_key: match.visit_team_key,
      match_start_time: match.match_start_time,
    })),
    conditionalDistributers: await ConditionalDistributorPool.findAll({
      where: { pool_id: pool.id },
      include: [
        { model: Distributer, as: "distributor", attributes: ["id", "name"] },
      ],
      transaction: req.transaction,
    }),
  });
});

exports.updatePool = catchAsync(async (req, res) => {
  const { pool_id } = req.params;
  const {
    key,
    start_sale_date,
    start_sale_time,
    dmquiniela_id,
    total_doubles,
    total_triples,
    status,
    view,
    conditional_distributor_ids,
    ecommerce_expiry,
    online,
    type,
    matchesWithPredictions,
  } = req.body;
  const transaction = req.transaction;

  const pool = await Pool.findByPk(pool_id, { transaction });
  if (!pool) {
    return sendError(res, "Pool not found", httpStatus.NOT_FOUND);
  }

  if( key && key !== pool.key ) {
    const existingPool = await Pool.findOne({
      where: {
        key,
        id: { [Op.ne]: pool_id }, // Exclude current pool
      },
      transaction,
    });
    if (existingPool) {
      return sendError(
        res,
        "Pool with this key already exists",
        httpStatus.CONFLICT
      );
    }
  }

  if (type) {
    if (type !== pool.type ) {
      await PoolMatch.destroy({
        where: { pool_id: pool.id },
        transaction,
      });
    }
  }

  // Validate matches if provided
  if (matchesWithPredictions && matchesWithPredictions.length > 0) {
    const matches = matchesWithPredictions.map((match) => ({
      match_id: match.match_id,
      prediction_value: match.prediction_value,
    }));

    if (matches && matches.length > 0) {
      const matchIds = matches.map((match) => match.match_id);
      const existingMatches = await Match.findAll({
        where: {
          id: {
            [Op.in]: matchIds,
          },
        },
        transaction,
        order: [["match_start_date", "ASC"]],
      });

      if (existingMatches.length !== matches.length) {
        return sendError(
          res,
          "Some matches do not exist. Please check the match IDs.",
          httpStatus.BAD_REQUEST
        );
      }

      for (const match of existingMatches) {
        if (new Date(match.match_start_time) < new Date()) {
          return sendError(
            res,
            "Ongoing or past matches cannot be included in a pool.",
            httpStatus.BAD_REQUEST
          );
        }
      }

      // Delete existing pool match relationships
      await PoolMatch.destroy({
        where: { pool_id: pool.id },
        transaction,
      });

      if ((type && type === 0) || (!type && pool.type === 0)) {
        // For type 1, require prediction_value and match it with prediction_id
        const poolMatchData = await Promise.all(
          existingMatches.map(async (match) => {
            const matchFromReq = matches.find((m) => m.match_id === match.id);
            const prediction = await Prediction.findOne({
              where: { value: matchFromReq.prediction_value },
              attributes: ["id"],
              transaction,
            });

            if (!prediction) {
              throw new Error(
                `Prediction with value ${matchFromReq.prediction_value} not found`
              );
            }

            return {
              pool_id: pool.id,
              match_id: match.id,
              prediction_id: prediction.id,
            };
          })
        );

        await PoolMatch.bulkCreate(poolMatchData, { transaction });
      } else if ((type && type === 1) || (!type && pool.type === 1)) {
        // For type 0, only accept match_id
        const poolMatchData = existingMatches.map((match) => ({
          pool_id: pool.id,
          match_id: match.id,
          prediction_id: null,
        }));

        await PoolMatch.bulkCreate(poolMatchData, { transaction });
      } else {
        return sendError(
          res,
          "Invalid pool type. Only 0 (defined) and 1 (free) are allowed.",
          httpStatus.BAD_REQUEST
        );
      }

      const firstMatch = existingMatches[0];
      const firstMatchStartDate = new Date(firstMatch.match_start_date);
      const firstMatchStartTime = new Date(
        `1970-01-01T${firstMatch.match_start_time}`
      ); // Parse time as a Date object

      if (
        isNaN(firstMatchStartDate.getTime()) ||
        isNaN(firstMatchStartTime.getTime())
      ) {
        throw new Error("Invalid date or time for the first match.");
      }

      const first_match_start_date = new Date(
        firstMatchStartDate.getFullYear(),
        firstMatchStartDate.getMonth(),
        firstMatchStartDate.getDate(),
        firstMatchStartTime.getHours(),
        firstMatchStartTime.getMinutes(),
        firstMatchStartTime.getSeconds()
      );
      const lastIndex = existingMatches.length - 1;
      const lastMatchStartDate = new Date(
        existingMatches[lastIndex].match_start_date
      );
      const lastMatchStartTime = new Date(
        `1970-01-01T${existingMatches[lastIndex].match_start_time}`
      ); // Parse time as a Date object

      if (
        isNaN(lastMatchStartDate.getTime()) ||
        isNaN(lastMatchStartTime.getTime())
      ) {
        throw new Error("Invalid date or time for the last match.");
      }

      const last_match_start_date = new Date(
        lastMatchStartDate.getFullYear(),
        lastMatchStartDate.getMonth(),
        lastMatchStartDate.getDate(),
        lastMatchStartTime.getHours(),
        lastMatchStartTime.getMinutes(),
        lastMatchStartTime.getSeconds()
      );

      const end_sale_date = new Date(first_match_start_date); // Clone the date object
      end_sale_date.setUTCHours(end_sale_date.getUTCHours() - ecommerce_expiry); // Subtract hours directly in UTC

      await pool.update(
        {
          first_match_start_date,
          last_match_start_date,
          end_sale_date,
        },
        { transaction }
      );
    }
  }

  // If dmquiniela_id is provided, verify it exists
  if (dmquiniela_id) {
    const dm_quiniela = await Dmquiniela.findByPk(dmquiniela_id, {
      transaction,
    });
    if (dm_quiniela && dm_quiniela.status !== 1) {
      return sendError(
        res,
        `Dmquiniela with ID ${dmquiniela_id} is not authorised`,
        httpStatus.BAD_REQUEST
      );
    }
    if (!dm_quiniela) {
      return sendError(
        res,
        `Dmquiniela with ID ${dmquiniela_id} not found`,
        httpStatus.NOT_FOUND
      );
    }
  }

  if (view === 0) {
    if (conditional_distributor_ids.length > 0) {
      return sendError(
        res,
        "Conditional distributors are not allowed for General view pools.",
        httpStatus.BAD_REQUEST
      );
    }
  }

  await pool.update(
    {
      key,
      start_sale_date,
      start_sale_time,
      dmquiniela_id,
      total_doubles,
      total_triples,
      status,
      view,
      ecommerce_expiry,
      online,
      type,
    },
    { transaction }
  );

  if (pool.view === 0) {
    await ConditionalDistributorPool.destroy({
      where: { pool_id: pool.id },
      transaction,
    });
  }

  if (
    pool.view === 1 &&
    conditional_distributor_ids &&
    Array.isArray(conditional_distributor_ids)
  ) {
    await ConditionalDistributorPool.destroy({
      where: { pool_id: pool.id },
      transaction: req.transaction,
    });



    if (conditional_distributor_ids.length > 0) {
      const conditionalDistributers = conditional_distributor_ids.map((id) => ({
        pool_id: pool.id,
        distributor_id: id,
      }));

      await ConditionalDistributorPool.bulkCreate(conditionalDistributers, {
        transaction: req.transaction,
      });
    }
    else if (conditional_distributor_ids.length === 0) {
      // If the array is empty, we don't need to create any entries
      return sendError(
        res,
        "Conditional distributors array is empty. No entries created.",
        httpStatus.BAD_REQUEST
      );
    }
  }

  return sendSuccess(res, "Pool updated successfully", httpStatus.OK, {
    pool,
    poolMatches: await PoolMatch.findAll({
      where: { pool_id: pool.id },
      attributes: ["id", "match_id", "prediction_id"],
      include: [
        {
          model: Match,
          as: "match",
          attributes: [
            "id",
            "local_team_key",
            "visit_team_key",
            "match_start_time",
          ],
          include: [
            {
              model: Team,
              as: "local_team",
              attributes: ["id", "name"],
            },
            {
              model: Team,
              as: "visit_team",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Prediction,
          as: "prediction",
          attributes: ["id", "value"],
        },
      ],
      transaction: req.transaction,
    }),
    conditional_distributor_ids: await ConditionalDistributorPool.findAll({
      where: { pool_id: pool.id },
      include: [
        { model: Distributer, as: "distributor", attributes: ["id", "name"] },
      ],
      transaction: req.transaction,
    }),
  });
});

exports.getPoolById = catchAsync(
  async (req, res) => {
    const { pool_id } = req.params;
    const pool = await Pool.findByPk(pool_id);

    if (!pool) return sendError(res, "Pool not found", httpStatus.NOT_FOUND);

    const matchesWithPredictions = await PoolMatch.findAll({
      where: { pool_id },
      attributes: ["id", "match_id", "prediction_id"],
      include: [
        {
          model: Match,
          as: "match",
          attributes: [
            "id",
            "local_team_key",
            "visit_team_key",
            "match_start_time",
          ],
          include: [
            {
              model: Team,
              as: "local_team",
              attributes: ["id", "name"],
            },
            {
              model: Team,
              as: "visit_team",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Prediction,
          as: "prediction",
          attributes: ["id", "value"],
        },
      ],
    });

    return sendSuccess(res, "Pool fetched successfully", httpStatus.OK, {
      pool,
      matches: matchesWithPredictions,
      conditional_distributors: await ConditionalDistributorPool.findAll({
        where: { pool_id },
        include: [
          { model: Distributer, as: "distributor", attributes: ["id", "name"] },
        ],
      }),
      dmquiniela: await Dmquiniela.findByPk(pool.dmquiniela_id, {
        attributes: ["id", "name", "total_matches", "status"],
      }),
      poolMatches: await PoolMatch.findAll({
        where: { pool_id },
        attributes: ["id", "match_id", "prediction_id"],
        include: [
          {
            model: Match,
            as: "match",
            attributes: [
              "id",
              "local_team_key",
              "visit_team_key",
              "match_start_time",
            ],
            include: [
              {
                model: Team,
                as: "local_team",
                attributes: ["id", "name"],
              },
              {
                model: Team,
                as: "visit_team",
                attributes: ["id", "name"],
              },
            ],
          },
          {
            model: Prediction,
            as: "prediction",
            attributes: ["id", "value"],
          },
        ],
      })
    });
  },
  { useTransaction: false }
);

exports.getPool = catchAsync(
  async (req, res) => {
    const { page = 1, per_page = 10, status } = req.query;

    const pageInt = parseInt(page, 10);
    const perPage = parseInt(per_page, 10);
    const offset = (pageInt - 1) * perPage;

    const where = [];

    function ciLike(field, value) {
      return whereClause(fn("LOWER", col(field)), {
        [Op.like]: `%${value.trim().toLowerCase()}%`,
      });
    }

    const statusFilter = status;

    if (typeof statusFilter !== "undefined") {
      const validStatuses = [0, 1, 2]; // 0 = Pending, 1 = Authorized, 2 = Rejected

      if (validStatuses.includes(statusFilter)) {
        where.push({
          status: statusFilter,
        });
      }
    }

    const whereCondition = where.length ? { [Op.and]: where } : {};

    const { count, rows } = await Pool.findAndCountAll({
      where: whereCondition,
      limit: perPage,
      offset,
      include: [
        {
          model: PoolMatch,
          as: "poolMatches",
          attributes: [
            ["id", "pool_match_id"],
            "pool_id",
            "match_id",
            "prediction_id",
          ], // Only columns from pool_match table
          include: [
            {
              model: Match,
              as: "match",
              attributes: [["id", "match_id"], "match_start_time"],
              include: [
                {
                  model: Team,
                  as: "local_team",
                  attributes: [["id", "local_team_id"], "name"],
                },
                {
                  model: Team,
                  as: "visit_team",
                  attributes: [["id", "visit_team_id"], "name"],
                },
              ],
            },
            {
              model: Prediction,
              as: "prediction",
              attributes: ["id", "value"],
            },
          ],

          required: false, // This allows pools without matches to be included
        },
        {
          model: ConditionalDistributorPool,
          as: "conditionalDistributorPools",
          attributes: [["id", "conditional_distributor_id"]],
          include: [
            {
              model: Distributer,
              as: "distributor",
              attributes: ["id", "name"],
            },
          ],
          required: false, // This allows pools without conditional distributors to be included
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM pool_match WHERE pool_match.pool_id = Pool.id)"
            ),
            "match_count",
          ],
        ],
      },
      logging: console.log, // prints actual SQL to console
    });

    // 5. Return paginated, filtered result
    return sendSuccess(res, "Pool list", httpStatus.OK, {
      total: count,
      pools: rows,
      pagination: {
        currentPage: pageInt,
        totalPages: Math.ceil(count / perPage),
        pageSize: perPage,
      },
    });
  },
  { useTransaction: false }
);

exports.listPendingMatches = catchAsync(async (req, res) => {
  const matches = await Match.findAll({
    include: [
      {
        model: Team,
        as: "local_team",
        attributes: ["id", "name"],
      },
      {
        model: Team,
        as: "visit_team",
        attributes: ["id", "name"],
      },
    ],
    where: {
      status: 0, // Assuming 0 is the status for pending matches
      match_start_time: {
        [Op.gt]: new Date(), // Only include matches that are in the future
      },
    },
  });
  if (!matches || matches.length === 0) {
    return sendError(res, "No pending matches found", httpStatus.NOT_FOUND);
  }

  return sendSuccess(
    res,
    "Pending matches fetched successfully",
    httpStatus.OK,
    {
      matches,
    }
  );
});

exports.deletePool = catchAsync(async (req, res) => {
  const { pool_id } = req.params;
  const transaction = req.transaction;
  const pool = await Pool.findByPk(pool_id, { transaction });

  if (!pool) {
    return sendError(res, "Pool not found", httpStatus.NOT_FOUND);
  }

  await pool.destroy({ transaction });
  return sendSuccess(res, "Pool deleted successfully", httpStatus.OK);
});

exports.listDistributorPools = catchAsync(
  async (req, res) => {
    const { distributor_id } = req.params;
    const { page = 1, per_page = 10 } = req.query;

    const pageInt = parseInt(page, 10);
    const perPage = parseInt(per_page, 10);
    const offset = (pageInt - 1) * perPage;

    // Get pools purchased by the distributor
    const { count, rows } = await UserPoolPurchased.findAndCountAll({
      where: {
        distributor_id: distributor_id,
        attributes: ["id", "distributor_id"],
      },
      include: [
        {
          model: UserPoolMatch,
          as: "userPoolMatches",
          attributes: ["id", "pool_id", "match_id", "prediction_id"],
          include: [
            {
              model: Pool,
              as: "pool",
              attributes: ["id", "key", "dmquiniela_id"],
              include: [
                {
                  model: Dmquiniela,
                  as: "dmquiniela",
                  attributes: ["id", "name"],
                },
              ],
            },
            {
              model: Match,
              as: "match",
              attributes: [
                "id",
                "local_team_key",
                "visit_team_key",
                "match_start_time",
              ],
              include: [
                {
                  model: Team,
                  as: "local_team",
                  attributes: ["id", "name"],
                },
                {
                  model: Team,
                  as: "visit_team",
                  attributes: ["id", "name"],
                }
              ],
            },
            {
              model: Prediction,
              as: "prediction",
              attributes: ["id", "value"],
            },
          ],
        }, 
      ],
      limit: perPage,
      offset
    });
  
    // 5. Return paginated, filtered result
    if (count === 0) {
      return sendError(res, "No distributor pools found", httpStatus.NOT_FOUND);
    }
    if (rows.length === 0) {
      return sendError(res, "No distributor pools found", httpStatus.NOT_FOUND);
    }

    return sendSuccess(res, "Distributor pools list", httpStatus.OK, {
      total: count,
      pools: rows,
      pagination: {
        currentPage: pageInt,
        totalPages: Math.ceil(count / perPage),
        pageSize: perPage,
      },
    });
  },
  { useTransaction: false }
);

exports.maskSales = catchAsync(async (req, res) => {
  const distributor_sales_pools = await DistributerSalePool.findAll({
    attributes: [
      "id",
      "pool_id",
      "distributor_id",
      "sold_pool_quantity",
      "amount_sold",
      "prize_amount",
    ],
    include: [
      {
        model: Pool,
        as: "pool",
      },
      {
        model: Distributer,
        as: "distributor",
      },
    ],
  });
  if (
      !distributor_sales_pools ||
      distributor_sales_pools.length === 0
  ) {
    return sendError(
      res,
      "No distributor sales pools found",
      httpStatus.NOT_FOUND
    );
  }
  return sendSuccess(
    res,
    "Distributor purchased pools fetched successfully",
    httpStatus.OK,
    {
      distributor_sales_pools,
    }
  );
});





// Get mask sales details by ID  === distributor pool purchase details

exports.maskSalesDetails = catchAsync(
  async (req, res) => {
    const { mask_sales_id } = req.params;

    const maskSales = await DistributerSalePool.findByPk(mask_sales_id, {
      include: [
        {
          model: Pool,
          as: "pool",
          attributes: [
            "id",
            "key",
            "dmquiniela_id",
            "start_sale_date",
            "start_sale_time",
            "total_doubles",
            "total_triples",
            "status",
            "ecommerce_expiry",
            "online",
            "type",
          ],
          include: [
            {
              model: Dmquiniela,
              as: "dmquiniela",
            },
          ],
        },
        {
          model: Distributer,
          as: "distributor",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!maskSales) {
      return sendError(res, "Mask sales not found", httpStatus.NOT_FOUND);
    }

    return sendSuccess(
      res,
      "Mask sales details fetched successfully",
      httpStatus.OK,
      {
        maskSales,
      }
    );
  },
  { useTransaction: false }
);

