const {
  Distributer,
  Pool,
  Team,
  Prediction,
  UserPurchasedPool,
  Match,
  PoolMatch,
  Dmquiniela,
  PoolPrizeCondition,
  UserPoolMatch,
} = require("../models");
const { status: httpStatus } = require("http-status");
const { sendSuccess, sendError } = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const logger = require("../config/logger");
const { Op, fn, col, where: whereClause, where } = require("sequelize");
const { raw } = require("express");
const attributes = require("../config/attributes");

exports.getUserPurchasedPools = catchAsync(async (req, res) => {
  const { page = 1, per_page = 10, pool_id, distributor_id } = req.query;

  // Validate parameters
  const pageInt = parseInt(page, 10);
  const perPage = parseInt(per_page, 10);

  const offset = (pageInt - 1) * perPage;

  // Build where conditions based on filters
  const whereConditions = {};

  // Add filters if they exist
  if (pool_id) {
    whereConditions.pool_id = pool_id;
  }

  if (distributor_id) {
    whereConditions.distributor_id = distributor_id;
  }

  // Build include array for related models
  const includeModels = [
    {
      model: Pool,
      as: "pool",
      attributes: ["id", "key", "type", "dmquiniela_id"],
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
          attributes: ["id"],
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
  ];

  // Query with pagination and filters
  const { count, rows } = await UserPurchasedPool.findAndCountAll({
    where: whereConditions,
    limit: perPage,
    offset,
    order: [["purchase_date", "DESC"]],
    include: includeModels,
  });

  // Return paginated response
  return sendSuccess(
    res,
    "User purchased pools retrieved successfully",
    httpStatus.OK,
    {
      total: count,
      purchases: rows,
      pagination: {
        currentPage: pageInt,
        totalPages: Math.ceil(count / perPage),
        pageSize: perPage,
      },
    }
  );
});

exports.getUserPurchasedPoolsById = catchAsync(async (req, res) => {
  const { user_id } = req.params;

  // Fetch user by ID
  const user = await UserPurchasedPool.findOne({
    where: { id: user_id },
    include: [
      {
        model: Distributer,
        as: "distributor",
        attributes: ["id", "name", "email", "phone"],
      },
      {
        model: Pool,
        as: "pool",
        attributes: ["id", "key", "type", "dmquiniela_id"],
      },
      {
        model: UserPoolMatch,
        as: "userPoolMatches",
        attributes: ["match_id", "prediction_id"],
        include: [
          {
            model: Match,
            as: "match",
            attributes: ["id", "match_start_date"],
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
  });

  // Check if user exists
  if (!user) {
    return sendError(res, "User not found", httpStatus.NOT_FOUND);
  }

  return sendSuccess(res, "User retrieved successfully", httpStatus.OK, user);
});

exports.deleteUserPurchasedPool = catchAsync(async (req, res) => {
  const { user_id } = req.params;

  // Find the user purchased pool by ID
  const userPurchasedPool = await UserPurchasedPool.findByPk(user_id, {
    transaction: req.transaction,
  });

  // Check if the user purchased pool exists
  if (!userPurchasedPool) {
    return sendError(
      res,
      "User purchased pool not found",
      httpStatus.NOT_FOUND
    );
  }

  // Delete the user purchased pool
  await userPurchasedPool.destroy({ transaction: req.transaction });

  return sendSuccess(
    res,
    "User purchased pool deleted successfully",
    httpStatus.OK
  );
});

exports.listPoolTicketsCancellationRequests = catchAsync(async (req, res) => {
  const { page = 1, per_page = 10, distributor_id } = req.query;

x  // Build where conditions - make distributor_id filter optional
  const whereConditions = {};
  if (distributor_id) {
    whereConditions.distributor_id = distributor_id;
  }

  // Fetch cancellation requests
  const { count, rows } = await PoolCancellationRequest.findAndCountAll({
    where: whereConditions,
    limit: per_page,
    offset: (page - 1) * per_page,
    order: [["created_at", "DESC"]],
  });

  return sendSuccess(
    res,
    "Pool tickets cancellation requests retrieved successfully",
    httpStatus.OK,
    {
      total: count,
      requests: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / per_page),
        pageSize: per_page,
      },
    }
  );
});
