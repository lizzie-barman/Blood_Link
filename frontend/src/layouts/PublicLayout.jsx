import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export const PublicLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-main)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: 'var(--spacing-8) 0' }}>
        <div className="container">
          {children || <Outlet />}
        </div>
      </main>

      <footer
        id="about"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderTop: '1px solid var(--color-border)',
          padding: 'var(--spacing-8) 0',
          marginTop: 'auto',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)'
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-6)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <span style={{ fontSize: '1.4rem' }}>🩸</span>
              <strong style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>BloodLink Healthcare</strong>
            </div>
            <p style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-relaxed)' }}>
              Emergency blood coordination network bridging accredited hospitals, regional blood repositories, and voluntary donors within minutes.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>
              Direct Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)' }}>
              <li><Link to="/search-blood">Public Blood Inventory Search</Link></li>
              <li><Link to="/donor">Donor Dashboard & Alerts</Link></li>
              <li><Link to="/hospital">Hospital Requisition Desk</Link></li>
              <li><Link to="/bloodbank">Blood Bank Inventory Manager</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>
              Emergency Notice
            </h4>
            <p style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-relaxed)' }}>
              For immediate critical transfusion dispatches, verify requirements with your attending medical officer.
            </p>
            <div style={{ marginTop: 'var(--spacing-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              © {new Date().getFullYear()} BloodLink Network. Prepared for Node/Express integration.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
