import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Credit from "./components/credit";
import Login from "./login";
import Signup from "./signup";
import Dashboard from "./dashboard";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* Sign-Up Page */}
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard (Redirects if not logged in) */}
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
        <Route path="/credit" element={<Credit totalSpent={100} totalBudget={500} />} />


      </Routes>
    </Router>
  );
};

export default App;
