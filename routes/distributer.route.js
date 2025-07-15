// routes/distributorRoutes.js
const express = require("express");
const router = express.Router();
const distributorController = require("../controllers/distributer.controller");
const userPoolController = require("../controllers/UserPoolPurchase.controller");
const globalData = require("../controllers/globalData.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const {
  distributorSchema,
  updateDistributorSchema,
  getByIdSchema,
  listDistributorsSchema,
  deleteDistributorSchema,
  updateAllowStatusSchema,
  poolSalesFilteredSchema,
  poolSalesSchema,
} = require("../validations/distributer.validation");
 
const {
  publicTicketValidateSchema,
} = require("../validations/public.validation");

router.use(authMiddleware, authorizeRoles("admin"));

router.patch(
  "/update-allow-status/:distributerId",
  validate(updateAllowStatusSchema),
  distributorController.update_status
);
router.get(
  "/get-not-allowed-distributor",
  distributorController.listNotAllowedDistributors
);

router.get(
  "/pool-sales/:distributor_id",
  validate(poolSalesSchema),
  distributorController.poolSales
);
router.get(
  "/pool-sales-filtered/:distributor_id",
  validate(poolSalesFilteredSchema),
  distributorController.poolSalesFiltered
);

router.post(
  "/",
  validate(distributorSchema),
  distributorController.createDistributor
);
router.put(
  "/:distributor_id",
  validate(updateDistributorSchema),
  distributorController.updateDistributor
);
router.get(
  "/",
  validate(listDistributorsSchema),
  distributorController.getDistributors
);
router.get(
  "/:distributor_id",
  validate(getByIdSchema),
  distributorController.getDistributorById
);
router.delete(
  "/:distributor_id",
  validate(deleteDistributorSchema),
  distributorController.deleteDistributor
);

router.post(
  "/ticket_validate",
  validate(publicTicketValidateSchema),
  globalData.publicTicketValidate
);

module.exports = router;
