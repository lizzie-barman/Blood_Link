import React from 'react';
import Button from '../common/Button';
import { formatUnits } from '../../utils/formatters';

export const BloodBankCard = ({
  bloodBank,
  selectedComponent = 'Platelets',
  selectedGroup = 'O+',
  onViewDetails,
  onRequestBlood
}) => {
  const {
    name,
    location,
    city,
    distanceKm,
    availableUnits,
    components,
    status = 'Available',
    lastUpdated = 'Recently',
    phone,
    verified
  } = bloodBank;

  const componentUnits = components && components[selectedComponent] !== undefined
    ? components[selectedComponent]
    : availableUnits;

  const getStatusBadge = () => {
    switch (status) {
      case 'Available':
        return <span className="badge badge-success">● Available</span>;
      case 'Limited':
        return <span className="badge badge-warning">▲ Limited Stock</span>;
      case 'Unavailable':
      default:
        return <span className="badge badge-danger">✕ Unavailable</span>;
    }
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        transition: 'all var(--transition-fast)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-2)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>{name}</h3>
            {verified && (
              <span title="Verified Facility" style={{ color: 'var(--color-secondary)', fontSize: 'var(--font-size-xs)' }}>
                ✓ Certified
              </span>
            )}
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            📍 {location} {distanceKm ? `(${distanceKm} km away)` : ''}
          </p>
        </div>
        <div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Component & Units Info Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: 'var(--spacing-2)',
          backgroundColor: 'var(--color-bg-muted)',
          padding: 'var(--spacing-3)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-xs)'
        }}
      >
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Target Group:</span>
          <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-sm)' }}>
            {selectedGroup || 'Any'}
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Component:</span>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            {selectedComponent || 'Whole Blood'}
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Stock Ready:</span>
          <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', fontSize: 'var(--font-size-sm)' }}>
            {formatUnits(componentUnits)}
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Last Synced:</span>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            {lastUpdated}
          </div>
        </div>
      </div>

      {/* Contact & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-2)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          📞 <strong>{phone}</strong>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {onRequestBlood && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onRequestBlood(bloodBank)}
            >
              Request Units
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails && onViewDetails(bloodBank)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BloodBankCard;
