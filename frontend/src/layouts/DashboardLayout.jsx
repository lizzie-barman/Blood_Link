import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

export const DashboardLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-bg-main)' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Sidebar */}
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              zIndex: 'calc(var(--z-overlay) - 1)'
            }}
          />
        )}

        {/* Main Content Area */}
        <main
          className="dashboard-main"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-8)',
            backgroundColor: 'var(--color-bg-main)',
            position: 'relative'
          }}
        >
          {/* Mobile Sidebar Trigger button */}
          <div className="show-sm" style={{ marginBottom: 'var(--spacing-4)' }}>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}
            >
              <span>📂</span> Toggle Portal Menu
            </button>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
