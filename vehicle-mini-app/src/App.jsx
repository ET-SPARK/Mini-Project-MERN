import React, { useState } from "react";
import VehicleTable from "./components/VehicleTable";
import AddVehicle from "./components/AddVehicle";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const handleVehicleAdded = () => setRefresh((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <AddVehicle onVehicleAdded={handleVehicleAdded} />
      <VehicleTable key={refresh} />
      <ToastContainer />
    </div>
  );
};

export default App;
