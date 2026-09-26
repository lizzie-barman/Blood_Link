import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import EmergencyRequestCard from '../../components/emergency/EmergencyRequestCard';
import Modal from '../../components/common/Modal';
import RequestTimeline from '../../components/emergency/RequestTimeline';
import { useBloodLink } from '../../hooks/useSocket';
import { getEmergencyRequests } from '../../services/api';

export const HospitalRequests = ({ onNavigateTab }) => {
  const navigate = useNavigate();
  // Destructure fulfillEmergencyRequest from your context
  const { requests: contextRequests, fulfillEmergencyRequest } = useBloodLink();
  const [requests, setRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await getEmergencyRequests();
        const apiRequests = response?.requests || [];
        setRequests(apiRequests.filter((request) => request?._id));
      } catch (error) {
        console.error('Failed to load hospital blood requests:', error);
      }
    };
    loadRequests();
  }, []);

  useEffect(() => {
    const realRequests = (contextRequests || []).filter(
      (request) => request?._id
    );
    if (realRequests.length > 0) {
      setRequests(realRequests);
    }
  }, [contextRequests]);

  // Filter requests to only show those created by this hospital
  const user = JSON.parse(localStorage.getItem('bloodlink_user') || '{}');
  const hospitalRequests = requests.filter(req => 
    req.hospitalId === user._id || 
    req.hospitalId?._id === user._id ||
    req.hospital === user._id ||
    // Fallback if your backend doesn't attach hospitalId perfectly yet
    req.hospitalName === user.name
  );

  const displayRequests = hospitalRequests.length > 0 ? hospitalRequests : requests;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Hospital Blood Requests"
        subtitle="Track ongoing transfusion fulfillments, donor dispatches, and incoming units."
        actionLabel="+ New Request"
        onAction={() => {
          if (onNavigateTab) {
            onNavigateTab('create-request');
          } else {
            navigate('/hospital/create-request');
          }
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {displayRequests.length > 0 ? (
          displayRequests.map((req) => (
            <EmergencyRequestCard
              key={req._id}
              request={req}
              onViewDetails={(request) => setSelectedReq(request)}
              onFulfill={fulfillEmergencyRequest}
            />
          ))
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc' }}>
            <p style={{ color: '#64748b' }}>No blood requests found.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(selectedReq)}
        onClose={() => setSelectedReq(null)}
        title={selectedReq ? `Tracking Request: ${selectedReq._id}` : ''}
      >
        {selectedReq && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-3)', flexWrap: 'wrap' }}>
              <div>
                <strong>Blood Group:</strong> {selectedReq.bloodGroup || '—'} • {selectedReq.unitsRequired ?? '—'} Unit(s)
              </div>
              <div>
                <strong>Patient:</strong> {selectedReq.patientId || '—'}
              </div>
            </div>
            <h4 style={{ fontSize: 'var(--font-size-sm)' }}>Live Fulfillment Timeline</h4>
            {selectedReq.timeline?.length > 0 ? (
              <RequestTimeline stages={selectedReq.timeline} />
            ) : (
              <p style={{ color: 'var(--color-text-secondary)' }}>Timeline information is not available for this request yet.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HospitalRequests;