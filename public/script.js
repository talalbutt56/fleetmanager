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
async function renderVehicles() {
  try {
    const response = await fetch('/api/vehicles');
    const vehicles = await response.json();
    
    const vehicleList = document.getElementById('vehicle-list');
    vehicleList.innerHTML = ''; // Clear existing content
    
    vehicles.forEach(vehicle => {
      const vehicleCard = document.createElement('div');
      vehicleCard.className = 'vehicle-card';
      vehicleCard.innerHTML = `
        <h3>${vehicle.vehicleNumber}</h3>
        <p>Status: ${vehicle.status}</p>
        <p>Last Maintenance: ${vehicle.lastMaintenance || 'N/A'}</p>
        <p>Mileage: ${vehicle.mileage || '0'} miles</p>
        <button class="update-btn" data-id="${vehicle._id}">Update Status</button>
      `;
      vehicleList.appendChild(vehicleCard);
    });
  } catch (error) {
    console.error('Error loading vehicles:', error);
  }
}
