const joinHouseholdForm = document.getElementById('joinHouseholdForm');
const message = document.getElementById('message');

joinHouseholdForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const householdIdentifier =
    document.getElementById('householdIdentifier').value.trim();
  const userId = localStorage.getItem('userId');

  if (!userId) {
    message.textContent = 'Please register before joining a household.';
    return;
  }

  try {
    const response = await fetch('/households/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        householdIdentifier,
        userId
      })
    });

    const data = await response.json();

    message.textContent = data.message;

    if (response.ok) {
      window.location.href =
        `household-dashboard.html?householdId=${data.householdId}`;
    }

  } catch (error) {
    message.textContent = 'Unable to connect to the server.';
  }
});
