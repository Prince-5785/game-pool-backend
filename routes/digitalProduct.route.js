const express = require('express');
const router = express.Router();
const digitalProductController = require('../controllers/digitalProduct.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const catchAsync = require('../utils/catchAsync');
const validate = require('../middleware/validate');
const { createDigitalProductValidateSchema, getDigitalProductPoolsValidateSchema, getPoolMatchesValidateSchema, listDigitalProductsValidateSchema, listSamePricePoolsValidateSchema, updateDigitalProductValidateSchema, deleteDigitalProductValidateSchema} = require('../validations/digitalProduct.validation');
router.use(authMiddleware, authorizeRoles('admin'));

router.get("/pools",validate(listSamePricePoolsValidateSchema),digitalProductController.listSamePricePools);
router.get("/list-match/:poolId",validate(getPoolMatchesValidateSchema),digitalProductController.getPoolMatches);
router.post('/', validate(createDigitalProductValidateSchema), digitalProductController.createDigitalProduct);
router.get('/:digitalProductId', validate(getDigitalProductPoolsValidateSchema), digitalProductController.getDigitalProductPools);
router.get('/',validate(listDigitalProductsValidateSchema) ,catchAsync(digitalProductController.listDigitalProducts));
router.put('/:digitalProductId', validate(updateDigitalProductValidateSchema), digitalProductController.updateDigitalProduct);
router.delete('/:digitalProductId',validate(deleteDigitalProductValidateSchema) ,digitalProductController.deleteDigitalProduct);

module.exports = router;