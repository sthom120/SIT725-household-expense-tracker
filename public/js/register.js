const registrationForm = document.getElementById('registrationForm');
const message = document.getElementById('message');

registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();

    message.textContent = data.message;

    if (response.ok) {
      registrationForm.reset();
    }

  } catch (error) {
    message.textContent = 'Unable to connect to the server.';
  }
});