const express = require("express");
const router = express.Router();
const distributorController = require("../controllers/distributerInterface.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const {
  listDigitalProductsForDistributorSchema,
  getDigitalProductPoolSchema,
  getPoolMatchesSchema,
  makeUserPoolPurchaseSchema,
  poolTicketCancellationRequestSchema,
  publicTicketValidateSchema,
} = require("../validations/distributerInterface.validation");


// router.use(authMiddleware, authorizeRoles("distributer"));

router.get(
  "/digital-products/:distributor_id",
  validate(listDigitalProductsForDistributorSchema),
  distributorController.listDigitalProductsForDistributor
);

router.get(
  "/pool",
  validate(getDigitalProductPoolSchema),
  distributorController.getDigitalProductPool
);
router.get(
  "/pool/matches/:pool_id",
  validate(getPoolMatchesSchema),
  catchAsync(distributorController.getPoolMatches)
);


router.post(
  "/user-pool",
  validate(makeUserPoolPurchaseSchema),
  distributorController.makeUserPoolPurchase
);

router.post(
  "/pool-cancellation-request/:distributor_id",
  validate(poolTicketCancellationRequestSchema),
  distributorController.requestPoolTicketCancellation
);

router.post(
  "/ticket_validate",
  validate(publicTicketValidateSchema),
  distributorController.publicTicketValidate
);
  

module.exports = router;