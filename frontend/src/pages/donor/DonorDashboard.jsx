import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import BloodGroupBadge from '../../components/blood/BloodGroupBadge';
import { useBloodLink } from '../../hooks/useSocket';

export const DonorDashboard = ({ onNavigateTab }) => {
  const navigate = useNavigate();
  const {
    requests: contextRequests,
    donors: contextDonors
  } = useBloodLink();

  const currentDonor = contextDonors?.[0] || null;
  const requests = contextRequests || [];

  const donorName = currentDonor?.name || 'Donor';
  const bloodGroup = currentDonor?.bloodGroup || '—';
  
  // FIX: Read 'donationCount' from database instead of 'totalDonations'
  const totalDonations = Number(currentDonor?.donationCount || 0);
  
  // FIX: Make the date human-readable instead of the raw ISO string
  const lastDonationDate = currentDonor?.lastDonationDate 
    ? new Date(currentDonor.lastDonationDate).toLocaleDateString()
    : 'Not available';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title={`Welcome back, ${donorName}`}
        subtitle={
          bloodGroup !== '—'
            ? `Your blood group ${bloodGroup} can help patients in emergency cases.`
            : 'Your donor profile information will appear here.'
        }
        actionLabel="View All Emergency Requests"
        onAction={() => {
          if (onNavigateTab) onNavigateTab('requests');
          else navigate('/donor/requests');
        }}
      />

      <div
        className="card"
        style={{
          backgroundColor: 'var(--color-primary-50)',
          border: '1px solid var(--color-primary-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--spacing-4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <BloodGroupBadge bloodGroup={bloodGroup} size="lg" />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)' }}>
                {donorName}
              </h3>

              {currentDonor?.badge && (
                <span className="badge badge-info">
                  {currentDonor.badge}
                </span>
              )}
            </div>

            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary-dark)',
                marginTop: 'var(--spacing-1)'
              }}
            >
              Status:{' '}
              <strong>
                {currentDonor?.eligible
                  ? 'Eligible to Donate'
                  : currentDonor
                    ? 'Eligibility information unavailable (Cooldown active)'
                    : 'Profile not loaded'}
              </strong>
              {' • '}
              Last donation: {lastDonationDate}
            </p>
          </div>
        </div>

        {currentDonor && (
          <span
            className="badge badge-success"
            style={{
              fontSize: 'var(--font-size-sm)',
              padding: '0.4rem 0.8rem'
            }}
          >
            ✓ Active Donor
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Donations"
          value={totalDonations}
          icon="🩸"
          change={currentDonor ? 'Recorded donations' : 'No donor data'}
          trend={currentDonor ? 'positive' : undefined}
        />

        <StatCard
          title="Lives Saved"
          value={totalDonations * 3}
          icon="❤️"
          change={currentDonor ? 'Estimated 3 per unit' : 'Based on donations'}
          trend={currentDonor ? 'positive' : undefined}
        />

        <StatCard
          title="Emergency Requests"
          value={requests.length}
          icon="🚨"
          change={
            requests.length > 0
              ? 'Active hospital requests'
              : 'No active requests'
          }
          trend={requests.length > 0 ? 'negative' : undefined}
        />

        <StatCard
          title="Donor Ranking"
          value={totalDonations >= 5 ? 'Gold' : totalDonations >= 2 ? 'Silver' : totalDonations >= 1 ? 'Bronze' : '—'}
          icon="🏆"
          change="Ranking"
        />
      </div>
    </div>
  );
};

export default DonorDashboard;