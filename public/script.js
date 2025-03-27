async function fetchVehicles() {
  const response = await fetch('/api/vehicles');
  const vehicles = await response.json();
  renderVehicles(vehicles);
}

function renderVehicles(vehicles) {
  const vehicleList = document.getElementById('vehicle-list');
  vehicleList.innerHTML = ''; // Clear the list

  vehicles.forEach(vehicle => {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.innerHTML = `
      <h3>${vehicle.name}</h3>
      <p>Status: ${vehicle.status}</p>
      <p>KM: ${vehicle.km}</p>
      <p>Oil Change Due: ${vehicle.oilChangeDue}</p>
    `;
    vehicleList.appendChild(card);
  });
}

fetchVehicles();

