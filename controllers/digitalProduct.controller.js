//digital product controller
const {
  Pool,
  DigitalProduct,
  DigitalProductPool,
  ProductCategory,
  Prediction,
  sequelize,
  Dmquiniela,
  PoolMatch,
  Match,
  Team,
  PoolView,
  PoolMatchPrediction,
} = require("../models");
const logger = require("../config/logger");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/ApiResponse");
const { status: httpStatus } = require("http-status");
const { Op, fn, col } = require("sequelize");
const attributes = require("../config/attributes");

exports.createDigitalProduct = catchAsync(async (req, res) => {
  const {
    key,
    name,
    description,
    barcode,
    category_id,
    unit_price,
    inventory_item,
    item_for_sale,
    purchase_item,
    ecommerce_article,
    status,
    poolsId,
  } = req.body;

  if (!Array.isArray(poolsId) || poolsId.length === 0) {
    return sendError(
      res,
      "poolsId must be a non-empty array",
      httpStatus.BAD_REQUEST
    );
  }

  await sequelize.transaction(async (transaction) => {
    const poolIds = poolsId.map((item) => item.id);

    // Validate pool existence
    const pools = await sequelize.models.PoolView.findAll({
      where: {
        id: { [Op.in]: poolIds },
        pool_status: "upcoming", // Only include upcoming pools
        pool_sales_status: "active", // Only include active pools
        online: true, // Only include online pools
        status: 1, // Only include active pools
      },
      include: [
        {
          model: Dmquiniela,
          as: "dmquiniela",
          attributes: ["id", "name", "price"],
          where: {
            price: parseFloat(unit_price), // Ensure the pool's price matches the digital product's unit price
            status: 1, // Only include active pools
          },
        },
      ],
      attributes: attributes.PoolAttributes,
      transaction,
    });

    if (pools.length !== poolIds.length) {
      return sendError(
        res,
        "One or more pool IDs are invalid",
        httpStatus.BAD_REQUEST
      );
    }

    // Create the digital product
    const digitalProduct = await sequelize.models.DigitalProduct.create(
      {
        key,
        name,
        description,
        barcode,
        category_id,
        unit_price: parseFloat(unit_price),
        inventory_item: Boolean(inventory_item),
        item_for_sale: Boolean(item_for_sale),
        purchase_item: Boolean(purchase_item),
        ecommerce_article: Boolean(ecommerce_article),
        status: parseInt(status, 10) || 1, // Default to 1 (Active) if not provided
      },
      { transaction }
    );

    // Bulk create DigitalProductPool entries
    const digitalProductPoolEntries = poolsId.map((p) => ({
      digital_product_id: digitalProduct.id,
      pool_id: p.id,
    }));

    await sequelize.models.DigitalProductPool.bulkCreate(
      digitalProductPoolEntries,
      { transaction }
    );

    await digitalProduct.save({ transaction });

    return sendSuccess(
      res,
      "Digital product created successfully",
      httpStatus.CREATED,
      {
        digitalProduct,
        pools: await sequelize.models.Pool.findAll({
          where: { id: { [Op.in]: poolIds } },
        }),
      }
    );
  });
});

exports.updateDigitalProduct = catchAsync(async (req, res) => {
  const { digitalProductId } = req.params;
  const {
    key,
    name,
    description,
    barcode,
    category_id,
    unit_price,
    inventory_item,
    item_for_sale,
    purchase_item,
    ecommerce_article,
    status,
    poolsId,
  } = req.body;

  await sequelize.transaction(async (transaction) => {
    const digitalProduct = await DigitalProduct.findByPk(digitalProductId, {
      transaction,
    });

    if (!digitalProduct) {
      return sendError(res, "Digital product not found", httpStatus.NOT_FOUND);
    }

    if( key && key !== digitalProduct.key) {
      const existingProduct = await DigitalProduct.findOne({
        where: { key , id: { [Op.ne]: digitalProductId } },
        transaction,
      });
      if (existingProduct) {
        return sendError(
          res,
          "A digital product with this key already exists",
          httpStatus.BAD_REQUEST
        );
      }
    }

    await digitalProduct.update(
      {
        key,
        name,
        description,
        barcode,
        category_id,
        unit_price,
        inventory_item,
        item_for_sale,
        purchase_item,
        ecommerce_article,
        status,
      },
      { transaction }
    );

    // Update associated pools
    if (Array.isArray(poolsId) && poolsId.length > 0) {
      const poolIds = poolsId.map((item) => item.id);
      // Validate pool existence
      const pools = await PoolView.findAll({
        where: {
          id: { [Op.in]: poolIds },
          pool_status: "upcoming", // Only include upcoming pools
          pool_sales_status: "active", // Only include active pools
          online: true, // Only include online pools
          status: 1, // Only include active pools
        },
        include: [
          {
            model: Dmquiniela,
            as: "dmquiniela",
            attributes: ["id", "price"],
            where: {
              price: parseFloat(digitalProduct.unit_price), // Ensure the pool's price matches the digital product's unit price
              status: 1, // Only include active pools
            },
          },
        ],
        transaction,
      });
      if (pools.length !== poolIds.length) {
        return sendError(
          res,
          "One or more pool IDs are invalid or is not active",
          httpStatus.BAD_REQUEST
        );
      }
      await DigitalProductPool.destroy({
        where: { digital_product_id: digitalProductId },
        transaction,
      });
      const digitalProductPoolEntries = poolsId.map((p) => ({
        digital_product_id: digitalProduct.id,
        pool_id: p.id,
      }));
      await DigitalProductPool.bulkCreate(digitalProductPoolEntries, {
        transaction,
      });
    }
    return sendSuccess(
      res,
      "Digital product updated successfully",
      httpStatus.OK,
      {
        digitalProduct,
        pools: await DigitalProductPool.findAll({
          where: { digital_product_id: digitalProductId },
          transaction,
        }),
      }
    );
  });
});

exports.getDigitalProductPools = catchAsync(async (req, res) => {
  const { digitalProductId } = req.params;

  const digitalProduct = await DigitalProduct.findByPk(digitalProductId);

  if (!digitalProduct) {
    return sendError(res, "Digital product not found", httpStatus.NOT_FOUND);
  }

  const pools = await DigitalProductPool.findAll({
    where: { digital_product_id: digitalProductId },
    include: [
      {
        model: Pool,
        as: "pools",
      },
    ],
  });
  if (!pools) {
    return sendError(
      res,
      "No pools found for this digital product",
      httpStatus.NOT_FOUND
    );
  }
  return sendSuccess(
    res,
    "Digital product pools retrieved successfully",
    httpStatus.OK,
    pools
  );
});

exports.listDigitalProducts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const { count, rows } = await DigitalProduct.findAndCountAll({
    attributes: ["id", "key", "name", "unit_price", "status"],
    include: [
      {
        model: ProductCategory,
        as: "category",
        attributes: ["name"],
      },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
  });
  const totalPages = Math.ceil(count / limit);
  return sendSuccess(
    res,
    "Digital products retrieved successfully",
    httpStatus.OK,
    {
      total: count,
      totalPages,
      currentPage: parseInt(page, 10),
      limit: parseInt(limit, 10),
      digitalProducts: rows,
    }
  );
});

exports.getPoolMatches = catchAsync(async (req, res) => {
  const { poolId } = req.params;

  const pool = await Pool.findByPk(poolId);

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

exports.listSamePricePools = catchAsync(async (req, res) => {
  const { price } = req.query;

  if (!price) {
    return sendError(
      res,
      "Price query parameter is required",
      httpStatus.BAD_REQUEST
    );
  }

  const pools = await PoolView.findAll({
    where: {
      online: true, // Only include online pools
      pool_status: "upcoming", // Only include upcoming pools
      pool_sales_status: "active", // Only include active pools
      status: 1, // Only include active pools
    },
    include: [
      {
        model: Dmquiniela,
        as: "dmquiniela",
        where: {
          price: parseFloat(price), // Ensure the pool's price matches the query parameter
          status: 1, // Only include active pools
        },
        attributes: ["id", "name", "price"],
      },
    ],
    attributes: attributes.PoolAttributes,
  });

  if (!pools || pools.length === 0) {
    return sendError(
      res,
      "No pools found with the specified price",
      httpStatus.NOT_FOUND
    );
  }

  return sendSuccess(res, "Pools retrieved successfully", httpStatus.OK, pools);
});


exports.deleteDigitalProduct = catchAsync(async (req, res) => {
  const { digitalProductId } = req.params;

  const digitalProduct = await DigitalProduct.findByPk(digitalProductId);

  if (!digitalProduct) {
    return sendError(res, "Digital product not found", httpStatus.NOT_FOUND);
  }

  await digitalProduct.destroy();

  return sendSuccess(
    res,
    "Digital product deleted successfully",
    httpStatus.OK
  );
});
