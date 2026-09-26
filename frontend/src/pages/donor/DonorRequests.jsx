import React, { useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useBloodLink } from '../../hooks/useSocket';

export const DonorRequests = () => {
  const {
    requests: contextRequests,
    donors,
    acceptEmergencyRequest
  } = useBloodLink();

  // Only show OPEN requests for the donor to accept
  const requests = (contextRequests || []).filter(req => req.status === 'OPEN');

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmedModal, setConfirmedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRespond = (request) => {
    setSelectedRequest(request);
    setConfirmedModal(true);
  };

  const handleConfirmDispatch = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);

    try {
      const requestId = selectedRequest._id || selectedRequest.id;
      // Get the donor ID safely from context or local storage
      const donorId = donors?.[0]?._id || JSON.parse(localStorage.getItem('bloodlink_user'))?._id;

      if (!requestId) {
        throw new Error('Request ID not found.');
      }

      if (!donorId) {
        throw new Error('Donor profile not found. Please log in again.');
      }

      if (acceptEmergencyRequest) {
        await acceptEmergencyRequest(requestId, donorId);
      }

      setConfirmedModal(false);
      setSelectedRequest(null);
      alert('Thank you! The hospital has been notified of your matching donation.');
    } catch (error) {
      console.error('Failed to accept emergency request:', error);
      alert(error.response?.data?.message || error.message || 'Failed to confirm donation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Emergency Blood Requests"
        subtitle="Hospitals requesting blood matches from eligible donors."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {requests.length > 0 ? (
          requests.map((req) => {
            const requestId = req._id || req.id;
            const hospitalName = req.hospitalName || req.hospital?.name || 'Requesting Hospital';

            const component =
              req.component === 'WHOLE_BLOOD' ? 'Whole Blood' :
              req.component === 'PLASMA' ? 'Plasma' :
              req.component === 'PLATELETS' ? 'Platelets' : 
              req.component || 'Blood';

            const urgency = String(req.urgency || 'URGENT').toUpperCase();

            return (
              <div key={requestId} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-1)' }}>
                      {hospitalName}
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Emergency blood request
                    </p>
                  </div>
                  <span className={urgency === 'CRITICAL' ? 'badge badge-danger' : urgency === 'URGENT' ? 'badge badge-warning' : 'badge badge-info'}>
                    {urgency}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-3)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Blood Group</div>
                    <strong>{req.bloodGroup || '—'}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Component</div>
                    <strong>{component}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Units Required</div>
                    <strong>{req.unitsRequired || '—'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="danger" onClick={() => handleRespond(req)}>
                    I Can Donate
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No open emergency blood requests are currently available.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={confirmedModal}
        onClose={() => setConfirmedModal(false)}
        title="Confirm Emergency Donation Response"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmedModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDispatch} disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Confirm & Donate'}
            </Button>
          </>
        }
      >
        {selectedRequest && (
          <div>
            <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
              You are responding to donate <strong>{selectedRequest.bloodGroup}</strong> blood for{' '}
              <strong>{selectedRequest.hospitalName || selectedRequest.hospital?.name || 'the requesting hospital'}</strong>.
            </p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Your response will be sent to the requesting hospital.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DonorRequests;