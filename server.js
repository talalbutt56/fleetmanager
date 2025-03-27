const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();  // To read environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static('public'));
app.use(express.json());  // To parse incoming JSON data

// MongoDB connection URL from .env file (mongodb+srv:// format for Atlas)
const uri = process.env.MONGO_URI;

let db;
let usersCollection;
let vehiclesCollection;

// Connect to MongoDB Atlas
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB Atlas');
    db = client.db('fleetmanager');  // Use 'fleetmanager' database
    usersCollection = db.collection('users');  // Users collection for login
    vehiclesCollection = db.collection('vehicles');  // Vehicles collection for fleet data
  })
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Endpoint to handle user login (POST)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;  // Get username and password from request body

  try {
    // Find the user by username in the users collection
    const user = await usersCollection.findOne({ username });

    // Check if the user exists and the password matches
    if (user && user.password === password) {
      // If login is successful, return user data
      res.status(200).json({ message: 'Login successful', user });
    } else {
      // If login fails, return an error message
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Endpoint to get vehicle data from MongoDB (GET)
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await vehiclesCollection.find({}).toArray();  // Fetch all vehicles from the database
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve vehicles', error: err });
  }
});

// Endpoint to update vehicle data (PUT)
app.put('/api/vehicles/:id', async (req, res) => {
  const vehicleId = req.params.id;
  const updatedData = req.body;  // Get the updated vehicle data from request body

  try {
    await vehiclesCollection.updateOne({ _id: vehicleId }, { $set: updatedData });  // Update the vehicle
    res.send('Vehicle updated');
  } catch (err) {
    res.status(500).json({ message: 'Failed to update vehicle', error: err });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
