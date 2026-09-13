const express = require('express');

const router = express.Router();

const {
  createHousehold,
  getHousehold
} = require('../controllers/householdController');

router.post('/', createHousehold);

router.get('/:id', getHousehold);

module.exports = router;