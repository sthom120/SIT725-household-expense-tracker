const householdForm = document.getElementById('householdForm');
const message = document.getElementById('message');

householdForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const householdName = document.getElementById('householdName').value.trim();
  const householdIdentifier =
    document.getElementById('householdIdentifier').value.trim();

  try {
    const response = await fetch('/households', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        householdName,
        householdIdentifier,
        members: []
      })
    });

    const data = await response.json();

    message.textContent = data.message;

    if (response.ok) {
      householdForm.reset();
    }

  } catch (error) {
    message.textContent = 'Unable to connect to the server.';
  }
});