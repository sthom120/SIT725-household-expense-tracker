const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateEqualSplit
} = require('../utils/expenseCalculations');

test('splits an expense equally between two participants', () => {
  const result = calculateEqualSplit(20, ['user1', 'user2']);

  assert.deepStrictEqual(result, [
    { user: 'user1', share: 10 },
    { user: 'user2', share: 10 }
  ]);
});

test('splits an expense equally between multiple participants', () => {
  const result = calculateEqualSplit(
    30,
    ['user1', 'user2', 'user3']
  );

  assert.deepStrictEqual(result, [
    { user: 'user1', share: 10 },
    { user: 'user2', share: 10 },
    { user: 'user3', share: 10 }
  ]);
});

test('handles uneven dollar amounts and rounding', () => {
  const result = calculateEqualSplit(
    10,
    ['user1', 'user2', 'user3']
  );

  assert.deepStrictEqual(result, [
    { user: 'user1', share: 3.34 },
    { user: 'user2', share: 3.33 },
    { user: 'user3', share: 3.33 }
  ]);
});

test('handles an expense with one participant', () => {
  const result = calculateEqualSplit(12.75, ['user1']);

  assert.deepStrictEqual(result, [
    { user: 'user1', share: 12.75 }
  ]);
});

test('participant shares add up to the original expense amount', () => {
  const amount = 100;
  const result = calculateEqualSplit(
    amount,
    ['user1', 'user2', 'user3', 'user4', 'user5', 'user6']
  );

  const totalShareCents = result.reduce(
    (total, participant) =>
      total + Math.round(participant.share * 100),
    0
  );

  assert.strictEqual(
    totalShareCents,
    Math.round(amount * 100)
  );
});

test('rejects an empty participant list', () => {
  assert.throws(
    () => calculateEqualSplit(20, []),
    /At least one participant is required/
  );
});

test('rejects an invalid expense amount', () => {
  assert.throws(
    () => calculateEqualSplit(0, ['user1']),
    /Expense amount must be greater than zero/
  );
});