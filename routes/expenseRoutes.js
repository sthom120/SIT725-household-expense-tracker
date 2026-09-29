const express = require('express');
const router = express.Router();

const {
  getExpenseHistory
} = require('../controllers/expenseController');

router.get('/household/:householdId', getExpenseHistory);

module.exports = router;