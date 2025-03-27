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

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('fleetmanager');
    const vehiclesCollection = db.collection('vehicles');

    // Route to get vehicle data from MongoDB
    app.get('/api/vehicles', async (req, res) => {
      const vehicles = await vehiclesCollection.find({}).toArray();
      res.json(vehicles);
    });

    // Route to update vehicle data
    app.put('/api/vehicles/:id', async (req, res) => {
      const vehicleId = req.params.id;
      const updatedData = req.body; // Updated vehicle data
      await vehiclesCollection.updateOne({ _id: vehicleId }, { $set: updatedData });
      res.send('Vehicle updated');
    });
  })
  .catch(err => console.error(err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

