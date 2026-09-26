import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import EmergencyRequestCard from '../../components/emergency/EmergencyRequestCard';
import { useBloodLink } from '../../hooks/useSocket';

export const BloodBankRequests = () => {
  const { requests: contextRequests, inventory, setRequests } = useBloodLink();
  const requests = Array.isArray(contextRequests) ? contextRequests.filter(req => req && req.status === 'OPEN') : [];

  const handleOfferStock = (request) => {
    const safeInventory = Array.isArray(inventory) ? inventory : [];
    const matchingStock = safeInventory.find(
      item => item && item.bloodGroup === request.bloodGroup && !item.expired && Number(item.units || 0) >= Number(request.unitsRequired || 1)
    );

    if (!matchingStock) {
      alert(`Insufficient stock! You do not have enough verified units of ${request.bloodGroup} in your depot inventory.`);
      return;
    }

    const reqId = request._id || request.id;

    // Update the request in the global context so the hospital immediately sees it
    if (typeof setRequests === 'function') {
      setRequests(prev => prev.map(r => (r._id === reqId || r.id === reqId) ? { ...r, bloodBankOffered: true, bloodBankName: matchingStock.bloodBankId?.name || 'Central Blood Depot' } : r));
    } else {
      // Fallback mutation if setRequests isn't exposed directly
      request.bloodBankOffered = true;
    }

    alert(`Success! Stored stock (${request.unitsRequired} units of ${request.bloodGroup}) has been pledged. The hospital care desk can now see your depot offer and dispatch a courier.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Emergency Demand & Requests"
        subtitle="Review active hospital requisitions and offer instant fulfillment from your regional blood depot inventory."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {requests.length > 0 ? (
          requests.map((req) => {
            const reqId = req._id || req.id;
            const isOffered = req.bloodBankOffered;

            return (
              <div key={reqId} className="card" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <EmergencyRequestCard request={req} onViewDetails={() => {}} />
                
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 'var(--spacing-2)', borderTop: '1px solid var(--color-border)' }}>
                  {isOffered ? (
                    <span className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      ✓ Stored Stock Offered & Logged to Hospital
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOfferStock(req)}
                      style={{
                        backgroundColor: '#0284c7',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      📦 Offer Stored Stock from Depot
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc' }}>
            <p style={{ color: '#64748b' }}>No open hospital emergency requests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodBankRequests;