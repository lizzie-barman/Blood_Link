import React from 'react';
import Button from '../common/Button';

export const DashboardHeader = ({ title, subtitle, actionLabel, onAction, secondaryActionLabel, onSecondaryAction }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 'var(--spacing-4)',
      marginBottom: 'var(--spacing-6)'
    }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-primary)' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="secondary" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
        {actionLabel && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
