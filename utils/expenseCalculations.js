const calculateEqualSplit = (amount, participantIds) => {
  if (!amount || amount <= 0) {
    throw new Error('Expense amount must be greater than zero.');
  }

  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    throw new Error('At least one participant is required.');
  }

  const share = Number((amount / participantIds.length).toFixed(2));

  return participantIds.map((userId) => ({
    user: userId,
    share
  }));
};

module.exports = {
  calculateEqualSplit
};