// File: utils/validators/adminValidator.js
const Joi = require('joi');

// Shared string patterns
const namePattern = /^[A-Za-z]+$/;
const passwordPattern = /^[A-Za-z0-9!@#$%^&*()_+=-]{8,30}$/;

// Register schema
const registerSchema = Joi.object({
  role: Joi.string().valid('admin').required(),
  first_name: Joi.string().pattern(namePattern).min(2).max(64).required(),
  last_name: Joi.string().pattern(namePattern).min(2).max(64).required(),
  email: Joi.string().email().max(128).required(),
  employee_key: Joi.string().alphanum().min(4).max(64).required(),
  position: Joi.string().min(2).max(64).required(),
  password: Joi.string().pattern(passwordPattern).required(),
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().max(128).required(),
  password: Joi.string().pattern(passwordPattern).required(),
  role: Joi.string().required(),
});

// Update profile schema
const updateProfileSchema = Joi.object({
  role: Joi.string().valid('admin').optional(),
  first_name: Joi.string().pattern(namePattern).min(2).max(64).optional(),
  last_name: Joi.string().pattern(namePattern).min(2).max(64).optional(),
  position: Joi.string().min(2).max(64).optional(),
  employee_key: Joi.string().alphanum().min(4).max(64).optional(),
  email: Joi.string().email().max(128).optional(),
});

// Reset password schema
const resetPasswordSchema = Joi.object({
  current_password: Joi.string().pattern(passwordPattern).required(),
  new_password: Joi.string().pattern(passwordPattern).required(),
  confirm_password: Joi.ref('new_password'),
});


module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  resetPasswordSchema,
};