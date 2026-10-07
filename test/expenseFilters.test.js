const test = require('node:test');
const assert = require('node:assert/strict');

const Expense = require('../models/Expense');
const Household = require('../models/Household');
const { buildExpenseQuery } = require('../utils/expenseFilters');
const { getExpenseHistory } = require('../controllers/expenseController');
const {
  createResponse,
  createHousehold,
  USER_A,
  USER_B,
  HOUSEHOLD_ID,
  OTHER_HOUSEHOLD_ID,
  CATEGORY_ID
} = require('./helpers');

test.afterEach(() => {
  test.mock.restoreAll();
});

test('no filters only restricts results to the household', () => {
  assert.deepStrictEqual(buildExpenseQuery(HOUSEHOLD_ID), {
    household: HOUSEHOLD_ID
  });
});

test('filters by category', () => {
  assert.deepStrictEqual(
    buildExpenseQuery(HOUSEHOLD_ID, { category: CATEGORY_ID }),
    { household: HOUSEHOLD_ID, category: CATEGORY_ID }
  );
});

test('filters by date range and includes the whole end day', () => {
  const query = buildExpenseQuery(HOUSEHOLD_ID, {
    startDate: '2026-09-01',
    endDate: '2026-09-30'
  });

  assert.equal(query.household, HOUSEHOLD_ID);
  assert.equal(
    query.date.$gte.toISOString(),
    '2026-09-01T00:00:00.000Z'
  );
  assert.equal(
    query.date.$lte.toISOString(),
    '2026-09-30T23:59:59.999Z'
  );
});

test('combines category and date filters', () => {
  const query = buildExpenseQuery(HOUSEHOLD_ID, {
    category: CATEGORY_ID,
    startDate: '2026-09-01'
  });

  assert.equal(query.category, CATEGORY_ID);
  assert.ok(query.date.$gte instanceof Date);
  assert.equal(query.date.$lte, undefined);
});

test('rejects invalid filters', () => {
  assert.throws(
    () => buildExpenseQuery(HOUSEHOLD_ID, { category: 'abc' }),
    /Invalid category/
  );
  assert.throws(
    () => buildExpenseQuery(HOUSEHOLD_ID, { startDate: '01/09/2026' }),
    /YYYY-MM-DD/
  );
  assert.throws(
    () => buildExpenseQuery(HOUSEHOLD_ID, { endDate: '2026-13-45' }),
    /YYYY-MM-DD/
  );
  assert.throws(
    () =>
      buildExpenseQuery(HOUSEHOLD_ID, {
        startDate: '2026-10-01',
        endDate: '2026-09-01'
      }),
    /Start date cannot be after end date/
  );
});

const mockHousehold = (household) =>
  test.mock.method(Household, 'findById', async () => household);

const mockExpenses = (expenses) =>
  test.mock.method(Expense, 'find', (query) => {
    const chain = {
      query,
      populate: () => chain,
      sort: async () => expenses
    };

    return chain;
  });

test('a member gets filtered expenses for their own household', async () => {
  mockHousehold(createHousehold([USER_A]));
  const find = mockExpenses([{ description: 'Milk' }]);

  const res = createResponse();
  await getExpenseHistory(
    {
      params: { householdId: HOUSEHOLD_ID },
      query: { userId: USER_A, category: CATEGORY_ID }
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.deepStrictEqual(res.body, [{ description: 'Milk' }]);
  assert.deepStrictEqual(find.mock.calls[0].arguments[0], {
    household: HOUSEHOLD_ID,
    category: CATEGORY_ID
  });
});

test('no matching expenses returns an empty list', async () => {
  mockHousehold(createHousehold([USER_A]));
  mockExpenses([]);

  const res = createResponse();
  await getExpenseHistory(
    {
      params: { householdId: HOUSEHOLD_ID },
      query: { userId: USER_A, startDate: '2030-01-01' }
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.deepStrictEqual(res.body, []);
});

test('a non-member cannot view another household expenses', async () => {
  mockHousehold(createHousehold([USER_B]));
  const find = mockExpenses([{ description: 'Secret' }]);

  const res = createResponse();
  await getExpenseHistory(
    {
      params: { householdId: HOUSEHOLD_ID },
      query: { userId: USER_A }
    },
    res
  );

  assert.equal(res.statusCode, 403);
  assert.equal(find.mock.callCount(), 0);
});

test('results are always limited to the requested household', async () => {
  mockHousehold(createHousehold([USER_A]));
  const find = mockExpenses([]);

  const res = createResponse();
  await getExpenseHistory(
    {
      params: { householdId: HOUSEHOLD_ID },
      query: { userId: USER_A, endDate: '2026-12-31' }
    },
    res
  );

  const query = find.mock.calls[0].arguments[0];
  assert.equal(query.household, HOUSEHOLD_ID);
  assert.notEqual(query.household, OTHER_HOUSEHOLD_ID);
});

test('an invalid filter returns 400 and does not query expenses', async () => {
  mockHousehold(createHousehold([USER_A]));
  const find = mockExpenses([]);

  const res = createResponse();
  await getExpenseHistory(
    {
      params: { householdId: HOUSEHOLD_ID },
      query: { userId: USER_A, startDate: 'yesterday' }
    },
    res
  );

  assert.equal(res.statusCode, 400);
  assert.equal(find.mock.callCount(), 0);
});

test('missing user ID or unknown household is rejected', async () => {
  const noUser = createResponse();
  await getExpenseHistory(
    { params: { householdId: HOUSEHOLD_ID }, query: {} },
    noUser
  );
  assert.equal(noUser.statusCode, 400);

  mockHousehold(null);
  const unknown = createResponse();
  await getExpenseHistory(
    {
      params: { householdId: HOUSEHOLD_ID },
      query: { userId: USER_A }
    },
    unknown
  );
  assert.equal(unknown.statusCode, 404);
});
