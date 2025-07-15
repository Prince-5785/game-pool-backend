const {
  Distributer,
  sequelize,
  PoolCancellationRequest,
  Pool,
  Team,
  Prediction,
  PredictionDistributor,
  UserPurchasedPool,
  DigitalProduct,
  ConditionalDistributorPool,
  DigitalProductPool,
  ProductCategory,
  PredictionPool,
  Match,
  PoolMatch,
  Dmquiniela,
  PoolPrizeCondition,
  UserPoolMatch,
  PoolView,
  DistributerSalePool,
} = require("../models");
const { status: httpStatus } = require("http-status");
const { sendSuccess, sendError } = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const logger = require("../config/logger");
const { sendEmail } = require("../utils/mailer");
const { generatePassword } = require("../utils/genratePassword");
const { Op, fn, col, where: whereClause, where } = require("sequelize");
const { raw } = require("express");

exports.createDistributor = catchAsync(async (req, res) => {
  const { transaction } = req;

  const { name, rfc, phone, email, ...otherFields } = req.body;

  const password = generatePassword();

  const distributor = await Distributer.create(
    {
      name,
      rfc,
      phone,
      email,
      password, // Hashing should be done in model hook
      ...otherFields,
    },
    { transaction }
  );
  // 3️⃣ Send the welcome email
  const subject = "Welcome to Game Pool – Your Distributor Account Created!";
  const body = `
    Hello,

    Great news! Your new Distributor account has been set up successfully. Here are your login details:

      • Email: ${email}
      • Temporary Password: ${password}

    You can log in here: https://your.app.login.url

    For security, please change your password after your first login.

    If you have any questions, just reply to this email—we’re here to help!

    Cheers,
    The Game Pool Team
  `;
  await sendEmail(email, subject, body);

  return sendSuccess(
    res,
    "Distributor created successfully",
    httpStatus.CREATED,
    distributor
  );
});

exports.updateDistributor = catchAsync(async (req, res) => {
  const { distributor_id } = req.params;
  const transaction = req.transaction;
  const distributor = await Distributer.findByPk(distributor_id, {
    transaction,
  });

  if( key && key !== distributor.key) {
    const existingDistributor = await Distributer.findOne({
      where: { key: req.body.key , id : { [Op.ne]: distributor_id } },
      transaction,
    });
    if (existingDistributor) {
      return sendError(
        res,
        "Distributor with this key already exists",
        httpStatus.BAD_REQUEST
      );
    }
  }

  if (!distributor) {
    return sendError(res, httpStatus.NOT_FOUND, "Distributor not found");
  }

  await distributor.update(req.body, { transaction });
  return sendSuccess(
    res,
    "Distributor updated successfully",
    httpStatus.OK,
    distributor
  );
});

exports.getDistributors = catchAsync(async (req, res) => {
  const {
    page = 1,
    per_page = 10,
    filter_by_state,
    filter_by_country,
    filter_by_locality,
    state,
    country,
    locality,
    status,
  } = req.query;

  const pageInt = parseInt(page, 10);
  const perPage = parseInt(per_page, 10);
  const offset = (pageInt - 1) * perPage;

  const where = [];

  function ciLike(field, value) {
    return whereClause(fn("LOWER", col(field)), {
      [Op.like]: `%${value.trim().toLowerCase()}%`,
    });
  }

  const stateFilter = filter_by_state || state;
  const countryFilter = filter_by_country || country;
  const localityFilter = filter_by_locality || locality;
  const statusFilter = status;

  if (stateFilter?.trim()) where.push(ciLike("state", stateFilter));
  if (countryFilter?.trim()) where.push(ciLike("country", countryFilter));
  if (localityFilter?.trim()) where.push(ciLike("locality", localityFilter));

  if (typeof statusFilter !== "undefined") {
    if (statusFilter === 1) {
      where.push({ status: true });
    } else if (statusFilter === 0) {
      where.push({ status: false });
    }
  }

  const whereCondition = where.length ? { [Op.and]: where } : {};

  const { count, rows } = await Distributer.findAndCountAll({
    where: whereCondition,
    per_page: perPage,
    offset,
  });

  // 5. Return paginated, filtered result
  return sendSuccess(res, "Distributor list", httpStatus.OK, {
    total: count,
    distributors: rows,
    pagination: {
      currentPage: pageInt,
      totalPages: Math.ceil(count / perPage),
      pageSize: perPage,
    },
  });
});

exports.getDistributorById = catchAsync(async (req, res) => {
  const { distributor_id } = req.params;
  const distributor = await Distributer.findByPk(distributor_id);

  if (!distributor)
    return sendError(res, "Distributor not found", httpStatus.NOT_FOUND);

  return sendSuccess(
    res,
    "Distributor fetched successfully",
    httpStatus.OK,
    distributor
  );
});

exports.deleteDistributor = catchAsync(async (req, res) => {
  const { transaction } = req;
  const { distributor_id } = req.params;
  const distributor = await Distributer.findByPk(distributor_id, {
    transaction,
  });

  if (!distributor) {
    return sendError(res, "Distributor not found", httpStatus.NOT_FOUND);
  }

  // Delete all related ConditionalDistributorPool rows first
  await ConditionalDistributorPool.destroy({
    where: { distributor_id },
    transaction,
  });

  await distributor.destroy({ transaction });
  return sendSuccess(res, "Distributor deleted successfully", httpStatus.OK);
});

exports.listNotAllowedDistributors = catchAsync(async (req, res) => {
  const distributors = await Distributer.findAll({
    //Basically, we are fetching distributors who are active in nature but not allowed to access the pool
    where: {
      status: true, // Assuming 'true' means allowed
      allow_status: false, // Assuming 'false' means not allowed
    },
  });

  if (!distributors || distributors.length === 0) {
    return sendSuccess(res, "No distributors found.,", httpStatus.OK);
  }

  return sendSuccess(
    res,
    "Not allowed distributors fetched successfully",
    httpStatus.OK,
    distributors
  );
});

exports.update_status = catchAsync(async (req, res) => {
  const { distributerId } = req.params;
  const { allow_status } = req.body;

  const distributor = await Distributer.findByPk(distributerId, {
    transaction: req.transaction,
  });

  if (distributor.status === false) {
    return sendError(
      res,
      "Cannot update allow status for inactive distributor",
      httpStatus.BAD_REQUEST
    );
  } else if (distributor.allow_status === allow_status) {
    return sendError(
      res,
      "Allow status is already set to the requested value",
      httpStatus.BAD_REQUEST
    );
  }

  distributor.allow_status = Boolean(allow_status);
  await distributor.save({ transaction: req.transaction });

  return sendSuccess(
    res,
    "Distributor allow status updated successfully",
    httpStatus.OK,
    distributor
  );
});

exports.makePoolPredictions = catchAsync(async (req, res) => {
  const { pool_id, distributer_id } = req.query;
  const { predictions } = req.body;

  // Log incoming request for debugging
  logger.info("makePoolPredictions called", {
    pool_id,
    distributer_id,
    predictions,
  });

  if (!pool_id) {
    return sendError(
      res,
      "pool_id is required in query",
      httpStatus.BAD_REQUEST
    );
  }
  if (!distributer_id) {
    return sendError(
      res,
      "distributer_id is required in query",
      httpStatus.BAD_REQUEST
    );
  }
  if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
    return sendError(
      res,
      "Predictions array is required and cannot be empty",
      httpStatus.BAD_REQUEST
    );
  }

  const transaction = req.transaction;

  // Verify pool exists and distributor can access it
  const pool = await Pool.findByPk(pool_id, { transaction });
  if (!pool) {
    return sendError(res, "Pool not found", httpStatus.NOT_FOUND);
  }

  const distributor = await Distributer.findByPk(distributer_id, {
    transaction,
  });
  if (!distributor) {
    return sendError(res, "Distributor not found", httpStatus.NOT_FOUND);
  }
  if (!distributor.allow_status) {
    return sendError(
      res,
      "Distributor is not allowed to make predictions for this pool",
      httpStatus.FORBIDDEN
    );
  }
  // Check if pool is authorized
  if (pool.status !== 1) {
    return sendError(res, "Pool is not authorized", httpStatus.BAD_REQUEST);
  }

  // Get all pool matches
  const poolMatches = await pool.getMatches({
    attributes: ["id", "match_start_time"],
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
    JoinTableAttributes: ["id", "pool_id", "match_id"],
    transaction,
  });

  // Use actual match IDs for validation
  const poolMatchIds = poolMatches.map((match) => match.id);
  const currentTime = new Date();

  // Verify matches haven't started
  const hasStartedMatches = poolMatches.some(
    (match) => match.match_start_time <= currentTime
  );
  if (hasStartedMatches) {
    return sendError(
      res,
      "Cannot make predictions for matches that have already started",
      httpStatus.BAD_REQUEST
    );
  }

  // Validate prediction options exist
  const PredictionIds = predictions.map((p) => p.PredictionId);
  const validOptions = await Prediction.findAll({
    where: { id: PredictionIds },
    transaction,
  });

  if (validOptions.length !== new Set(PredictionIds).size) {
    return sendError(
      res,
      "Invalid prediction option provided. Some PredictionIds do not exist.",
      httpStatus.BAD_REQUEST
    );
  }

  // Check if predictions already exist for this distributor and pool
  const existingPredictions = await PredictionDistributor.findOne({
    where: {
      distributor_id: distributer_id,
      pool_match_id: poolMatchIds,
    },
  });
  if (existingPredictions) {
    return sendError(
      res,
      "Predictions for this pool and distributor already exist.",
      httpStatus.BAD_REQUEST
    );
  }

  // Create or update predictions
  for (const prediction of predictions) {
    if (!poolMatchIds.includes(prediction.matchId)) {
      return sendError(
        res,
        `Invalid match ID: ${prediction.matchId}. Not found in pool matches.`,
        httpStatus.BAD_REQUEST
      );
    }

    // Find the PoolMatch join table entry for this match
    const poolMatch = poolMatches.find((m) => m.id === prediction.matchId);
    const poolMatchId = poolMatch.PoolMatch.id;

    await PredictionDistributor.upsert(
      {
        distributor_id: distributer_id,
        pool_match_id: poolMatchId,
        prediction_id: prediction.PredictionId,
      },
      { transaction }
    );
  }

  return sendSuccess(res, "Predictions saved successfully", httpStatus.OK, {
    predictions: predictions.map((p) => ({
      matchId: p.matchId,
      PredictionId: p.PredictionId,
    })),
    matches: poolMatches.map((match) => ({
      matchId: match.id,
      local_team: match.local_team.name,
      visit_team: match.visit_team.name,
      matchStartTime: match.match_start_time,
    })),
    predictionValues: validOptions.map((option) => ({
      id: option.id,
      value: option.value,
    })),
    distributor_id: distributer_id,
    poolId: pool_id,
  });
});

exports.getPoolPredictions = catchAsync(async (req, res) => {
  const { pool_id, distributer_id } = req.query;

  // Verify pool exists
  const pool = await Pool.findByPk(pool_id);
  if (!pool) {
    return sendError(res, "Pool not found", httpStatus.NOT_FOUND);
  }

  // Get all matches with their predictions
  const poolMatches = await pool.getMatches({
    attributes: ["id", "local_team_key", "visit_team_key", "match_start_time"],
    include: [
      {
        model: Team,
        as: "local_team",
        attributes: ["name"],
      },
      {
        model: Team,
        as: "visit_team",
        attributes: ["name"],
      },
    ],
    JoinTableAttributes: ["id"],
  });

  // Get predictions for these matches
  const predictions = await PredictionDistributor.findAll({
    where: {
      distributor_id: distributer_id,
      pool_match_id: poolMatches.map((match) => match.PoolMatch.id),
    },
    include: [
      {
        model: Prediction,
        as: "prediction",
        attributes: ["value"],
      },
    ],
  });

  // Format response: match predictions by join table ID and use correct property for value
  const formattedMatches = poolMatches.map((match) => {
    const poolMatchId = match.PoolMatch.id;
    const pred = predictions.find((p) => p.pool_match_id === poolMatchId);
    return {
      matchId: match.id,
      local_team: match.local_team.name,
      visit_team: match.visit_team.name,
      matchStartTime: match.match_start_time,
      prediction: pred ? pred.prediction?.value : null,
    };
  });

  return sendSuccess(
    res,
    "Pool predictions retrieved successfully",
    httpStatus.OK,
    formattedMatches
  );
});

exports.poolSales = catchAsync(async (req, res) => {
  const { distributor_id } = req.params;
  // Verify distributor exists
  const distributor = await Distributer.findOne({
    where: {
      id: distributor_id,
    },
  });
  if (!distributor) {
    return sendError(res, "Distributor not found", httpStatus.NOT_FOUND);
  }

  const pool_sales = await DistributerSalePool.findAll({
    include: [
      {
        model: Pool,
        as: "pool",
        include: [
          {
            model: Dmquiniela,
            as: "dmquiniela",
          }
        ],
      }
    ],
    where: {
      distributor_id
    }
  });

  if (!pool_sales || pool_sales.length === 0) {
    return sendSuccess(res, "No sales found for the pool", httpStatus.OK);
  }


  return sendSuccess(
    res,
    "Pool sales retrieved successfully",
    httpStatus.OK,
    pool_sales
  );
});

exports.poolSalesFiltered = catchAsync(async (req, res) => {
  const { distributor_id } = req.params;

  const distributor = await Distributer.findOne({
    where: {
      id: distributor_id,
      status: true, // Only active distributors
    },
  });

  if (!distributor) {
    return sendError(res, "Distributor not found", httpStatus.NOT_FOUND);
  }

  const { start_date, end_date } = req.query;
  const whereCondition = {};

  if (start_date) {
    whereCondition.purchase_date = {
      [Op.gte]: new Date(start_date),
    };
  }
  if (end_date) {
    whereCondition.purchase_date = {
      ...whereCondition.purchase_date,
      [Op.lte]: new Date(end_date),
    };
  }

  const pool_sales = await UserPurchasedPool.findAll({
    attributes: [
      "pool_id",
      [
        sequelize.fn("COUNT", sequelize.col("UserPurchasedPool.id")),
        "total_sales",
      ],
      [sequelize.fn("SUM", sequelize.col("purchase_amount")), "total_amount"],
    ],
    include: [
      {
        model: Pool,
        as: "pool",
      },
    ],
    where: {
      distributor_id,
      ...whereCondition,
    },
    group: ["pool_id", "pool.id"],
    raw: true,
  });

  if (!pool_sales || pool_sales.length === 0) {
    return sendSuccess(res, "No sales found for the pool", httpStatus.OK);
  }

  const sales_list = pool_sales.map((sale) => ({
    pool_id: sale.pool_id,
    dm_quiniela: sale["pool.dm_quiniela"],
    total_sales: sale.total_sales,
    total_amount: sale.total_amount,
  }));

  return sendSuccess(res, "Pool sales retrieved successfully", httpStatus.OK, {
    start_date,
    end_date,
    sales: sales_list,
  });
});

exports.listDigitalProducts = catchAsync(async (req, res) => {
  const { page = 1, per_page = 10 } = req.query;
  const offset = (page - 1) * per_page;
  const { count, rows } = await DigitalProduct.findAndCountAll({
    attributes: ["key", "name", "unit_price", "status"],
    include: [
      {
        model: ProductCategory,
        as: "category",
        attributes: ["name"],
      },
      {
        model: DigitalProductPool,
        as: "digitalProductPool",
        attributes: ["pool_id"], // Only use actual fields
        include: [
          {
            model: PoolView,
            as: "poolView",
            required: true,
            where: {
              status: 1,
              online: true,
              pool_status: "upcoming", // Assuming you want only upcoming pools
              pool_sales_status: "active", // Only active pools
            },
          },
        ],
      },
    ],
    limit: parseInt(per_page, 10),
    offset: parseInt(offset, 10),
  });
  const totalPages = Math.ceil(count / per_page);
  return sendSuccess(
    res,
    "Digital products retrieved successfully",
    httpStatus.OK,
    {
      total: count,
      totalPages,
      currentPage: parseInt(page, 10),
      per_page: parseInt(per_page, 10),
      digitalProducts: rows,
    }
  );
});
