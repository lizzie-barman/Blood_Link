import React from 'react';
import { formatBloodGroup } from '../../utils/formatters';

export const BloodGroupBadge = ({ bloodGroup, size = 'md', className = '' }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'var(--font-weight-extrabold)',
    backgroundColor: 'var(--color-primary-100)',
    color: 'var(--color-primary-dark)',
    border: '1px solid var(--color-primary-200)',
    borderRadius: 'var(--radius-lg)',
    width: isLarge ? '56px' : isSmall ? '32px' : '44px',
    height: isLarge ? '56px' : isSmall ? '32px' : '44px',
    fontSize: isLarge ? 'var(--font-size-xl)' : isSmall ? 'var(--font-size-xs)' : 'var(--font-size-md)',
  };

  return (
    <div style={badgeStyle} className={className}>
      {formatBloodGroup(bloodGroup)}
    </div>
  );
};

export default BloodGroupBadge;
