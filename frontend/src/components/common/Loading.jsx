import React from 'react';

export const LoadingSpinner = ({ size = 'md', color = 'var(--color-primary)' }) => {
  const spinnerSize = size === 'sm' ? '18px' : size === 'lg' ? '42px' : '28px';

  return (
    <div
      style={{
        display: 'inline-block',
        width: spinnerSize,
        height: spinnerSize,
        border: '3px solid var(--color-border)',
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'bloodlink-spin 0.8s linear infinite'
      }}
    />
  );
};

export const Loading = ({ text = 'Loading...', size = 'md', fullPage = false }) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-8)',
        gap: 'var(--spacing-3)'
      }}
    >
      <LoadingSpinner size={size} />
      {text && (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
          {text}
        </span>
      )}
      <style>{`
        @keyframes bloodlink-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
