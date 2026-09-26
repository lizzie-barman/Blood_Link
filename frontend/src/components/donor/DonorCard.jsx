import React from 'react';
import BloodGroupBadge from '../blood/BloodGroupBadge';
import DonorStatus from './DonorStatus';
import Button from '../common/Button';

export const DonorCard = ({ donor, onContact, onMatch }) => {
  const { name, bloodGroup, distanceKm, status, phone, lastDonationDate, totalDonations, badge } = donor;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <BloodGroupBadge bloodGroup={bloodGroup} size="md" />
          <div>
            <h4 style={{ fontSize: 'var(--font-size-base)' }}>{name}</h4>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              📍 {distanceKm} km away • {totalDonations} donations
            </div>
          </div>
        </div>
        {badge && <span className="badge badge-info">{badge}</span>}
      </div>

      <DonorStatus status={status} lastDonationDate={lastDonationDate} />

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
        {onMatch && status === 'ELIGIBLE' && (
          <Button variant="primary" size="sm" onClick={() => onMatch(donor)} style={{ flex: 1 }}>
            Match to Request
          </Button>
        )}
        {onContact && (
          <Button variant="secondary" size="sm" onClick={() => onContact(donor)}>
            Contact ({phone})
          </Button>
        )}
      </div>
    </div>
  );
};

export default DonorCard;
