const jwt = require('jsonwebtoken');
const { Admin,Distributer } = require('../models');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const { sendError, sendSuccess } = require('../utils/ApiResponse');
const { status: httpStatus } = require("http-status");
const { allow } = require('joi');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // 7 days


const MODELS = {
  admin: Admin,
  distributor: Distributer,
};

// Register a new admin
exports.register = catchAsync(async (req, res) => {
  const {
    role,
    first_name,
    last_name,
    email,
    employee_key,
    position,
    password,
  } = req.body;

  const admin = await Admin.create(
    { role, first_name, last_name, email, employee_key, position, password },
    { transaction: req.transaction }
  );

  sendSuccess(res, "Admin registered successfully", httpStatus.OK, admin);
});

// Login and issue JWT
exports.login = catchAsync(async (req, res) => {
  const { email, password, role } = req.body;

  // 1) Validate role
  if (!role || !MODELS[role]) {
    return sendError(
      res,
      'Invalid role. Must be "admin" or "distributor".',
      httpStatus.BAD_REQUEST
    );
  }

  const Model = MODELS[role];

  const user = await Model.findOne({ where: { email } });
  if (!user || !(await user.verify_password(password))) {
    return sendError(res, 'Invalid credentials', httpStatus.UNAUTHORIZED);
  }

  const payload = { id: user.id, role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return sendSuccess(
    res,
    `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`,
    httpStatus.OK,
    { token , email:user.email,name:user.name, first_name: user.first_name, last_name: user.last_name }
  );
}, { useTransaction: false });

// Get current admin profile
exports.getProfile = catchAsync(async (req, res) => {


  const admin = await Admin.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
    transaction: req.transaction,
  });
  if (!admin) {
    return sendError(
      res,
      httpStatus.NOT_FOUND,
      'Admin not found',
    );
  }
  return sendSuccess(
    res,
    'Profile fetched successfully',
    httpStatus.OK,
    admin,
  );
});

// Update profile (excluding password)
exports.updateProfile = catchAsync(async (req, res) => {
  const { role, first_name, last_name, position, employee_key, email } = req.body;
  const admin = await Admin.findByPk(req.user.id, { transaction: req.transaction });

  if (!admin) {
    return sendError(
      res,
      'Admin not found',
      httpStatus.NOT_FOUND,
    );
  }

  await admin.update(
    { role, first_name, last_name, position, employee_key, email },
    { transaction: req.transaction }
  );

  return sendSuccess(
    res,
    'Profile updated successfully',
    httpStatus.OK,
    admin
  );
});

// Reset password
exports.resetPassword = catchAsync(async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  const admin = await Admin.findByPk(req.user.id, { transaction: req.transaction });

  if (!admin) {
    return sendError(
      res,
      httpStatus.NOT_FOUND,
      'Admin not found',
    );
  }

  if (!(await admin.verify_password(current_password))) {
    return sendError(
      res,
      httpStatus.BAD_REQUEST,
      'Current password is incorrect',
    );
  }

  if (new_password !== confirm_password) {
    return sendError(
      res,
      httpStatus.BAD_REQUEST,
      'New passwords do not match',
    );
  }

  admin.password = new_password;
  await admin.save({ transaction: req.transaction });

  return sendSuccess(
    res,
    'Password reset successful',
    httpStatus.OK,
  );
});
