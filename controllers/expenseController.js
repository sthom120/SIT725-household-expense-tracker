const Expense = require('../models/Expense');

const getExpenseHistory = async (req, res) => {
  try {
    const expenses = await Expense.find({
      household: req.params.householdId
    })
      .populate('category')
      .populate('payer', 'name email')
      .populate('participants.user', 'name email')
      .sort({ date: -1 });

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve expense history.'
    });
  }
};

module.exports = {
  getExpenseHistory
};