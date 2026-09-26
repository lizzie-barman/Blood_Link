import React from 'react';
import NotificationItem from './NotificationItem';
import Button from '../common/Button';

export const NotificationPanel = ({
  notifications = [],
  onMarkAllAsRead,
  onNotificationClick,
  onClose
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div
      className="card"
      style={{
        width: '100%',
        maxWidth: '380px',
        padding: 0,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-3) var(--spacing-4)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)' }}>
            Notifications
          </h4>
          {unreadCount > 0 && (
            <span className="badge badge-danger" style={{ fontSize: '10px' }}>
              {unreadCount} new
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-xs)',
                cursor: 'pointer'
              }}
            >
              Mark read
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)'
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
            No notifications right now
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={onNotificationClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
