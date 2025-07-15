// routes/poolRoutes.js
const express = require('express');
const router = express.Router();
const distributer = require('../controllers/distributer.controller');
const pool = require('../controllers/pool.controller');
const globalData = require('../controllers/globalData.controller');
const catchAsync = require('../utils/catchAsync');
const validate = require('../middleware/validate');
const { listDistributorsSchema, getByIdSchema } = require('../validations/distributer.validation');
const { listPoolsSchema, getPoolByIdSchema } = require('../validations/pool.validation');
const { publicTicketValidateSchema } = require('../validations/public.validation');

router.get('/pools',validate(listPoolsSchema),globalData.getPool);
router.get('/pools/:pool_id',validate(getPoolByIdSchema),globalData.getPoolById);
router.post('/ticket_validate',validate(publicTicketValidateSchema), globalData.publicTicketValidate);

router.get("/", validate(listDistributorsSchema), globalData.getDistributors);
router.get('/:distributor_id',validate(getByIdSchema),globalData.getDistributorById);

module.exports = router;