const calculateEqualSplit = (amount, participantIds) => {
  if (!amount || amount <= 0) {
    throw new Error('Expense amount must be greater than zero.');
  }

  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    throw new Error('At least one participant is required.');
  }

  const totalCents = Math.round(amount * 100);
  const participantCount = participantIds.length;

  const baseShareCents = Math.floor(totalCents / participantCount);
  const remainderCents = totalCents % participantCount;

  return participantIds.map((userId, index) => {
    const shareCents =
      baseShareCents + (index < remainderCents ? 1 : 0);

    return {
      user: userId,
      share: shareCents / 100
    };
  });
};

module.exports = {
  calculateEqualSplit
};