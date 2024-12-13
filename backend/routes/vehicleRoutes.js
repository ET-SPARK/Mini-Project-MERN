const express = require("express");
const Vehicle = require("../models/Vehicle");
const router = express.Router();

// Add a new vehicle
router.post("/add", async (req, res) => {
  try {
    // Destructure the name from the request body
    const { name } = req.body;

    // Check if a vehicle with the same name already exists
    const existingVehicle = await Vehicle.findOne({ name });

    if (existingVehicle) {
      // If a vehicle with the same name exists, return a 400 error
      return res
        .status(400)
        .json({ message: "A vehicle with this name already exists!" });
    }

    // If no duplicate exists, create the new vehicle
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a vehicle's status
router.put("/update/:id", async (req, res) => {
  try {
    // Find the vehicle by ID
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check if the status is the same as the current status
    if (vehicle.status === req.body.status) {
      return res
        .status(400)
        .json({ message: "Status is already set to this value" });
    }

    // Update the vehicle's status and last updated timestamp
    vehicle.status = req.body.status;
    vehicle.lastUpdated = Date.now();

    // Save the updated vehicle
    await vehicle.save();

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all vehicles
router.get("/all", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a vehicle
router.delete("/delete/:id", async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
