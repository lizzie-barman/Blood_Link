import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import RequestTimeline from '../../components/emergency/RequestTimeline';
import BloodGroupBadge from '../../components/blood/BloodGroupBadge';
import RequestStatus from '../../components/emergency/RequestStatus';
import Button from '../../components/common/Button';
import { useBloodLink } from '../../hooks/useSocket';

// Haversine formula to calculate distance in km between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (!lat1 || !lng1 || !lat2 || !lng2) return null;
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

export const RequestDetails = ({ requestId: propRequestId, onBack }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  
  // Pull requests AND inventory from your context for the Smart Matcher
  const { requests: contextRequests, inventory, bloodBanks } = useBloodLink();

  const requests = contextRequests || [];
  const targetId = propRequestId || paramId;
  const request = requests.find((item) => (item._id || item.id) === targetId);

  // 1. Get Live Donors
  const matchedDonors = request?.matchedDonor ? [request.matchedDonor] : [];

  // 2. SMART MATCHER: Find nearby Blood Banks with actual stock
  const stockedBloodBanks = useMemo(() => {
    if (!request || !request.location || !inventory) return [];

    // Filter inventory for the specific blood group requested that has units > 0
    const matchingInventory = inventory.filter(
      item => item.bloodGroup === request.bloodGroup && !item.expired && Number(item.units || 0) > 0
    );

    // Map those inventory records back to their physical blood banks and calculate distance
    const availableBanks = matchingInventory.map(invItem => {
      const bankId = typeof invItem.bloodBankId === 'object' ? invItem.bloodBankId._id : invItem.bloodBankId;
      const bankDetails = bloodBanks.find(b => b.id === bankId || b._id === bankId) || invItem.bloodBankId;
      
      const distance = calculateDistance(
        request.location.lat, 
        request.location.lng, 
        bankDetails?.coordinates?.lat || bankDetails?.location?.lat, 
        bankDetails?.coordinates?.lng || bankDetails?.location?.lng
      );

      return {
        ...bankDetails,
        availableUnits: invItem.units,
        component: invItem.component,
        distanceKm: distance ? Number(distance) : 999 
      };
    });

    // Sort by closest distance
    return availableBanks.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [request, inventory, bloodBanks]);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/hospital/requests');
  };

  if (!request) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <DashboardHeader title="Request Not Found" actionLabel="Back to Requests" onAction={handleBack} />
        <div className="card"><p>No request with this ID is currently available.</p></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title={`Request Details: ${request._id || request.id}`}
        subtitle={`Case file for patient ${request.patientId || 'Not provided'} at ${request.hospitalName || 'Hospital'}`}
        actionLabel="Back to Requests"
        onAction={handleBack}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
              <div>
                <h3>{request.bloodGroup} {request.component === 'WHOLE_BLOOD' ? 'Whole Blood' : request.component === 'PLATELETS' ? 'Platelets' : 'Plasma'}</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Quantity: {request.unitsRequired ?? '—'} Unit(s)</p>
              </div>
            </div>
            <RequestStatus status={request.status} urgency={request.urgency} />
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <div><strong>Urgency:</strong> {request.urgency || 'Not specified'}</div>
            <div><strong>Clinical Notes:</strong> {request.notes || 'No notes provided.'}</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-4)' }}>Status Timeline</h3>
          {request.timeline?.length > 0 ? <RequestTimeline stages={request.timeline} /> : <p style={{ color: 'var(--color-text-secondary)' }}>Timeline information is not available.</p>}
        </div>
      </div>

      {/* SMART MATCHER UI: Split screen for Donors vs Blood Banks */}
      <h2 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '-1rem' }}>Smart Dispatch Options</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
        
        {/* Live Donors Column */}
        <div className="card" style={{ borderTop: '4px solid #16a34a' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-4)' }}>
            Live Donors Responding ({matchedDonors.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {matchedDonors.length > 0 ? (
              matchedDonors.map((donor) => (
                <div key={donor._id || donor.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3)', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-lg)' }}>
                  <div>
                    <strong style={{ color: '#166534' }}>{donor.name || 'Matched Donor'}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                      {donor.distanceKm != null ? `${donor.distanceKm} km away` : 'Driving to hospital'}
                    </div>
                  </div>
                  <Button variant="primary" size="sm" style={{ backgroundColor: '#16a34a' }}>Verify Arrival</Button>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>No live donors have accepted the ping yet.</p>
            )}
          </div>
        </div>

        {/* Stocked Blood Banks Column */}
        <div className="card" style={{ borderTop: '4px solid #0284c7' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-4)' }}>
            Instant Pickup: Blood Banks ({stockedBloodBanks.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {stockedBloodBanks.length > 0 ? (
              stockedBloodBanks.map((bank, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3)', backgroundColor: '#f0f9ff', borderRadius: 'var(--radius-lg)' }}>
                  <div>
                    <strong style={{ color: '#0369a1' }}>{bank.name || 'Regional Blood Bank'}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#0284c7' }}>
                      {bank.distanceKm !== 999 ? `${bank.distanceKm} km away` : 'Nearby'} • <strong>{bank.availableUnits} units ready</strong>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" style={{ backgroundColor: '#0284c7' }}>Dispatch Courier</Button>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>No nearby blood banks currently have {request.bloodGroup} in stock.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RequestDetails;