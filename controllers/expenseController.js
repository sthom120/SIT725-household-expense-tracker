const Expense = require('../models/Expense');
const Household = require('../models/Household');
const { buildExpenseQuery } = require('../utils/expenseFilters');
const {
  isValidId,
  isHouseholdMember
} = require('../utils/householdAccess');

// US07 / US12 - expense history for a household, with optional filters:
// category, startDate and endDate. Only members of the household can view it.
// NOTE: login (US02) was not delivered, so the user ID is sent as a query
// parameter as a stand-in for the logged-in user.
const getExpenseHistory = async (req, res) => {
  try {
    const { householdId } = req.params;
    const { userId, category, startDate, endDate } = req.query;

    if (!isValidId(householdId) || !isValidId(userId)) {
      return res.status(400).json({
        message: 'A valid household ID and user ID are required.'
      });
    }

    const household = await Household.findById(householdId);

    if (!household) {
      return res.status(404).json({
        message: 'Household not found.'
      });
    }

    if (!isHouseholdMember(household, userId)) {
      return res.status(403).json({
        message: 'You are not a member of this household.'
      });
    }

    let query;

    try {
      query = buildExpenseQuery(householdId, {
        category,
        startDate,
        endDate
      });
    } catch (filterError) {
      return res.status(400).json({
        message: filterError.message
      });
    }

    const expenses = await Expense.find(query)
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
