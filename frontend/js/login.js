// ================================
// API BASE URL
// ================================

const API_BASE_URL = 'http://127.0.0.1:3000';

// ================================
// ELEMENTS
// ================================

const loginForm = document.getElementById('loginForm');

const loginMessage = document.getElementById('loginMessage');

// ================================
// LOGIN SUBMIT
// ================================

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Form values
  const identifier = document.getElementById('loginIdentifier').value.trim();

  const role = document.getElementById('loginRole').value;

  const password = document.getElementById('loginPassword').value;

  // Reset
  loginMessage.textContent = '';

  // Validation
  if (!identifier || !role || !password) {
    loginMessage.textContent = 'Please fill all fields';

    loginMessage.className = 'form-message field-error';

    return;
  }

  // Login API
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        identifier: identifier,
        role: role,
        password: password,
      }),
    });

    const data = await response.json();

    // Success
    if (response.ok) {
      loginMessage.textContent = 'Login successful';

      loginMessage.className = 'form-message field-success';

      // Save token
      localStorage.setItem('access_token', data.access_token);

      localStorage.setItem('user_role', data.role);

      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect by role
      setTimeout(() => {
        if (data.role === 'student') {
          window.location.href = 'student-dashboard.html';
        } else if (data.role === 'teacher') {
          window.location.href = 'teacher-dashboard.html';
        } else {
          window.location.href = 'admin-dashboard.html';
        }
      }, 1200);
    } else {
      loginMessage.textContent = data.detail || 'Invalid credentials';

      loginMessage.className = 'form-message field-error';
    }
  } catch (error) {
    loginMessage.textContent = 'Server connection failed';

    loginMessage.className = 'form-message field-error';
  }
});
