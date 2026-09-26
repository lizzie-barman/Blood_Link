import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import EmergencyRequestCard from '../../components/emergency/EmergencyRequestCard';
import { useBloodLink } from '../../hooks/useSocket';

export const HospitalDashboard = ({ onNavigateTab }) => {
  const navigate = useNavigate();
  const { requests: contextRequests } = useBloodLink();

  const requests = contextRequests || [];

  const activeCount = requests.filter(
    (request) =>
      request.status === 'OPEN' ||
      request.status === 'SEARCHING'
  ).length;

  const matchedCount = requests.filter(
    (request) => request.status === 'DONOR_MATCHED'
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Hospital Emergency Hub"
        subtitle="Real-time transfusion tracking, unit dispatch, and donor response monitoring."
        actionLabel="Create Emergency Request"
        onAction={() => {
          if (onNavigateTab) onNavigateTab('create-request');
          else navigate('/hospital/create-request');
        }}
      />

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Requests"
          value={activeCount}
          icon="🚨"
          change="Real-time sync"
          trend={activeCount > 0 ? 'negative' : undefined}
        />

        <StatCard
          title="Donors Matched"
          value={matchedCount}
          icon="👥"
          change="Current matched requests"
          trend={matchedCount > 0 ? 'positive' : undefined}
        />

        <StatCard
          title="Units Received Today"
          value="—"
          icon="🩸"
          change="Backend tracking not available"
        />

        <StatCard
          title="Avg Response Time"
          value="—"
          icon="⏱️"
          change="Backend metric not available"
        />
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-4)'
          }}
        >
          <h3 style={{ fontSize: 'var(--font-size-md)' }}>
            Active Hospital Requests
          </h3>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('requests');
              else navigate('/hospital/requests');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: 'var(--font-size-xs)',
              cursor: 'pointer'
            }}
          >
            View All ({requests.length})
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-4)'
          }}
        >
          {requests.length > 0 ? (
            requests.slice(0, 2).map((req) => (
              <EmergencyRequestCard
                key={req._id || req.id}
                request={req}
                onViewDetails={() => {
                  if (onNavigateTab) onNavigateTab('requests');
                  else navigate('/hospital/requests');
                }}
              />
            ))
          ) : (
            <div className="card">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                No emergency requests found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;