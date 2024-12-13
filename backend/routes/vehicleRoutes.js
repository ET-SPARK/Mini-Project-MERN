const express = require("express");
const Vehicle = require("../models/Vehicle");
const router = express.Router();

// Add a new vehicle
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;

    // Check if a vehicle with the same name already exists
    const existingVehicle = await Vehicle.findOne({ name });

    if (existingVehicle) {
      return res
        .status(400)
        .json({ message: "A vehicle with this name already exists!" });
    }

    // Create the new vehicle if no duplicate exists
    const vehicle = new Vehicle(req.body);
    await vehicle.save();

    // Set cookie after successfully adding a vehicle
    res.cookie("vehicle_added", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "None", // Cross-site cookie (important for Vercel deployments)
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a vehicle's status
router.put("/update/:id", async (req, res) => {
  try {
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

    // Set cookie after successfully updating a vehicle status
    res.cookie("status_updated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "None", // Cross-site cookie
    });

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
