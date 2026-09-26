import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBloodLink } from '../../hooks/useSocket';

export const Sidebar = ({ isOpen = false, onClose }) => {
  const { currentRole, notifications } = useBloodLink();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getStoredRole = () => {
    try {
      const storedUser = localStorage.getItem('bloodlink_user');

      if (!storedUser) {
        return '';
      }

      const user = JSON.parse(storedUser);

      return String(user?.role || '')
        .toLowerCase()
        .replace('_', '');
    } catch {
      return '';
    }
  };

  const role =
    getStoredRole() ||
    String(currentRole || '')
      .toLowerCase()
      .replace('_', '');

  const getNavItems = () => {
    switch (role) {
      case 'hospital':
        return [
          {
            to: '/hospital',
            label: 'Hospital Hub',
            icon: '🏥',
            end: true
          },
          {
            to: '/hospital/create-request',
            label: 'Create Request',
            icon: '🚨'
          },
          {
            to: '/hospital/requests',
            label: 'Blood Requests',
            icon: '📋'
          },
          {
            to: '/search-blood',
            label: 'Search Blood Banks',
            icon: '🔍'
          },
          {
            to: '/notifications',
            label: 'Alerts & Messages',
            icon: '🔔',
            badge: unreadCount
          }
        ];

      case 'bloodbank':
        return [
          {
            to: '/bloodbank',
            label: 'Overview',
            icon: '📊',
            end: true
          },
          {
            to: '/bloodbank/inventory',
            label: 'Stock & Inventory',
            icon: '🩸'
          },
          {
            to: '/bloodbank/requests',
            label: 'Dispatches & Requests',
            icon: '🚚'
          },
          {
            to: '/search-blood',
            label: 'Network Search',
            icon: '🔍'
          },
          {
            to: '/notifications',
            label: 'Alerts',
            icon: '🔔',
            badge: unreadCount
          },
          {
            to: '/bloodbank/profile',
            label: 'Facility Profile',
            icon: '🏢'
          }
        ];

      case 'donor':
      default:
        return [
          {
            to: '/donor',
            label: 'Donor Overview',
            icon: '📊',
            end: true
          },
          {
            to: '/donor/requests',
            label: 'Emergency Requests',
            icon: '🚨'
          },
          {
            to: '/donor/history',
            label: 'Donation History',
            icon: '📜'
          },
          {
            to: '/notifications',
            label: 'Alerts & Matches',
            icon: '🔔',
            badge: unreadCount
          },
          {
            to: '/donor/profile',
            label: 'Health Profile',
            icon: '👤'
          }
        ];
    }
  };

  const navItems = getNavItems();

  const portalName =
    role === 'bloodbank'
      ? 'Blood Bank Desk'
      : role === 'hospital'
        ? 'Hospital Care Desk'
        : 'Donor Portal';

  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : ''}`}
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-border)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--spacing-6) var(--spacing-4)',
        gap: 'var(--spacing-2)'
      }}
    >
      <div
        style={{
          padding: '0 var(--spacing-3) var(--spacing-4)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 'var(--spacing-2)'
        }}
      >
        <div
          style={{
            fontSize: 'var(--font-size-xs)',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.05em'
          }}
        >
          Portal Mode
        </div>

        <div
          style={{
            fontSize: 'var(--font-size-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
            marginTop: '2px'
          }}
        >
          {portalName}
        </div>
      </div>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-1)',
          flex: 1
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span
              style={{
                fontSize: '1.2rem',
                lineHeight: 1
              }}
            >
              {item.icon}
            </span>

            <span style={{ flex: 1 }}>
              {item.label}
            </span>

            {item.badge > 0 && (
              <span
                className="badge badge-danger"
                style={{
                  fontSize: '10px'
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          marginTop: 'auto',
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-bg-muted)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div
          style={{
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)'
          }}
        >
          🚨 Emergency Hotline
        </div>

        <div style={{ marginTop: '2px' }}>
          Toll Free: 1800-BLOOD-LINK
        </div>

        <div
          style={{
            fontSize: '10px',
            color: 'var(--color-text-muted)',
            marginTop: '2px'
          }}
        >
          Available 24/7 for urgent matching
        </div>
      </div>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--radius-lg);
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          transition: all var(--transition-fast);
        }

        .sidebar-link:hover {
          background-color: var(--color-bg-muted);
          color: var(--color-text-primary);
        }

        .sidebar-link.active {
          background-color: var(--color-primary-50);
          color: var(--color-primary);
          font-weight: var(--font-weight-semibold);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;