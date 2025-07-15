// routes/distributorRoutes.js
const express = require("express");
const router = express.Router();
const userPoolController = require("../controllers/UserPoolPurchase.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const {
  getUserPurchasedPoolsSchema,
  getUserPurchasedPoolsByIdSchema,
  makeUserPoolPurchaseSchema,
  deleteUserPurchasedPoolSchema,
  listPoolTicketsCancellationRequestsSchema,
} = require("../validations/userPoolPurchase.validation");
// router.use(authMiddleware, authorizeRoles("distributor"));

router.get(
  "/user-pool",
  validate(getUserPurchasedPoolsSchema),
  userPoolController.getUserPurchasedPools
);
router.get(
  "/user-pool/:user_id",
  validate(getUserPurchasedPoolsByIdSchema),
  userPoolController.getUserPurchasedPoolsById
);
router.delete(
  "/user-pool/:id",
  validate(deleteUserPurchasedPoolSchema),
  catchAsync(userPoolController.deleteUserPurchasedPool)
);
router.get(
  "/pool-cancellation-requests",
  validate(listPoolTicketsCancellationRequestsSchema),
  userPoolController.listPoolTicketsCancellationRequests
);

module.exports = router;
