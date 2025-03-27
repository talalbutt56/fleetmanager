const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));
app.use(express.json());  // To parse incoming JSON data

// MongoDB connection URL from .env file
const uri = process.env.MONGO_URI;

let db;
let usersCollection;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('fleetmanager');
    usersCollection = db.collection('users'); // Assuming you have a collection for users
    vehiclesCollection = db.collection('vehicles');
  })
  .catch(err => console.error(err));

// Endpoint to handle login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await usersCollection.findOne({ username });

  if (user && user.password === password) {
    // Login successful
    res.status(200).json({ message: 'Login successful', user });
  } else {
    // Invalid credentials
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Endpoint to get vehicle data from MongoDB
app.get('/api/vehicles', async (req, res) => {
  const vehicles = await vehiclesCollection.find({}).toArray();
  res.json(vehicles);
});

// Route to update vehicle data
app.put('/api/vehicles/:id', async (req, res) => {
  const vehicleId = req.params.id;
  const updatedData = req.body;
  await vehiclesCollection.updateOne({ _id: vehicleId }, { $set: updatedData });
  res.send('Vehicle updated');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
