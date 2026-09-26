import React from 'react';
import { formatTimeAgo } from '../../utils/formatters';

export const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { id, title, message, type, timestamp, read } = notification;

  const getTypeIcon = () => {
    switch (type) {
      case 'EMERGENCY_ALERT': return '🚨';
      case 'REQUEST_UPDATE': return '📋';
      case 'INVENTORY_ALERT': return '⚠️';
      default: return '🔔';
    }
  };

  return (
    <div
      onClick={() => onMarkAsRead && onMarkAsRead(id)}
      style={{
        padding: 'var(--spacing-3) var(--spacing-4)',
        backgroundColor: read ? 'transparent' : 'var(--color-primary-50)',
        borderBottom: '1px solid var(--color-border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--spacing-3)',
        transition: 'background-color var(--transition-fast)'
      }}
    >
      <div style={{ fontSize: '1.25rem' }}>{getTypeIcon()}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: read ? 'var(--font-weight-medium)' : 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)'
          }}>
            {title}
          </h4>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {formatTimeAgo(timestamp)}
          </span>
        </div>
        <p style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
          marginTop: 'var(--spacing-1)'
        }}>
          {message}
        </p>
      </div>
      {!read && (
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          marginTop: 'var(--spacing-1)'
        }} />
      )}
    </div>
  );
};

export default NotificationItem;
