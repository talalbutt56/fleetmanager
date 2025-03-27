document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get username and password from the form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Send login credentials to the backend for validation
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();

  if (response.status === 200) {
    // Successful login
    document.getElementById("login-container").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("logged-in-as").textContent = `Logged in as: ${result.user.username}`;
    // You can store the user info in localStorage for persistence if needed
    localStorage.setItem("loggedInUser", JSON.stringify(result.user));
    renderVehicles(); // Render vehicles after successful login
  } else {
    // Invalid login
    document.getElementById("login-error").textContent = result.message;
    document.getElementById("login-error").style.display = "block";
  }
});

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  document.getElementById("login-container").style.display = "flex";
  document.getElementById("dashboard").style.display = "none";
});
