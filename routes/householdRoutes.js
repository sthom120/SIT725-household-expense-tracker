const express = require('express');

const router = express.Router();

const {
  createHousehold,
  getHousehold,
  joinHousehold,
  getHouseholdDashboard
} = require('../controllers/householdController');

router.post('/', createHousehold);

router.post('/join', joinHousehold);

router.get('/:id/dashboard', getHouseholdDashboard);

router.get('/:id', getHousehold);

module.exports = router;
