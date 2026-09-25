const participantList = document.getElementById('participantList');
const message = document.getElementById('message');
const splitResult = document.getElementById('splitResult');
const calculateSplitButton =
  document.getElementById('calculateSplitButton');

const getHouseholdId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('householdId');
};

const renderParticipants = (members) => {
  participantList.innerHTML = '';

  if (!members || members.length === 0) {
    message.textContent = 'No household members are available.';
    return;
  }

  members.forEach((member) => {
    if (!member.user) {
      return;
    }

    const wrapper = document.createElement('p');
    const label = document.createElement('label');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'participant-checkbox';
    checkbox.value = member.user._id;
    checkbox.dataset.name = member.user.name;

    const name = document.createElement('span');
    name.textContent = member.user.name;

    label.appendChild(checkbox);
    label.appendChild(name);
    wrapper.appendChild(label);

    participantList.appendChild(wrapper);
  });
};

const getSelectedParticipantIds = () => {
  return Array.from(
    document.querySelectorAll('.participant-checkbox:checked')
  ).map((checkbox) => checkbox.value);
};

const loadHouseholdMembers = async () => {
  const householdId = getHouseholdId();

  if (!householdId) {
    message.textContent =
      'A household ID is required to load household members.';
    return;
  }

  try {
    const response = await fetch(`/households/${householdId}`);
    const household = await response.json();

    if (!response.ok) {
      message.textContent =
        household.message || 'Unable to load household.';
      return;
    }

    renderParticipants(household.members);
  } catch (error) {
    message.textContent = 'Unable to connect to the server.';
  }
};

calculateSplitButton.addEventListener('click', async () => {
  const amount = Number(
    document.getElementById('expenseAmount').value
  );

  const selectedCheckboxes = Array.from(
    document.querySelectorAll('.participant-checkbox:checked')
  );

  const participantIds = getSelectedParticipantIds();

  splitResult.innerHTML = '';
  message.textContent = '';

  if (!amount || amount <= 0) {
    message.textContent = 'Please enter a valid expense amount.';
    return;
  }

  if (participantIds.length === 0) {
    message.textContent = 'Please select at least one participant.';
    return;
  }

  try {
    const response = await fetch('/api/expense-splits/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        participantIds
      })
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent =
        data.message || 'Unable to calculate expense split.';
      return;
    }

    data.participants.forEach((participant) => {
      const checkbox = selectedCheckboxes.find(
        (item) => item.value === participant.user
      );

      const row = document.createElement('p');

      row.textContent =
        `${checkbox.dataset.name}: $${participant.share.toFixed(2)}`;

      splitResult.appendChild(row);
    });
  } catch (error) {
    message.textContent = 'Unable to connect to the server.';
  }
});

loadHouseholdMembers();