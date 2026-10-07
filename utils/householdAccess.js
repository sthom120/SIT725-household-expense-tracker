const isValidId = (value) =>
  typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

const isHouseholdMember = (household, userId) => {
  return household.members.some((member) => {
    if (!member.user) {
      return false;
    }

    const memberId = member.user._id || member.user;

    return String(memberId) === String(userId);
  });
};

module.exports = {
  isValidId,
  isHouseholdMember
};
