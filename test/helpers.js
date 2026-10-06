const createResponse = () => {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };

  return res;
};

const USER_A = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const USER_B = 'bbbbbbbbbbbbbbbbbbbbbbbb';
const HOUSEHOLD_ID = 'cccccccccccccccccccccccc';
const OTHER_HOUSEHOLD_ID = 'dddddddddddddddddddddddd';
const CATEGORY_ID = 'eeeeeeeeeeeeeeeeeeeeeeee';

const createHousehold = (memberIds = []) => ({
  _id: HOUSEHOLD_ID,
  householdName: 'Test House',
  householdIdentifier: 'house-123',
  members: memberIds.map((id) => ({
    user: id,
    relationship: 'member'
  })),
  saved: false,
  async save() {
    this.saved = true;
  }
});

module.exports = {
  createResponse,
  createHousehold,
  USER_A,
  USER_B,
  HOUSEHOLD_ID,
  OTHER_HOUSEHOLD_ID,
  CATEGORY_ID
};
