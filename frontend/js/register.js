// ================================
// API BASE URL
// ================================

const API_BASE_URL = 'http://127.0.0.1:3000';

// ================================
// ELEMENTS
// ================================

const registerForm = document.getElementById('registerForm');

const usernameInput = document.getElementById('username');

const usernameMessage = document.getElementById('usernameMessage');

const formMessage = document.getElementById('formMessage');

// ================================
// LIVE USERNAME CHECK
// ================================

usernameInput.addEventListener('input', async () => {
  const username = usernameInput.value.trim();

  usernameMessage.textContent = '';

  usernameMessage.className = 'field-message';

  if (username.length < 3) {
    return;
  }

  usernameMessage.textContent = 'Checking username...';

  usernameMessage.classList.add('field-info');

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/check-username/${username}`);

    const data = await response.json();

    usernameMessage.textContent = data.message;

    if (data.available) {
      usernameMessage.classList.remove('field-info');

      usernameMessage.classList.add('field-success');
    } else {
      usernameMessage.classList.remove('field-info');

      usernameMessage.classList.add('field-error');
    }
  } catch (error) {
    usernameMessage.textContent = 'Unable to check username';

    usernameMessage.classList.add('field-error');
  }
});

// ================================
// REGISTER FORM SUBMIT
// ================================

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Form values
  const fullName = document.getElementById('fullName').value.trim();

  const username = document.getElementById('username').value.trim();

  const role = document.getElementById('role').value;

  const email = document.getElementById('email').value.trim();

  const password = document.getElementById('password').value;

  const confirmPassword = document.getElementById('confirmPassword').value;

  // Reset message
  formMessage.textContent = '';

  // Validation
  if (!fullName || !username || !role || !email || !password || !confirmPassword) {
    formMessage.textContent = 'Please fill all fields';

    formMessage.className = 'form-message field-error';

    return;
  }

  // Password match
  if (password !== confirmPassword) {
    formMessage.textContent = 'Passwords do not match';

    formMessage.className = 'form-message field-error';

    return;
  }

  // Password length
  if (password.length < 6) {
    formMessage.textContent = 'Password must be at least 6 characters';

    formMessage.className = 'form-message field-error';

    return;
  }

  // Register API
  try {
    const response = await fetch(`${API_BASE_URL}api/auth/register`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        full_name: fullName,
        username: username,
        role: role,
        gmail: email,
        password: password,
      }),
    });

    const data = await response.json();

    // Success
    if (response.ok) {
      formMessage.textContent = 'Registration successful';

      formMessage.className = 'form-message field-success';

      // Redirect
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      formMessage.textContent = data.detail || data.message || 'Registration failed';

      formMessage.className = 'form-message field-error';
    }
  } catch (error) {
    formMessage.textContent = 'Server connection failed';

    formMessage.className = 'form-message field-error';
  }
});
