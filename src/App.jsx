import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Portfolio from './pages/Portfolio';
import Cashflow from './pages/Cashflow';
import Reports from './pages/Reports';
import MainLayout from './components/MainLayout';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ordenfi_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('ordenfi_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ordenfi_user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />

        {/* Protected Routes with Sidebar Layout */}
        <Route
          path="/dashboard"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Dashboard /></MainLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/portfolio"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Portfolio /></MainLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/cashflow"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Cashflow /></MainLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Reports /></MainLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Admin /></MainLayout> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
