import React from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children, user, onLogout }) {
  return (
    <div className="layout-root">
      <Sidebar user={user} onLogout={onLogout} />

      <main className="layout-content">
        <div className="content-container">
          {children}
        </div>
      </main>

      <style>{`
        .layout-root {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-primary); /* Darker gray background */
        }

        .layout-content {
          margin-left: 260px; /* Same as sidebar width */
          flex: 1;
          min-height: 100vh;
        }

        .content-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2.5rem;
        }

        @media (max-width: 1024px) {
          .content-container {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
