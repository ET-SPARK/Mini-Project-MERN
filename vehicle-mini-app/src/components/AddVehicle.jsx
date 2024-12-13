import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddVehicle = ({ onVehicleAdded }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/vehicles/add",
        { name }
      );
      toast.success("🚗 New vehicle added successfully!");
      onVehicleAdded(response.data); // Notify parent to refresh the list
      setName("");
    } catch (error) {
      console.error("Error adding vehicle:", error);

      // Handle duplicate vehicle name error
      if (error.response && error.response.status === 400) {
        toast.error("❌ A vehicle with this name already exists!");
      } else {
        toast.error("❌ Error adding vehicle!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Vehicle Name"
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Vehicle
      </button>
      <ToastContainer />
    </form>
  );
};

export default AddVehicle;
