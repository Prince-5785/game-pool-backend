const express = require('express');
const router = express.Router();
const globalData = require('../controllers/globalData.controller');
const catchAsync = require('../utils/catchAsync');
const validate = require('../middleware/validate');

router.get('/', globalData.listAllStates); 
router.get('/city', globalData.listCitiesByState);  

router.get('/available-pools', globalData.availablePools);
router.get('/completed-pools', globalData.historicalPools);
router.get('/running-pools', globalData.inProgressPools);


module.exports = router;
