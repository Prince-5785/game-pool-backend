const express = require('express');
const router = express.Router();
const {authMiddleware,authorizeRoles} = require('../middleware/authMiddleware');
const catchAsync = require('../utils/catchAsync');
const adminCtrl = require('../controllers/admin.controller');
const passport = require('../config/passport');
const {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    resetPasswordSchema,
    updateAllowStatusSchema
  } = require('../validations/admin.validation');
const validate = require('../middleware/validate');

router.post(
    '/register',
    validate(registerSchema),
    catchAsync(adminCtrl.register)
);
router.post(
    '/login',
    validate(loginSchema),
    catchAsync(adminCtrl.login, { useTransaction: false })
);
router.get(
    '/profile',
    authMiddleware,authorizeRoles('admin'),
    catchAsync(adminCtrl.getProfile)
);
router.put(
    '/update-profile',
    authMiddleware,authorizeRoles('admin'),
    validate(updateProfileSchema), 
    catchAsync(adminCtrl.updateProfile)
);
router.post(
    '/reset-password',
    authMiddleware,authorizeRoles('admin'),
    validate(resetPasswordSchema),
    catchAsync(adminCtrl.resetPassword)
);

module.exports = router;