const express = require("express");
const router = express.Router();
const dmquinielaController = require("../controllers/dmquiniela.controller");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createDmquinielaSchema,
  updateDmquinielaSchema,
  deleteDmquinielaSchema,
  getDmquinielaByIdSchema,
  listDmquinielasSchema,
} = require("../validations/dmquiniela.validation");
router.use(authMiddleware, authorizeRoles("admin"));


router.post(
  "/",
  validate(createDmquinielaSchema),
  dmquinielaController.createDmquiniela
);
router.put(
  "/:dmquiniela_id",
  validate(updateDmquinielaSchema),
  dmquinielaController.updateDmquiniela
);
router.get(
  "/",
  validate(listDmquinielasSchema),
  dmquinielaController.getDmquinielas
);
router.get(
  "/:dmquiniela_id",
  validate(getDmquinielaByIdSchema),
  dmquinielaController.getDmquinielaById
);
router.delete(
  "/:dmquiniela_id",
  validate(deleteDmquinielaSchema),
  dmquinielaController.deleteDmquiniela
);

module.exports = router;
