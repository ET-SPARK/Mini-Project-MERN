import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert"; // Import the confirmAlert function
import "react-confirm-alert/src/react-confirm-alert.css"; // Import styles for the modal

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null); // Track the vehicle being edited

  // Fetch all vehicles
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        "https://mini-project-mern.onrender.com/api/vehicles/all"
      );
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Enable edit mode
  const handleEdit = (id) => {
    setEditingVehicle(id); // Enable editing for this vehicle
  };

  // Update the vehicle's status
  const handleUpdate = async (id, newStatus) => {
    try {
      console.log(`Updating vehicle with ID: ${id} to status: ${newStatus}`);

      const response = await axios.put(
        `https://mini-project-mern.onrender.com/api/vehicles/update/${id}`,
        { status: newStatus }
      );

      console.log("Server response:", response.data);

      if (response.data.status === newStatus) {
        // Status updated successfully
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle._id === id
              ? {
                  ...vehicle,
                  status: response.data.status,
                  lastUpdated: response.data.lastUpdated,
                }
              : vehicle
          )
        );

        toast.success(
          `🚗 Vehicle status updated to "${response.data.status}"!`
        );
        setEditingVehicle(null); // Exit edit mode
      } else {
        // Status didn't change because it's the same
        toast.info("ℹ️ Vehicle status is already set to this value.");
      }
    } catch (error) {
      console.error("Error updating vehicle status:", error);

      // Show error toast
      if (error.response && error.response.status === 400) {
        toast.info("ℹ️ Vehicle status is already set to this value.");
      } else {
        toast.error("❌ Failed to update vehicle status!");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      confirmAlert({
        title: "Confirm Deletion",
        message: "Are you sure you want to delete this vehicle?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              try {
                const response = await axios.delete(
                  `https://mini-project-mern.onrender.com/api/vehicles/delete/${id}`
                );
                setVehicles((prevVehicles) =>
                  prevVehicles.filter((vehicle) => vehicle._id !== id)
                );
                toast.success("🚗 Vehicle deleted successfully!");
              } catch (error) {
                console.error("Error deleting vehicle:", error);
                toast.error("❌ Failed to delete vehicle. Please try again.");
              }
            },
          },
          {
            label: "No",
            onClick: () => {
              // Do nothing on 'No'
            },
          },
        ],
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("❌ Failed to delete vehicle. Please try again.");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Vehicle Dashboard</h1>
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Vehicle Name</th>
            <th className="border border-gray-400 p-2">Status</th>
            <th className="border border-gray-400 p-2">Last Updated</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td className="border border-gray-400 p-2">{vehicle.name}</td>
              <td className="border border-gray-400 p-2">
                {/* Show dropdown only when editing */}
                {editingVehicle === vehicle._id ? (
                  <select
                    value={vehicle.status}
                    onChange={(e) =>
                      setVehicles((prevVehicles) =>
                        prevVehicles.map((v) =>
                          v._id === vehicle._id
                            ? { ...v, status: e.target.value }
                            : v
                        )
                      )
                    }
                    className="border p-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                ) : (
                  vehicle.status // Show plain text when not editing
                )}
              </td>
              <td className="border border-gray-400 p-2">
                {new Date(vehicle.lastUpdated).toLocaleString()}
              </td>
              <td className="border border-gray-400 p-2">
                {editingVehicle === vehicle._id ? (
                  <button
                    onClick={() => handleUpdate(vehicle._id, vehicle.status)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Update
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(vehicle._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
