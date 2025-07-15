//pool.controller
const {
  Distributer,
  City,
  Pool,
  Match,
  PoolMatch,
  Sequelize,
  UserPurchasedPool,
  PublicTicketValidateRequest,
  PoolView,
  UserPoolMatch,
  Dmquiniela,
  Team,
  Prediction,
  sequelize
} = require("../models");
const logger = require("../config/logger");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/ApiResponse");
const { status: httpStatus } = require("http-status");
const { Op, fn, col, where: whereClause } = require("sequelize");

exports.listAllStates = catchAsync(async (req, res) => {
  const presentStates = await City.findAll({
    attributes: ["state"],
    group: "state",
    order: [["state", "ASC"]],
  });
  const presentStateList = presentStates.map((state) => state.state);

  return sendSuccess(res, "List of states", httpStatus.OK, presentStateList);
});

exports.listCitiesByState = catchAsync(async (req, res) => {
  const { state_name } = req.query;
  const presentCities = await City.findAll({
    where: { state: state_name },
    attributes: [[fn("DISTINCT", col("city")), "city"]],
    order: [["city", "ASC"]],
    raw: true,
  });

  if (presentCities.length === 0) {
    return sendError(
      res,
      "No cities found for this state",
      httpStatus.NOT_FOUND
    );
  }

  const presentCityList = presentCities.map((city) => city.city);

  return sendSuccess(res, "List of cities", httpStatus.OK, presentCityList);
});

exports.availablePools = catchAsync(async (req, res) => {
  const availablePools = await PoolView.findAll({
    where: {
      status: 1,
      online: true, // Only include online pools
      pool_status: "upcoming", // Filter for upcoming pools
    },
    order: [["first_match_start_date", "ASC"]],
  });

  if (!availablePools || availablePools.length === 0) {
    return sendError(
      res,
      "No authorized and online available pools found",
      httpStatus.NOT_FOUND
    );
  }

  return sendSuccess(res, "Available pools", httpStatus.OK, availablePools);
});

exports.historicalPools = catchAsync(async (req, res) => {
  const completedPools = await PoolView.findAll({
    where: {
      status: 1,
      online: true, // Only include online pools
      pool_status: "completed", // Filter for historical pools
    },
    order: [["first_match_start_date", "ASC"]],
  });

  if (!completedPools || completedPools.length === 0) {
    return sendError(
      res,
      "No authorised and online Completed pools found",
      httpStatus.NOT_FOUND
    );
  }

  return sendSuccess(res, "Completed pools", httpStatus.OK, completedPools);
});

exports.inProgressPools = catchAsync(async (req, res) => {
  const inProgressPools = await PoolView.findAll({
    where: {
      status: 1,
      online: true, // Only include online pools
      pool_status: "ongoing",
    },
    order: [["first_match_start_date", "ASC"]],
  });

  return sendSuccess(res, "In Progress pools", httpStatus.OK, inProgressPools);
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
    limit: perPage,
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
    });
  },
  { useTransaction: false }
);