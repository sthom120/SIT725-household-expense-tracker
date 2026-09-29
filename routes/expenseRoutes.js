const express = require('express');

const router = express.Router();

const {
  getMemberPayments,
  getMemberExpenseShares,
  getHouseholdBalances
} = require('../controllers/expenseController');


router.get(
  '/household/:householdId/member-payments',
  getMemberPayments
);


router.get(
  '/household/:householdId/member-shares',
  getMemberExpenseShares
);


router.get(
  '/household/:householdId/balances',
  getHouseholdBalances
);


module.exports = router;