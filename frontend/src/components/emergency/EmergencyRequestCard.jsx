import React, { useState } from 'react';
import Button from '../common/Button';
import RequestStatus from './RequestStatus';

export const EmergencyRequestCard = ({ request, onViewDetails, onFulfill, onDispatchCourier }) => {
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  
  if (!request) return null;

  const formatComponent = (comp) => {
    if (comp === 'WHOLE_BLOOD') return 'Whole Blood';
    if (comp === 'PLASMA') return 'Plasma';
    if (comp === 'PLATELETS') return 'Platelets';
    return comp || 'Unknown';
  };

  const hospitalName = request.hospitalName || request.hospital?.name || 'Unknown Facility';
  const bloodGroup = request.bloodGroup || 'Unknown';
  const component = formatComponent(request.component);
  const units = request.unitsRequired || 0;
  const patientId = request.patientId || 'N/A';
  const requiredBy = request.requiredBy || 'Immediate';
  const id = request._id || request.id;

  const handleFulfill = async () => {
    if (!onFulfill) return;
    setIsFulfilling(true);
    try {
      await onFulfill(id);
    } catch (error) {
      console.error('Failed to fulfill request:', error);
      alert('Failed to verify donation. Please try again.');
    } finally {
      setIsFulfilling(false);
    }
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      if (onDispatchCourier) {
        await onDispatchCourier(id);
      } else {
        alert('Courier dispatched successfully from Blood Bank depot!');
      }
    } catch (error) {
      console.error('Failed to dispatch courier:', error);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div 
      className="card" 
      style={{ 
        padding: 'var(--spacing-4)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--spacing-3)', 
        border: '1px solid var(--color-border)', 
        borderRadius: '8px',
        backgroundColor: 'var(--color-bg-primary, #ffffff)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          borderBottom: '1px solid var(--color-border)', 
          paddingBottom: 'var(--spacing-3)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <h3 style={{ margin: 0, color: 'var(--color-danger)', fontSize: '1.25rem' }}>
            {bloodGroup}
          </h3>
          <span style={{ fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
            {hospitalName}
          </span>
        </div>
        
        <RequestStatus status={request.status || 'OPEN'} urgency={request.urgency} />
      </div>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.75rem', 
          color: 'var(--color-text-secondary)', 
          fontSize: '0.95rem' 
        }}
      >
        <div><strong>Component:</strong> {component} • {units} unit(s)</div>
        <div><strong>Patient:</strong> {patientId}</div>
        <div><strong>Required by:</strong> {requiredBy}</div>
        
        {/* OPTION A: Live Donor Accepted Block */}
        {(request.status === 'DONOR_MATCHED' || request.matchedDonor) && (
          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '0.75rem', background: '#dcfce7', borderRadius: '6px', color: '#166534', border: '1px solid #bbf7d0' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>👤 Live Donor Matched:</div>
            <div>{request.matchedDonor?.name || 'A registered donor'} accepted this request and is en route.</div>
          </div>
        )}

        {/* OPTION B: Blood Bank Stock Offered Block */}
        {request.bloodBankOffered && (
          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '0.75rem', background: '#e0f2fe', borderRadius: '6px', color: '#0369a1', border: '1px solid #bae6fd' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>📦 Blood Bank Depot Offer:</div>
            <div>{request.bloodBankName || 'Central Blood Bank'} has pledged {units} units of {bloodGroup} ready for instant courier pickup.</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem', marginTop: 'var(--spacing-2)', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button 
          variant="secondary" 
          onClick={() => onViewDetails && onViewDetails(request)}
        >
          View Details
        </Button>

        {/* Hospital Action for Blood Bank Offer */}
        {request.bloodBankOffered && (
          <Button 
            variant="primary" 
            style={{ backgroundColor: '#0284c7', color: 'white' }}
            onClick={handleDispatch}
            disabled={isDispatching}
          >
            {isDispatching ? 'Dispatching...' : '🚚 Dispatch Blood Bank Courier'}
          </Button>
        )}

        {/* Hospital Action for Live Donor */}
        {(request.status === 'DONOR_MATCHED' || request.matchedDonor) && onFulfill && (
          <Button 
            variant="primary" 
            style={{ backgroundColor: '#16a34a', color: 'white' }}
            onClick={handleFulfill}
            disabled={isFulfilling}
          >
            {isFulfilling ? 'Verifying...' : 'Verify & Complete Donor Donation'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmergencyRequestCard;