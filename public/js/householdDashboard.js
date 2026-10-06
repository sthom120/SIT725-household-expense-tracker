const householdName = document.getElementById('householdName');
const householdIdentifier = document.getElementById('householdIdentifier');
const memberList = document.getElementById('memberList');
const message = document.getElementById('message');

const loadDashboard = async () => {
  const params = new URLSearchParams(window.location.search);
  const householdId = params.get('householdId');
  const userId = localStorage.getItem('userId');

  if (!householdId) {
    message.textContent = 'A household ID is required.';
    return;
  }

  if (!userId) {
    message.textContent = 'Please register before viewing a household.';
    return;
  }

  try {
    const response = await fetch(
      `/households/${householdId}/dashboard?userId=${userId}`
    );
    const household = await response.json();

    if (!response.ok) {
      message.textContent =
        household.message || 'Unable to load household.';
      return;
    }

    householdName.textContent = household.householdName;
    householdIdentifier.textContent =
      `Household identifier: ${household.householdIdentifier}`;

    memberList.innerHTML = '';

    household.members.forEach((member) => {
      if (!member.user) {
        return;
      }

      const item = document.createElement('li');
      item.className = 'collection-item';
      item.textContent = `${member.user.name} (${member.user.email})`;

      memberList.appendChild(item);
    });
  } catch (error) {
    message.textContent = 'Unable to connect to the server.';
  }
};

loadDashboard();
