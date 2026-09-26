import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import { useBloodLink } from '../../hooks/useSocket';

export const Navbar = () => {
  const { currentRole, notifications } = useBloodLink();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isPublic =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/search-blood';

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

  const handleLogout = () => {
    localStorage.removeItem('bloodlink_token');
    localStorage.removeItem('bloodlink_user');
    window.location.href = '/login';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const renderNavLinks = () => {
    if (isPublic) {
      return (
        <>
          <NavLink
            to="/search-blood"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Find Blood
          </NavLink>

          <a
            href="#about"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              closeMobileMenu();

              navigate('/');

              setTimeout(() => {
                const el = document.getElementById('how-it-works');

                if (el) {
                  el.scrollIntoView({
                    behavior: 'smooth'
                  });
                }
              }, 100);
            }}
          >
            About
          </a>
        </>
      );
    }

    if (role === 'hospital') {
      return (
        <>
          <NavLink
            to="/hospital"
            end
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/hospital/create-request"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Create Request
          </NavLink>

          <NavLink
            to="/hospital/requests"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Requests
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Notifications
            {unreadCount > 0 && (
              <span
                className="badge badge-danger"
                style={{
                  fontSize: '10px',
                  marginLeft: '4px'
                }}
              >
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/search-blood"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Find Blood
          </NavLink>
        </>
      );
    }

    if (role === 'bloodbank') {
      return (
        <>
          <NavLink
            to="/bloodbank"
            end
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/bloodbank/inventory"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Inventory
          </NavLink>

          <NavLink
            to="/bloodbank/requests"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Requests
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Notifications
            {unreadCount > 0 && (
              <span
                className="badge badge-danger"
                style={{
                  fontSize: '10px',
                  marginLeft: '4px'
                }}
              >
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/bloodbank/profile"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMobileMenu}
          >
            Profile
          </NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink
          to="/donor"
          end
          className={({ isActive }) =>
            `navbar-link ${isActive ? 'active' : ''}`
          }
          onClick={closeMobileMenu}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/donor/requests"
          className={({ isActive }) =>
            `navbar-link ${isActive ? 'active' : ''}`
          }
          onClick={closeMobileMenu}
        >
          Emergency Requests
        </NavLink>

        <NavLink
          to="/donor/history"
          className={({ isActive }) =>
            `navbar-link ${isActive ? 'active' : ''}`
          }
          onClick={closeMobileMenu}
        >
          History
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `navbar-link ${isActive ? 'active' : ''}`
          }
          onClick={closeMobileMenu}
        >
          Notifications
          {unreadCount > 0 && (
            <span
              className="badge badge-danger"
              style={{
                fontSize: '10px',
                marginLeft: '4px'
              }}
            >
              {unreadCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/donor/profile"
          className={({ isActive }) =>
            `navbar-link ${isActive ? 'active' : ''}`
          }
          onClick={closeMobileMenu}
        >
          Profile
        </NavLink>
      </>
    );
  };

  return (
    <header
      className="navbar"
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--spacing-6)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)'
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            textDecoration: 'none'
          }}
        >
          <span
            style={{
              fontSize: '1.6rem',
              lineHeight: 1
            }}
          >
            🩸
          </span>

          <span
            style={{
              fontWeight: 'var(--font-weight-extrabold)',
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em'
            }}
          >
            Blood
            <span
              style={{
                color: 'var(--color-primary)'
              }}
            >
              Link
            </span>
          </span>
        </Link>
      </div>

      <nav
        className="hide-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-5)'
        }}
      >
        {renderNavLinks()}
      </nav>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)'
        }}
      >
        {isPublic ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}

        <button
          className="show-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: 'var(--spacing-1)',
            color: 'var(--color-text-primary)'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--navbar-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-bg-card)',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xl)',
            padding: 'var(--spacing-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
            zIndex: 'var(--z-overlay)'
          }}
        >
          {renderNavLinks()}
        </div>
      )}

      <style>{`
        .navbar-link {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-secondary);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: color var(--transition-fast);
        }

        .navbar-link:hover,
        .navbar-link.active {
          color: var(--color-primary);
          font-weight: var(--font-weight-semibold);
        }
      `}</style>
    </header>
  );
};

export default Navbar;