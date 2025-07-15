const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');
const validate = require("../middleware/validate");
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createSport,
  updateSport,
  getSport,
  createRegion,
  updateRegion,
  getRegion,
  deleteRegionValidateSchema,
  deleteSportValidateSchema
} = require("../validations/catalog.validation");

// Apply auth middleware to all routes
router.use(authMiddleware, authorizeRoles('admin'));

// Sport routes
router.post('/sports', validate(createSport), catalogController.createSport);
router.put('/sports/:sport_id', validate(updateSport), catalogController.updateSport);
router.get('/sports', catalogController.getAllSports);
router.get('/sports/:sport_id', validate(getSport), catalogController.getSportById);
router.delete('/sports/:sport_id', validate(deleteSportValidateSchema), catalogController.deleteSport);

// country routes
router.get('/countries', catalogController.listCountryKeys);

// Region routes
router.post('/regions', validate(createRegion), catalogController.createRegion);
router.put('/regions/:region_id', validate(updateRegion), catalogController.updateRegion);
router.get('/regions', catalogController.getAllRegions);
router.get('/regions/:region_id', validate(getRegion), catalogController.getRegionById);
router.delete('/regions/:region_id', validate(deleteRegionValidateSchema), catalogController.deleteRegion);

module.exports = router;
