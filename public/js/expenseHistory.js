const categoryFilter = document.getElementById('categoryFilter');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const expenseList = document.getElementById('expenseList');
const message = document.getElementById('message');

const params = new URLSearchParams(window.location.search);
const householdId = params.get('householdId');
const userId = localStorage.getItem('userId');

const loadCategories = async () => {
  try {
    const response = await fetch('/api/expense-categories');
    const categories = await response.json();

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category._id;
      option.textContent = category.name;
      categoryFilter.appendChild(option);
    });
  } catch (error) {
    message.textContent = 'Unable to load categories.';
  }

  M.FormSelect.init(categoryFilter);
};

const renderExpenses = (expenses) => {
  expenseList.innerHTML = '';

  if (expenses.length === 0) {
    message.textContent = 'No expenses match the selected filters.';
    return;
  }

  expenses.forEach((expense) => {
    const row = document.createElement('tr');

    const values = [
      new Date(expense.date).toLocaleDateString(),
      expense.description,
      expense.category ? expense.category.name : '',
      `$${expense.amount.toFixed(2)}`,
      expense.payer ? expense.payer.name : ''
    ];

    values.forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });

    expenseList.appendChild(row);
  });
};

const loadExpenses = async () => {
  message.textContent = '';
  expenseList.innerHTML = '';

  if (!householdId) {
    message.textContent = 'A household ID is required.';
    return;
  }

  if (!userId) {
    message.textContent = 'Please register before viewing expenses.';
    return;
  }

  const query = new URLSearchParams({ userId });

  if (categoryFilter.value) {
    query.set('category', categoryFilter.value);
  }

  if (startDate.value) {
    query.set('startDate', startDate.value);
  }

  if (endDate.value) {
    query.set('endDate', endDate.value);
  }

  try {
    const response = await fetch(
      `/api/expenses/household/${householdId}?${query.toString()}`
    );
    const data = await response.json();

    if (!response.ok) {
      message.textContent =
        data.message || 'Unable to load expense history.';
      return;
    }

    renderExpenses(data);
  } catch (error) {
    message.textContent = 'Unable to connect to the server.';
  }
};

document
  .getElementById('applyFiltersButton')
  .addEventListener('click', loadExpenses);

document
  .getElementById('clearFiltersButton')
  .addEventListener('click', () => {
    categoryFilter.value = '';
    M.FormSelect.init(categoryFilter);
    startDate.value = '';
    endDate.value = '';
    loadExpenses();
  });

loadCategories().then(loadExpenses);
