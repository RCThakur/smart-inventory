// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Inventory from "./pages/Inventory";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inventory" />} />
      <Route path="/inventory" element={<Inventory />} />
      {/* You can add more pages later here like Reports, Dashboard, etc */}
    </Routes>
  );
};

export default App;
