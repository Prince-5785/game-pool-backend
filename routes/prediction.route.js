const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  makePoolPredictionSchema,
  getPoolPredictionsSchema,
} = require("../validations/prediction.validation");
const distributerController = require("../controllers/distributer.controller");

router.use(authMiddleware, authorizeRoles("distributor", "admin"));

// Make predictions for a pool
router.post(
  "/predictions",
  validate(makePoolPredictionSchema),
  distributerController.makePoolPredictions
);

// Get predictions for a pool
router.get(
  "/predictions",
  validate(getPoolPredictionsSchema),
  distributerController.getPoolPredictions
);

module.exports = router;
