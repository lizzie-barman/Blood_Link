import React from 'react';
import StatusBadge from '../common/StatusBadge';

export const DonorStatus = ({ status, lastDonationDate }) => {
  const isEligible = status === 'ELIGIBLE';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <StatusBadge status={status} />
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          {isEligible ? 'Ready to donate' : 'Cooldown period active'}
        </span>
      </div>
      {lastDonationDate && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          Last donation: {lastDonationDate}
        </span>
      )}
    </div>
  );
};

export default DonorStatus;
