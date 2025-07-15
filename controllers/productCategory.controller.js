const {
  ProductCategory,
} = require("../models");
const logger = require("../config/logger");
const catchAsync = require("../utils/catchAsync");
const { sendError, sendSuccess } = require("../utils/ApiResponse");
const { status: httpStatus } = require("http-status");
const { Op, fn, col } = require("sequelize");
const attributes = require("../config/attributes");

exports.createProductCategory = catchAsync(async (req, res) => {
  const { key, name, status } = req.body;

  const category = await ProductCategory.create({
    key,
    name,
    status,
  });

  return sendSuccess(
    res,
    "Product category created successfully",
    httpStatus.CREATED,
    category
  );
});

exports.listProductCategories = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows } = await ProductCategory.findAndCountAll({
    attributes: ["id", "key", "name", "status"],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
  });
  const totalPages = Math.ceil(count / limit);
  return sendSuccess(
    res,
    "Product categories retrieved successfully",
    httpStatus.OK,
    {
      total: count,
      totalPages,
      currentPage: parseInt(page, 10),
      limit: parseInt(limit, 10),
      categories: rows,
    }
  );
});

exports.updateProductCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const { key, name, status } = req.body;

  const category = await ProductCategory.findByPk(categoryId);

  if (!category) {
    return sendError(res, "Product category not found", httpStatus.NOT_FOUND);
  }

  // If key is being changed, make sure it's not already in use

  if (key && key !== category.key) {
    const existingCategory = await ProductCategory.findOne({
      where: {
        key,
        id: { [Op.ne]: categoryId }, // Exclude current category
    },
    });

    if (existingCategory) {
      return sendError(
        res,
        "Product category with this key already exists",
        httpStatus.CONFLICT
      );
    }
  }

  await category.update({
    key,
    name,
    status,
  });

  return sendSuccess(
    res,
    "Product category updated successfully",
    httpStatus.OK,
    category
  );
});

exports.getProductCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const category = await ProductCategory.findByPk(categoryId, {
    attributes: ["id", "key", "name", "status"],
  });

  if (!category) {
    return sendError(res, "Product category not found", httpStatus.NOT_FOUND);
  }

  return sendSuccess(
    res,
    "Product category retrieved successfully",
    httpStatus.OK,
    category
  );
});

exports.deleteProductCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const category = await ProductCategory.findByPk(categoryId);

  if (!category) {
    return sendError(res, "Product category not found", httpStatus.NOT_FOUND);
  }

  await category.destroy();

  return sendSuccess(
    res,
    "Product category deleted successfully",
    httpStatus.OK
  );
});
