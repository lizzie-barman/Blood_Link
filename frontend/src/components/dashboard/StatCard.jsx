import React from 'react';

export const StatCard = ({ title, value, change, icon, trend = 'neutral' }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-5)' }}>
      <div>
        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </div>
        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-1)' }}>
          {value}
        </div>
        {change && (
          <div style={{
            fontSize: 'var(--font-size-xs)',
            marginTop: 'var(--spacing-1)',
            color: trend === 'positive' ? 'var(--color-success)' : trend === 'negative' ? 'var(--color-danger)' : 'var(--color-text-muted)'
          }}>
            {change}
          </div>
        )}
      </div>
      {icon && (
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-primary-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem'
        }}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
