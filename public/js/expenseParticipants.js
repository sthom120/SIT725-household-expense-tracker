const participantList = document.getElementById('participantList');
const message = document.getElementById('message');

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

    wrapper.innerHTML = `
      <label>
        <input
          type="checkbox"
          class="participant-checkbox"
          value="${member.user._id}"
        >
        <span>${member.user.name}</span>
      </label>
    `;

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

loadHouseholdMembers();