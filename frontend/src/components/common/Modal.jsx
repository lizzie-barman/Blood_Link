import React, { useEffect } from 'react';
import Button from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '500px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-modal)',
        backdropFilter: 'blur(2px)',
        padding: 'var(--spacing-4)'
      }}
      onClick={onClose}
    >
      <div
        className="modal-container card"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-4) var(--spacing-6)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-card)'
        }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              fontSize: 'var(--font-size-xl)',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-6)', overflowY: 'auto' }}>
          {children}
        </div>

        {footer && (
          <div style={{
            padding: 'var(--spacing-4) var(--spacing-6)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-3)',
            backgroundColor: 'var(--color-bg-muted)'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="440px"
      footer={(
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      )}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
        <span style={{ fontSize: '1.75rem' }}>{variant === 'danger' ? '🚨' : 'ℹ️'}</span>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default Modal;
