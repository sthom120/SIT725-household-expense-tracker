const Expense = require('../models/Expense');
const Household = require('../models/Household');


// Calculate how much each member has paid
const getMemberPayments = async (req, res) => {
  try {
    const { householdId } = req.params;

    if (!householdId) {
      return res.status(400).json({
        message: 'Household ID is required.'
      });
    }

    const expenses = await Expense.find({
      household: householdId
    }).populate('payer', 'name email');

    const memberPayments = {};

    expenses.forEach((expense) => {
      if (!expense.payer) {
        return;
      }

      const payerId = expense.payer._id.toString();

      if (!memberPayments[payerId]) {
        memberPayments[payerId] = {
          userId: expense.payer._id,
          name: expense.payer.name,
          email: expense.payer.email,
          totalPaid: 0
        };
      }

      memberPayments[payerId].totalPaid += expense.amount;
    });

    const payments = Object.values(memberPayments).map((member) => ({
      ...member,
      totalPaid: Number(member.totalPaid.toFixed(2))
    }));

    return res.status(200).json({
      householdId,
      payments
    });

  } catch (error) {
    console.error('Error calculating member payments:', error);

    return res.status(500).json({
      message: 'Unable to calculate member payments.'
    });
  }
};


// Calculate how much each member is responsible for
const getMemberExpenseShares = async (req, res) => {
  try {
    const { householdId } = req.params;

    if (!householdId) {
      return res.status(400).json({
        message: 'Household ID is required.'
      });
    }

    const household = await Household.findById(householdId)
      .populate('members.user', 'name email');

    if (!household) {
      return res.status(404).json({
        message: 'Household not found.'
      });
    }

    const expenses = await Expense.find({
      household: householdId
    });

    const memberCount = household.members.length;

    if (memberCount === 0) {
      return res.status(200).json({
        householdId,
        memberShares: []
      });
    }

    const memberShares = household.members.map((member) => ({
      userId: member.user._id,
      name: member.user.name,
      email: member.user.email,
      totalShare: 0
    }));

    expenses.forEach((expense) => {
      const sharePerMember = expense.amount / memberCount;

      memberShares.forEach((member) => {
        member.totalShare += sharePerMember;
      });
    });

    const shares = memberShares.map((member) => ({
      ...member,
      totalShare: Number(member.totalShare.toFixed(2))
    }));

    return res.status(200).json({
      householdId,
      memberShares: shares
    });

  } catch (error) {
    console.error('Error calculating member expense shares:', error);

    return res.status(500).json({
      message: 'Unable to calculate member expense shares.'
    });
  }
};


// Calculate each member's current balance
const getHouseholdBalances = async (req, res) => {
  try {
    const { householdId } = req.params;

    if (!householdId) {
      return res.status(400).json({
        message: 'Household ID is required.'
      });
    }

    const household = await Household.findById(householdId)
      .populate('members.user', 'name email');

    if (!household) {
      return res.status(404).json({
        message: 'Household not found.'
      });
    }

    const expenses = await Expense.find({
      household: householdId
    }).populate('payer', 'name email');

    const memberCount = household.members.length;

    if (memberCount === 0) {
      return res.status(200).json({
        householdId,
        balances: []
      });
    }

    const balances = household.members.map((member) => ({
      userId: member.user._id,
      name: member.user.name,
      email: member.user.email,
      totalPaid: 0,
      totalShare: 0,
      balance: 0
    }));


    // Calculate shares and payments
    expenses.forEach((expense) => {

      // Equal share of the expense for each household member
      const sharePerMember = expense.amount / memberCount;

      balances.forEach((member) => {
        member.totalShare += sharePerMember;
      });


      // Add the expense to the person who paid
      if (expense.payer) {
        const payer = balances.find(
          (member) =>
            member.userId.toString() === expense.payer._id.toString()
        );

        if (payer) {
          payer.totalPaid += expense.amount;
        }
      }
    });


    // Calculate final balance
    const finalBalances = balances.map((member) => ({
      ...member,

      totalPaid: Number(
        member.totalPaid.toFixed(2)
      ),

      totalShare: Number(
        member.totalShare.toFixed(2)
      ),

      balance: Number(
        (member.totalPaid - member.totalShare).toFixed(2)
      )
    }));


    return res.status(200).json({
      householdId,
      balances: finalBalances
    });

  } catch (error) {
    console.error('Error calculating household balances:', error);

    return res.status(500).json({
      message: 'Unable to calculate household balances.'
    });
  }
};


module.exports = {
  getMemberPayments,
  getMemberExpenseShares,
  getHouseholdBalances
};