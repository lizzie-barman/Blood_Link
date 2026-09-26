import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import NotificationItem from '../components/notifications/NotificationItem';
import Button from '../components/common/Button';
import { useBloodLink } from '../hooks/useSocket';

export const Notifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useBloodLink();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'emergency'

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'emergency') return notif.type === 'EMERGENCY_ALERT';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Notifications & Alerts"
        subtitle="Real-time alerts, emergency broadcasts, and transfusion tracking updates."
        actionLabel={unreadCount > 0 ? "Mark All as Read" : undefined}
        onAction={unreadCount > 0 ? markAllNotificationsAsRead : undefined}
      />

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`btn btn-sm ${filter === 'emergency' ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => setFilter('emergency')}
        >
          🚨 Emergency Alerts
        </button>
      </div>

      {/* Notifications List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '2rem' }}>🔔</span>
            <p style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)' }}>
              No notifications found in this view.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={markNotificationAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
