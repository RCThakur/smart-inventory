// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Inventory from "./pages/Inventory";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/AddItem" element={<Navigate to="/Inventory" />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
  );
};

export default App;
