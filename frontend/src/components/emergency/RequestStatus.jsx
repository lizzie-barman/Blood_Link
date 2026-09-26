import React from 'react';
import StatusBadge from '../common/StatusBadge';

export const RequestStatus = ({ status, urgency }) => {
  const normUrgency = (urgency || '').toUpperCase();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
      {urgency && (
        <span
          className={`badge ${
            normUrgency === 'CRITICAL'
              ? 'badge-danger'
              : normUrgency === 'URGENT' || normUrgency === 'HIGH'
              ? 'badge-warning'
              : 'badge-info'
          }`}
        >
          {normUrgency} URGENCY
        </span>
      )}
      <StatusBadge status={status} />
    </div>
  );
};

export default RequestStatus;
