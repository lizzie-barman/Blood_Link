import React from 'react';
import Button from './Button';

export const EmptyState = ({
  title = 'No Data Available',
  description = 'There are currently no items to display.',
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--spacing-12) var(--spacing-6)',
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-3)',
        width: '100%'
      }}
    >
      <div style={{ fontSize: '2.5rem', color: 'var(--color-text-muted)' }}>
        {icon || '🩸'}
      </div>
      <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '440px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} style={{ marginTop: 'var(--spacing-2)' }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorMessage = ({
  message = 'An unexpected error occurred while loading healthcare records.',
  onRetry,
  retryLabel = 'Retry'
}) => {
  return (
    <div
      className="alert alert-danger"
      style={{
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        margin: 'var(--spacing-4) 0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span>⚠️</span>
        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{message}</span>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} style={{ borderColor: 'var(--color-danger)' }}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
