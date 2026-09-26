import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DonationHistoryComponent from '../../components/donor/DonationHistory';

export const DonorHistory = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Donation History & Certificates"
        subtitle="Complete record of verified blood donations and certificates of appreciation."
      />

      <div className="card" style={{ padding: 'var(--spacing-6)' }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-4)' }}>
          Verified Donations Log
        </h3>
        <DonationHistoryComponent />
      </div>
    </div>
  );
};

export default DonorHistory;
