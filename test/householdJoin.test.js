const test = require('node:test');
const assert = require('node:assert/strict');

const Household = require('../models/Household');
const User = require('../models/User');
const {
  joinHousehold,
  getHouseholdDashboard
} = require('../controllers/householdController');
const {
  createResponse,
  createHousehold,
  USER_A,
  USER_B,
  HOUSEHOLD_ID
} = require('./helpers');

test.afterEach(() => {
  test.mock.restoreAll();
});

const mockUser = (user) =>
  test.mock.method(User, 'findById', async () => user);

const mockHouseholdLookup = (household) =>
  test.mock.method(Household, 'findOne', async () => household);

test('a registered user can join an existing household', async () => {
  const household = createHousehold([USER_B]);
  mockUser({ _id: USER_A });
  mockHouseholdLookup(household);

  const res = createResponse();
  await joinHousehold(
    { body: { householdIdentifier: 'house-123', userId: USER_A } },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.householdId, HOUSEHOLD_ID);
  assert.equal(household.saved, true);
  assert.equal(household.members.length, 2);
  assert.equal(household.members[1].user, USER_A);
});

test('joining with an unknown household identifier is rejected', async () => {
  mockUser({ _id: USER_A });
  mockHouseholdLookup(null);

  const res = createResponse();
  await joinHousehold(
    { body: { householdIdentifier: 'missing', userId: USER_A } },
    res
  );

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.message, 'Household not found.');
});

test('joining the same household twice is rejected', async () => {
  const household = createHousehold([USER_A]);
  mockUser({ _id: USER_A });
  mockHouseholdLookup(household);

  const res = createResponse();
  await joinHousehold(
    { body: { householdIdentifier: 'house-123', userId: USER_A } },
    res
  );

  assert.equal(res.statusCode, 409);
  assert.equal(household.saved, false);
  assert.equal(household.members.length, 1);
});

test('missing or invalid input is rejected', async () => {
  const missing = createResponse();
  await joinHousehold({ body: { userId: USER_A } }, missing);
  assert.equal(missing.statusCode, 400);

  const badId = createResponse();
  await joinHousehold(
    { body: { householdIdentifier: 'house-123', userId: 'abc' } },
    badId
  );
  assert.equal(badId.statusCode, 400);

  const objectInput = createResponse();
  await joinHousehold(
    { body: { householdIdentifier: { $ne: '' }, userId: USER_A } },
    objectInput
  );
  assert.equal(objectInput.statusCode, 400);
});

test('an unknown user cannot join a household', async () => {
  mockUser(null);

  const res = createResponse();
  await joinHousehold(
    { body: { householdIdentifier: 'house-123', userId: USER_A } },
    res
  );

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.message, 'User not found.');
});

test('a newly joined member can open the household dashboard', async () => {
  const household = createHousehold([USER_A]);
  test.mock.method(Household, 'findById', () => ({
    populate: async () => household
  }));

  const res = createResponse();
  await getHouseholdDashboard(
    { params: { id: HOUSEHOLD_ID }, query: { userId: USER_A } },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.householdName, 'Test House');
  assert.equal(res.body.members.length, 1);
});

test('a user who has not joined cannot open the dashboard', async () => {
  const household = createHousehold([USER_B]);
  test.mock.method(Household, 'findById', () => ({
    populate: async () => household
  }));

  const res = createResponse();
  await getHouseholdDashboard(
    { params: { id: HOUSEHOLD_ID }, query: { userId: USER_A } },
    res
  );

  assert.equal(res.statusCode, 403);
  assert.equal(
    res.body.message,
    'You are not a member of this household.'
  );
});
