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

exports.listDigitalProductsForDistributor = catchAsync(async (req, res) => {
  const { distributor_id } = req.params;
  const { page = 1, per_page = 10 } = req.query;
  const offset = (page - 1) * per_page;

  // First, find all digital products - without requiring pools
  const { count, rows } = await DigitalProduct.findAndCountAll({
    attributes: ["id", "key", "name", "unit_price", "status"],
    where: {
      status: 1, // Only active products
    },
    include: [
      {
        model: ProductCategory,
        as: "category",
        attributes: ["name"],
      },
      {
        model: DigitalProductPool,
        as: "digitalProductPool",
        attributes: ["pool_id", "digital_product_id"],
        required: false, // Don't require this join
        include: [
          {
            model: PoolView, // Make sure this is the correct model
            as: "poolView", // Match the alias in your model associations
            attributes: [
              "id",
              "key",
              "view",
              "status",
              "online",
              "pool_status",
              "pool_sales_status",
            ],
            required: false, // Don't require this join initially
          },
        ],
      },
    ],
    limit: parseInt(per_page, 10),
    offset: parseInt(offset, 10),
  });

  // Add debugging to see what's returned
  console.log(`Found ${rows.length} digital products before filtering`);

  // Process each product to filter pools
  const processedProducts = [];

  for (const product of rows) {
    // Deep clone the product to avoid modifying the original Sequelize object
    const processedProduct = JSON.parse(JSON.stringify(product));

    if (
      processedProduct.digitalProductPool &&
      processedProduct.digitalProductPool.length > 0
    ) {
      // Filter the pools for this product
      const filteredPools = [];

      for (const dpp of processedProduct.digitalProductPool) {
        // Skip if poolView is missing
        if (!dpp.poolView) continue;

        const pool = dpp.poolView;

        // Check if pool is active and upcoming
        if (
          pool.status !== 1 ||
          !pool.online ||
          pool.pool_status !== "upcoming" ||
          pool.pool_sales_status !== "active"
        ) {
          continue;
        }

        // Check access based on pool view type
        if (pool.view === 0) {
          // Public pool - add it
          filteredPools.push(dpp);
        } else if (pool.view === 1) {
          // Conditional pool - check if distributor is assigned
          const assigned = await ConditionalDistributorPool.findOne({
            where: {
              pool_id: pool.id,
              distributor_id: distributor_id,
            },
          });

          if (assigned) {
            filteredPools.push(dpp);
          }
        }
      }

      processedProduct.digitalProductPool = filteredPools;
    }

    // Only include products that have at least one accessible pool
    if (
      processedProduct.digitalProductPool &&
      processedProduct.digitalProductPool.length > 0
    ) {
      processedProducts.push(processedProduct);
    }
  }

  console.log(`Found ${processedProducts.length} products after filtering`);

  // Calculate pagination
  const totalCount = processedProducts.length;
  const totalPages = Math.ceil(totalCount / per_page);

  return sendSuccess(
    res,
    "Digital products retrieved successfully",
    httpStatus.OK,
    {
      total: totalCount,
      totalPages,
      currentPage: parseInt(page, 10),
      per_page: parseInt(per_page, 10),
      digitalProducts: processedProducts,
    }
  );
});

exports.getDigitalProductPool = catchAsync(async (req, res) => {
  const { digital_product_id, distributor_id } = req.query;

  const digitalProduct = await DigitalProduct.findByPk(digital_product_id);

  if (!digitalProduct) {
    return sendError(res, "Digital product not found", httpStatus.NOT_FOUND);
  }

  const distributor = await Distributer.findByPk(distributor_id);
  if (!distributor) {
    return sendError(res, "Distributor not found", httpStatus.NOT_FOUND);
  }

  // Get all pools for this digital product
  const digitalProductPools = await DigitalProductPool.findAll({
    where: { digital_product_id },
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
  });

  // Filter pools: view=0 (public) or view=1 (must be assigned to distributor)
  const filteredPools = [];
  for (const dpp of digitalProductPools) {
    if (!dpp.poolView) continue;
    if (dpp.poolView.view === 0) {
      filteredPools.push(dpp);
    } else if (dpp.poolView.view === 1) {
      const assigned = await ConditionalDistributorPool.findOne({
        where: { pool_id: dpp.poolView.id, distributor_id },
      });
      if (assigned) filteredPools.push(dpp);
    }
  }

  if (filteredPools.length === 0) {
    return sendError(
      res,
      "No pools found for this digital product and distributor",
      httpStatus.NOT_FOUND
    );
  }

  return sendSuccess(
    res,
    "Digital product pools retrieved successfully",
    httpStatus.OK,
    filteredPools
  );
});

exports.getPoolMatches = catchAsync(async (req, res) => {
  const { pool_id } = req.params;

  const pool = await Pool.findByPk(pool_id);

  if (!pool) {
    return sendError(res, "Pool not found", httpStatus.NOT_FOUND);
  }

  if (pool.type === 0) {
    return sendSuccess(
      res,
      "This pool is a defined pool, can't make predictions",
      httpStatus.OK,
      {
        pool,
        poolMatches: await PoolMatch.findAll({
          where: { pool_id: pool.id },
          include: [
            {
              model: Match,
              as: "match",
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
        }),
      }
    );
  }

  const matches = await pool.getMatches();

  if (!matches || matches.length === 0) {
    return sendError(
      res,
      "No matches found for this pool",
      httpStatus.NOT_FOUND
    );
  }
  const option = await Prediction.findAll({
    attributes: ["id", "value"],
  });
  const formattedMatches = matches.map((match) => ({
    match_id: match.id,
    local_team_key: match.local_team_key,
    visit_team_key: match.visit_team_key,
    Prediction: option.map((option) => ({
      id: option.id,
      value: option.value,
    })),
    poolId: match.poolId,
  }));

  return sendSuccess(
    res,
    "Pool matches retrieved successfully",
    httpStatus.OK,
    formattedMatches
  );
});

exports.makeUserPoolPurchase = catchAsync(async (req, res) => {
  const {
    pool_id,
    distributor_id,
    phone_number,
    matchesWithPredictions,
    purchase_quantity,
  } = req.body;

  const distributer = await Distributer.findByPk(distributor_id, {
    attributes: ["id"], // Select at least the primary key
    transaction: req.transaction,
  });

  if (distributer.status === false) {
    return sendError(res, "Distributor is inactive", httpStatus.FORBIDDEN);
  }

  if (distributer.allow_status === false) {
    return sendError(
      res,
      "Distributor is not allowed to make purchases",
      httpStatus.FORBIDDEN
    );
  }

  const pool = await Pool.findByPk(pool_id, {
    include: [
      {
        model: Match,
        as: "matches",
        attributes: ["id"],
      },
    ],
    transaction: req.transaction,
  });

  const dmquiniela = await Dmquiniela.findOne({
    where: { id: pool.dmquiniela_id },
    transaction: req.transaction,
  });

  if (!dmquiniela) {
    return sendError(
      res,
      "Dmquiniela not found for this pool",
      httpStatus.NOT_FOUND
    );
  }

  const poolPrizeCondition = await PoolPrizeCondition.findOne({
    where: { key: dmquiniela.key },
    transaction: req.transaction,
  });

  const type = pool.type;
  const price = dmquiniela.price;
  const award = poolPrizeCondition.award;
  const pool_key = pool.key;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  if (
    type === 0 &&
    matchesWithPredictions &&
    matchesWithPredictions.length > 0
  ) {
    return sendError(
      res,
      "This pool is a defined pool, can't make predictions",
      httpStatus.BAD_REQUEST
    );
  }
  if (
    type === 1 &&
    !matchesWithPredictions &&
    matchesWithPredictions.length === 0
  ) {
    return sendError(
      res,
      "Matches with predictions are required for this pool type",
      httpStatus.BAD_REQUEST
    );
  }

  if (type === 1) {
    // Verify that predictions are provided for ALL matches in the pool
    if (
      pool.matches &&
      matchesWithPredictions &&
      pool.matches.length !== matchesWithPredictions.length
    ) {
      return sendError(
        res,
        `You must provide predictions for all matches in the pool. Expected: ${pool.matches.length}, Provided: ${matchesWithPredictions.length}`,
        httpStatus.BAD_REQUEST
      );
    }

    // Verify all match_ids and prediction_ids are valid
    matchesWithPredictions.forEach((match) => {
      if (!match.match_id || !match.prediction_id) {
        return sendError(
          res,
          "Each match must have a match_id and prediction_id",
          httpStatus.BAD_REQUEST
        );
      }
      if (!pool.matches || !pool.matches.some((m) => m.id === match.match_id)) {
        return sendError(
          res,
          `Match with ID ${match.match_id} not found in pool`,
          httpStatus.BAD_REQUEST
        );
      }
    });

    // Verify that ALL matches in the pool have a corresponding prediction
    if (pool.matches) {
      const providedMatchIds = matchesWithPredictions.map((m) => m.match_id);
      const missingMatches = pool.matches.filter(
        (m) => !providedMatchIds.includes(m.id)
      );

      if (missingMatches.length > 0) {
        return sendError(
          res,
          `Missing predictions for matches: ${missingMatches
            .map((m) => m.id)
            .join(", ")}`,
          httpStatus.BAD_REQUEST
        );
      }
    }
  }

  const userPurchasedPool = await UserPurchasedPool.create(
    {
      pool_id,
      distributor_id,
      phone_number,
      unique_code: result,
      pool_key,
      purchase_quantity,
      purchase_amount: price * purchase_quantity,
      purchase_date: new Date(),
      prize_amount: award * purchase_quantity,
    },
    { transaction: req.transaction }
  );

  if (type === 0) {
    const poolMatchIds = await PoolMatch.findAll({
      where: { pool_id },
      attributes: ["id", "pool_id", "match_id", "prediction_id"],
      transaction: req.transaction,
    });

    const userPoolMatches = poolMatchIds.map((pm) => ({
      user_id: userPurchasedPool.id,
      pool_id: pm.pool_id,
      match_id: pm.match_id,
      prediction_id: pm.prediction_id,
    }));
    await UserPoolMatch.bulkCreate(userPoolMatches, {
      transaction: req.transaction,
    });
  }
  if (type === 1) {
    const poolMatchIds = await PoolMatch.findAll({
      where: { pool_id },
      attributes: ["id", "pool_id", "match_id"],
      transaction: req.transaction,
    });

    const userPoolMatches = matchesWithPredictions.map((match) => {
      const poolMatch = poolMatchIds.find(
        (pm) => pm.match_id === match.match_id
      );
      if (!poolMatch) {
        return sendError(
          res,
          `Match with ID ${match.match_id} not found in pool`,
          httpStatus.BAD_REQUEST
        );
      }
      return {
        user_id: userPurchasedPool.id,
        pool_id: poolMatch.pool_id,
        match_id: poolMatch.match_id,
        prediction_id: match.prediction_id,
      };
    });
    await UserPoolMatch.bulkCreate(userPoolMatches, {
      transaction: req.transaction,
    });
  }

  if (!userPurchasedPool) {
    return sendError(
      res,
      "Failed to create user pool purchase",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  const distributor_sales_pools = await DistributerSalePool.findOne({
    where: {
      pool_id,
      distributor_id,
    },
    transaction: req.transaction,
  });
  if (distributor_sales_pools) {
    // Update existing sale pool
    distributor_sales_pools.sold_pool_quantity += purchase_quantity;
    distributor_sales_pools.amount_sold += price * purchase_quantity;
    distributor_sales_pools.prize_amount += award * purchase_quantity;
    await distributor_sales_pools.save({ transaction: req.transaction });
  } else {
    // Create new sale pool
    await DistributerSalePool.create(
      {
        pool_id,
        distributor_id,
        sold_pool_quantity: purchase_quantity,
        amount_sold: price * purchase_quantity,
      },
      { transaction: req.transaction }
    );
  }

  return sendSuccess(
    res,
    "User pool purchase created successfully",
    httpStatus.CREATED,
    {
      user_purchased_pool: await UserPurchasedPool.findByPk(
        userPurchasedPool.id,
        { transaction: req.transaction }
      ),
      userPoolMatches: await UserPoolMatch.findAll({
        where: { user_id: userPurchasedPool.id },
        attributes: ["id", "pool_id", "match_id", "prediction_id"],
        include: [
          {
            model: Match,
            as: "match",
            attributes: ["id", "local_team_key", "visit_team_key"],
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
          {
            model: Pool,
            as: "pool",
            attributes: ["id", "key", "dmquiniela_id"],
          },
        ],
        transaction: req.transaction,
      }),
    }
  );
});

// Api to request user purchased pool ticket cancellation 

exports.requestPoolTicketCancellation = catchAsync(async (req, res) => {
  const { distributor_id } = req.params;
  const { user_purchased_pool_id, comments, attended_by, attention_date, attention_time } =
    req.body;

  const distributor = await Distributer.findByPk(distributor_id, {
    transaction: req.transaction,
  });

  if (!distributor) {
    return sendError(res, "Distributor not found", httpStatus.NOT_FOUND);
  }
  await PoolCancellationRequest.create(
    {
      user_purchased_pool_id,
      distributor_id,
      comments,
      attended_by,
      attention_date,
      attention_time,
      request_status: 0, // 0 = Pending
    },
    { transaction: req.transaction }
  );

  logger.info(
    `Pool ticket cancellation requested for User Purchased Pool ID ${user_purchased_pool_id} by Distributor with Id (${distributor_id}): ${comments}`
  );
  return sendSuccess(
    res,
    "Pool cancellation request submitted successfully",
    httpStatus.OK
  );
});




exports.publicTicketValidate = catchAsync(async (req, res) => {
  const { phone_number, full_code } = req.body;

  // Check if the user has purchased this pool
  const userPurchasedPool = await UserPurchasedPool.findOne({
    where: { phone_number, full_code },
    include: [
      {
        model: PoolView,
        as: "poolView",
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
        attributes: ["id", "name", "email", "phone"],
      },
      {
        model: UserPoolMatch,
        as: "userPoolMatches",
        attributes: ["match_id", "prediction_id"],
        include: [
          {
            model: Match,
            as: "match",
            attributes: ["id", "local_team_key", "visit_team_key"],
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
      },
    ],
    transaction: req.transaction,
  });

  if (!userPurchasedPool) {
    return sendError(
      res,
      "User has not purchased this pool",
      httpStatus.NOT_FOUND
    );
  }

  return sendSuccess(
    res,
    "User pool validated successfully",
    httpStatus.OK,
    userPurchasedPool
  );
});