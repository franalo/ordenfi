import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, PieChart, TrendingUp, BarChart3,
  Settings, LogOut, ShieldCheck
} from 'lucide-react';
import { db } from '../lib/db';

export default function Sidebar({ user, onLogout }) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <PieChart size={20} />, label: 'Portafolio', path: '/portfolio' },
    { icon: <TrendingUp size={20} />, label: 'Cashflow', path: '/cashflow' },
    { icon: <BarChart3 size={20} />, label: 'Reportes', path: '/reports' },
    { icon: <Settings size={20} />, label: 'Admin', path: '/admin' },
  ];

  return (
    <aside className="main-sidebar">
      <div className="brand">
        <div className="logo-mini">
          <ShieldCheck size={20} color="white" />
        </div>
        <h2>ORDENFI_</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile card">
          <div className="avatar">
            {user?.name?.substring(0, 1).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <span className="name">{user?.name || 'Usuario'}</span>
            <span className="role">{user?.email || 'Premium'}</span>
          </div>
        </div>

        <button className="logout-button" onClick={onLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <style>{`
        .main-sidebar {
          width: 260px;
          background: #fff;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 100;
          box-shadow: 4px 0 15px rgba(0,0,0,0.02);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 3rem;
          padding: 0 0.5rem;
        }

        .logo-mini {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--vibrant-blue), var(--vibrant-violet));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }

        .brand h2 {
          font-size: 1.25rem;
          color: var(--text-primary);
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: var(--bg-card);
          color: var(--vibrant-blue);
        }

        .nav-item.active {
          background: rgba(37, 99, 235, 0.1);
          color: var(--vibrant-blue);
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.75rem;
          background: #fff;
          border-color: var(--border);
          box-shadow: var(--shadow-sm);
        }

        .avatar {
          width: 38px;
          height: 38px;
          background: var(--bg-primary);
          color: var(--text-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          border: 1px solid var(--border);
        }

        .user-info {
           display: flex;
           flex-direction: column;
           overflow: hidden;
        }

        .user-info .name {
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 700;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .user-info .role {
          color: var(--text-muted);
          font-size: 0.7rem;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-muted);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .logout-button:hover {
          background: rgba(219, 39, 119, 0.05);
          color: var(--vibrant-pink);
        }
      `}</style>
    </aside>
  );
}
