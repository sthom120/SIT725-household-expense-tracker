const express = require('express');
const router = express.Router();

const {
  getExpenseCategories
} = require('../controllers/expenseCategoryController');

router.get('/', getExpenseCategories);

module.exports = router;