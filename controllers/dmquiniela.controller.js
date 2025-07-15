const {
  Pool,
  Team,
  Match,
  PoolMatch,
  sequelize,
  DistributerPurchasedPool,
  Distributer,
  PredictionDistributor,
  PoolPrizeCondition,
  DigitalProduct,
  DigitalProductPool,
  Tournament,
  DistributerPurchasedPoolMatch,
  DistributerPrediction,
  PoolMatchPrediction,
  PoolMatchPredictionDistributor,
  Prediction,
  Dmquiniela,
} = require("../models");
const logger = require("../config/logger");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/ApiResponse");
const { status: httpStatus } = require("http-status");
const { Op, fn, col, or, where } = require("sequelize");
const attributes = require("../config/attributes");
const { raw } = require("express");

exports.createDmquiniela = catchAsync(async (req, res) => {
  const {
    key,
    name,
    prize_type,
    total_matches,
    price,
    percentage_profit,
    game_type,
    top_scoreboard,
    dissemble_doubles_triples,
    description,
    legend,
    terms,
    status,
    icon,
    prize_conditions,
  } = req.body;

  if (!prize_conditions || prize_conditions.length === 0) {
    return sendError(
      res,
      "Prize conditions are required to create a Dmquiniela",
      httpStatus.BAD_REQUEST
    );
  }
  const prizeType = prize_type;
  const prizeConditions = prize_conditions.map((condition) => ({
    condition_type: condition.condition_type,
    value: condition.value,
    award: condition.award,
  }));

  if (prizeType == 0) {
    prizeConditions.forEach((condition) => {
      if (condition.award > 100) {
        return sendError(
          res,
          "Award value cannot be greater than 100% for percentage prize type",
          httpStatus.BAD_REQUEST
        );
      }
    });
  }

  const dmquiniela = await Dmquiniela.create(
    {
      key,
      name,
      prize_type,
      total_matches,
      price,
      percentage_profit,
      game_type,
      top_scoreboard,
      dissemble_doubles_triples,
      description,
      legend,
      terms,
      status,
      icon,
    },
    {
      transaction: req.transaction,
    }
  );

  // Create Pool Conditions
  const prizeConditionsWithPoolCode = prizeConditions.map((condition) => ({
    ...condition,
    key: dmquiniela.key, // Ensure the key is set correctly
  }));
  await PoolPrizeCondition.bulkCreate(prizeConditionsWithPoolCode, {
    transaction: req.transaction,
  });

  sendSuccess(res, "Dmquiniela created successfully", httpStatus.OK, {
    dmquiniela,
    prize_conditions: prizeConditionsWithPoolCode,
  });
});

exports.updateDmquiniela = catchAsync(async (req, res) => {
  const { dmquiniela_id } = req.params;
  const {
    key,
    name,
    prize_type,
    total_matches,
    price,
    percentage_profit,
    game_type,
    top_scoreboard,
    dissemble_doubles_triples,
    description,
    legend,
    terms,
    status,
    icon,
    prize_conditions,
  } = req.body;
  const transaction = req.transaction;

  const dm_quiniela = await Dmquiniela.findByPk(dmquiniela_id, { transaction });
  if (!dm_quiniela) {
    return sendError(res, "Dmquiniela not found", httpStatus.NOT_FOUND);
  }

  // Validate key uniqueness if provided
  if (key && key !== dm_quiniela.key) {
    const existingDmquiniela = await Dmquiniela.findOne({
      where: { key, id: { [Op.ne]: dmquiniela_id } },
      transaction,
    });
    if (existingDmquiniela) {
      return sendError(
        res,
        "Dmquiniela with this key already exists",
        httpStatus.CONFLICT
      );
    }
  }

  // Validate and update prize conditions if provided
  let prizeConditionsWithPoolCode;
  if (prize_conditions && prize_conditions.length > 0) {
    const prizeConditions = prize_conditions.map((condition) => ({
      condition_type: condition.condition_type,
      value: condition.value,
      award: condition.award,
    }));
    if (prize_type == 0 || dm_quiniela.prize_type == 0) {
      for (const condition of prizeConditions) {
        if (condition.award > 100) {
          return sendError( 
            res,
            "Award value cannot be greater than 100%",
            httpStatus.BAD_REQUEST
          );
        }
      }
    }
    // Delete existing prize conditions for the Dmquiniela
    await PoolPrizeCondition.destroy({
      where: { key: dm_quiniela.key },
      transaction,
    });
    // Create new prize conditions
    prizeConditionsWithPoolCode = prizeConditions.map((condition) => ({
      ...condition,
      key: dm_quiniela.key,
    }));
    await PoolPrizeCondition.bulkCreate(prizeConditionsWithPoolCode, {
      transaction,
    });
  }

  // Update Dmquiniela fields
  await dm_quiniela.update(
    {
      key,
      name,
      prize_type,
      total_matches,
      price,
      percentage_profit,
      game_type,
      top_scoreboard,
      dissemble_doubles_triples,
      description,
      legend,
      terms,
      status,
      icon,
    },
    { transaction }
  );

  return sendSuccess(res, "Dmquiniela updated successfully", httpStatus.OK, {
    dm_quiniela,
    prize_conditions: prizeConditionsWithPoolCode,
  });
});

exports.getDmquinielaById = catchAsync(
  async (req, res) => {
    const { dmquiniela_id } = req.params;
    const dm_quiniela = await Dmquiniela.findByPk(dmquiniela_id);

    if (!dm_quiniela) return sendError(res, "Dmquiniela not found", httpStatus.NOT_FOUND);

    return sendSuccess(res, "Dmquiniela fetched successfully", httpStatus.OK, {
      dm_quiniela,
      prize_conditions: await PoolPrizeCondition.findAll({
        where: { key: dm_quiniela.key },
        attributes: ["condition_type", "value", "award"],
      }),
    });
  },
  { useTransaction: false }
);

exports.getDmquinielas = catchAsync(
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

    const { count, rows } = await Dmquiniela.findAndCountAll({
      where: whereCondition,
      limit: perPage,
      offset,
      include: [
        {
          model: PoolPrizeCondition,
          as: "prizeCondition",
          attributes: ["condition_type", "value", "award"],
        },
      ],
      logging: console.log, // prints actual SQL to console
    });

    // 5. Return paginated, filtered result
    return sendSuccess(res, "Dmquiniela list", httpStatus.OK, {
      total: count,
      dmquinielas: rows,
      pagination: {
        currentPage: pageInt,
        totalPages: Math.ceil(count / perPage),
        pageSize: perPage,
      },
    });
  },
  { useTransaction: false }
);

exports.deleteDmquiniela = catchAsync(async (req, res) => {
  const { dmquiniela_id } = req.params;
  const transaction = req.transaction;
  const dm_quiniela = await Dmquiniela.findByPk(dmquiniela_id, { transaction });

  if (!dm_quiniela) {
    return sendError(res, "Dmquiniela not found", httpStatus.NOT_FOUND);
  }

  await dm_quiniela.destroy({ transaction });
  return sendSuccess(res, "Dmquiniela deleted successfully", httpStatus.OK);
});