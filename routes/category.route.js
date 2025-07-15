const express = require("express");
const router = express.Router();
const productCategoryController = require("../controllers/productCategory.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const {
  createProductCategoryValidateSchema,
  updateProductCategoryValidateSchema,
  listProductCategoriesValidateSchema,
  getProductCategoryValidateSchema,
  deleteProductCategoryValidateSchema  
} = require("../validations/productCategory.validation");
router.use(authMiddleware, authorizeRoles("admin"));
 

router.put(
  "/:categoryId",
  validate(updateProductCategoryValidateSchema),
  productCategoryController.updateProductCategory
);

router.post(
  "/",
  validate(createProductCategoryValidateSchema),
  productCategoryController.createProductCategory
);

router.get(
  "/:categoryId",
  validate(getProductCategoryValidateSchema),
  productCategoryController.getProductCategory
);

router.get(
  "/",
  validate(listProductCategoriesValidateSchema),
  catchAsync(productCategoryController.listProductCategories)
);

router.delete(
  "/:categoryId",
  validate(deleteProductCategoryValidateSchema),
  productCategoryController.deleteProductCategory
);



module.exports = router;

