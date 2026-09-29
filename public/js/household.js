const householdForm = document.getElementById('householdForm');
const message = document.getElementById('message');

const dashboard = document.getElementById('dashboard');

const displayHouseholdName =
  document.getElementById('displayHouseholdName');

const displayHouseholdIdentifier =
  document.getElementById('displayHouseholdIdentifier');

const displayHouseholdId =
  document.getElementById('displayHouseholdId');

const memberList =
  document.getElementById('memberList');


householdForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const householdName =
    document.getElementById('householdName').value.trim();

  const householdIdentifier =
    document.getElementById('householdIdentifier').value.trim();

  const userId = localStorage.getItem('userId');

  if (!userId) {
    message.textContent =
      'Please register or log in before creating a household.';
    return;
  }

  try {

    // Create household
    const response = await fetch('/households', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        householdName,
        householdIdentifier,
        creatorId: userId
      })
    });

    const data = await response.json();

    message.textContent = data.message;

    if (!response.ok) {
      return;
    }

    householdForm.reset();

    // Get the newly created household ID
    const householdId = data.household._id;

    // Save household ID so it can be loaded automatically later
    localStorage.setItem('householdId', householdId);

    // Retrieve the household information
    const householdResponse =
      await fetch(`/households/${householdId}`);

    const household =
      await householdResponse.json();

    if (!householdResponse.ok) {
      message.textContent =
        'Household was created but could not be retrieved.';
      return;
    }

    // Display household information
    displayHouseholdName.textContent =
      household.householdName;

    displayHouseholdIdentifier.textContent =
      household.householdIdentifier;

    displayHouseholdId.textContent =
      household._id;

    // Clear existing members
    memberList.innerHTML = '';

    // Display members
    if (household.members && household.members.length > 0) {

      household.members.forEach((member) => {

        const listItem =
          document.createElement('li');

        listItem.className = 'collection-item';

        const userName =
          member.user?.name || 'Unknown user';

        const userEmail =
          member.user?.email || '';

        const relationship =
          member.relationship || 'member';

        listItem.textContent =
          `${userName} (${userEmail}) - ${relationship}`;

        memberList.appendChild(listItem);
      });

    } else {

      const listItem =
        document.createElement('li');

      listItem.className = 'collection-item';

      listItem.textContent =
        'No household members found.';

      memberList.appendChild(listItem);
    }

    // Show dashboard
    dashboard.style.display = 'block';

    // Load balance summary
    loadBalanceSummary(householdId);

  } catch (error) {

    console.error(error);

    message.textContent =
      'Unable to connect to the server.';
  }
});


async function loadBalanceSummary(householdId) {

  const balanceMessage =
    document.getElementById('balanceMessage');

  const balanceTableBody =
    document.getElementById('balanceTableBody');

  if (!balanceMessage || !balanceTableBody) {
    return;
  }

  try {

    const response = await fetch(
      `/expenses/household/${householdId}/balances`
    );

    const data = await response.json();

    if (!response.ok) {
      balanceMessage.textContent =
        data.message || 'Unable to load balance summary.';
      return;
    }

    balanceTableBody.innerHTML = '';

    if (!data.balances || data.balances.length === 0) {

      balanceMessage.textContent =
        'No household members found.';

      return;
    }

    balanceMessage.textContent = '';

    data.balances.forEach((member) => {

      const row = document.createElement('tr');

      row.innerHTML = `
        <td>
          ${member.name}
          <br>
          <small>${member.email}</small>
        </td>

        <td>
          $${member.totalPaid.toFixed(2)}
        </td>

        <td>
          $${member.balance.toFixed(2)}
        </td>
      `;

      balanceTableBody.appendChild(row);
    });

  } catch (error) {

    console.error(
      'Error loading balance summary:',
      error
    );

    balanceMessage.textContent =
      'Unable to connect to the server.';
  }
}
async function loadSavedHousehold() {
  const householdId = localStorage.getItem('householdId');

  if (!householdId) {
    return;
  }

  try {
    const response = await fetch(`/households/${householdId}`);
    const household = await response.json();

    if (!response.ok) {
      return;
    }

    displayHouseholdName.textContent =
      household.householdName;

    displayHouseholdIdentifier.textContent =
      household.householdIdentifier;

    displayHouseholdId.textContent =
      household._id;

    memberList.innerHTML = '';

    if (household.members && household.members.length > 0) {

      household.members.forEach((member) => {

        const listItem = document.createElement('li');

        listItem.className = 'collection-item';

        const userName =
          member.user?.name || 'Unknown user';

        const userEmail =
          member.user?.email || '';

        const relationship =
          member.relationship || 'member';

        listItem.textContent =
          `${userName} (${userEmail}) - ${relationship}`;

        memberList.appendChild(listItem);
      });

    }

    dashboard.style.display = 'block';

    // Load balance automatically
    loadBalanceSummary(householdId);

  } catch (error) {

    console.error(
      'Error loading saved household:',
      error
    );
  }
}

loadSavedHousehold();