// routes/poolRoutes.js
const express = require("express");
const router = express.Router();
const poolController = require("../controllers/pool.controller");
const dmquinielaController = require("../controllers/dmquiniela.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const {
  poolSchema,
  updatePoolSchema,
  getByIdSchema,
  listPoolsSchema,
  deletePoolSchema,
  getMaskSalesByIdSchema,
  listDistributorPools,
} = require("../validations/pool.validation");
router.use(authMiddleware, authorizeRoles("admin"));

router.get('/mask-sales',poolController.maskSales);
router.get('/mask-sales-details/:mask_sales_id',validate(getMaskSalesByIdSchema),poolController.maskSalesDetails);
router.get('/mask-sales/:distributor_id',validate(listDistributorPools),poolController.listDistributorPools);

router.get("/pending-matches", poolController.listPendingMatches);

router.post("/", validate(poolSchema), poolController.createPool);
router.put("/:pool_id", validate(updatePoolSchema), poolController.updatePool);
router.get("/:pool_id", validate(getByIdSchema), poolController.getPoolById);
router.delete("/:pool_id", validate(deletePoolSchema), poolController.deletePool);
router.get("/", validate(listPoolsSchema), poolController.getPool);

module.exports = router;
