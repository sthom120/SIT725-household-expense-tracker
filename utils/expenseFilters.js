const { isValidId } = require('./householdAccess');

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const parseDate = (value, endOfDay) => {
  if (!datePattern.test(value)) {
    throw new Error('Dates must use the format YYYY-MM-DD.');
  }

  const date = new Date(
    `${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`
  );

  if (Number.isNaN(date.getTime())) {
    throw new Error('Dates must use the format YYYY-MM-DD.');
  }

  return date;
};

const buildExpenseQuery = (householdId, filters = {}) => {
  const { category, startDate, endDate } = filters;
  const query = { household: householdId };

  if (category) {
    if (!isValidId(category)) {
      throw new Error('Invalid category.');
    }

    query.category = category;
  }

  if (startDate || endDate) {
    query.date = {};

    if (startDate) {
      query.date.$gte = parseDate(startDate, false);
    }

    if (endDate) {
      query.date.$lte = parseDate(endDate, true);
    }

    if (startDate && endDate && query.date.$gte > query.date.$lte) {
      throw new Error('Start date cannot be after end date.');
    }
  }

  return query;
};

module.exports = {
  buildExpenseQuery
};
