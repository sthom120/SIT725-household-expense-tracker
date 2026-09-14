const ExpenseCategory = require('../models/ExpenseCategory');

const defaultCategories = [
  'Groceries',
  'Rent',
  'Utilities',
  'Transport',
  'Household Supplies',
  'Entertainment',
  'Other'
];

const getExpenseCategories = async (req, res) => {
  try {
    let categories = await ExpenseCategory.find();

    if (categories.length === 0) {
      await ExpenseCategory.insertMany(
        defaultCategories.map(name => ({ name }))
      );

      categories = await ExpenseCategory.find();
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to retrieve expense categories'
    });
  }
};

module.exports = {
  getExpenseCategories
};