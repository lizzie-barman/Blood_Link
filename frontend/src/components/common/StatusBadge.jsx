import React from 'react';
import { formatStatus } from '../../utils/formatters';

export const StatusBadge = ({ status, variant, className = '' }) => {
  const getVariant = () => {
    if (variant) return variant;
    const normalized = (status || '').toUpperCase();
    if (['COMPLETED', 'FULFILLED', 'NORMAL', 'ELIGIBLE', 'ACTIVE'].includes(normalized)) {
      return 'success';
    }
    if (['OPEN', 'PENDING', 'SCHEDULED', 'LOW', 'MEDIUM', 'IN_TRANSIT'].includes(normalized)) {
      return 'warning';
    }
    if (['CANCELLED', 'INELIGIBLE', 'CRITICAL', 'HIGH', 'EXPIRED'].includes(normalized)) {
      return 'danger';
    }
    if (['DONOR MATCHED', 'DONOR_MATCHED'].includes(normalized)) {
      return 'info';
    }
    return 'info';
  };

  const badgeClass = `badge badge-${getVariant()}`;

  return (
    <span className={`${badgeClass} ${className}`.trim()}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
