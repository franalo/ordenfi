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

import { db } from './lib/db';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // 1. Initial Session Check
    async function checkUser() {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } else {
        const saved = localStorage.getItem('ordenfi_user');
        if (saved) setUser(JSON.parse(saved));
      }
      setInitializing(false);
    }
    checkUser();

    // 2. Listen for Auth Changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    if (!supabase) {
      localStorage.setItem('ordenfi_user', JSON.stringify(userData));
    }
  };

  const handleLogout = async () => {
    await db.logout();
    setUser(null);
    localStorage.removeItem('ordenfi_user');
  };

  if (initializing) return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', color: '#3b82f6', fontWeight: 'bold'
    }}>
      ORDENFI_ INICIANDO...
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
        />

        {/* Protected Routes with Sidebar Layout */}
        <Route
          path="/dashboard"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Dashboard /></MainLayout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/portfolio"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Portfolio /></MainLayout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/cashflow"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Cashflow /></MainLayout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reports"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Reports /></MainLayout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={user ? <MainLayout user={user} onLogout={handleLogout}><Admin /></MainLayout> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
