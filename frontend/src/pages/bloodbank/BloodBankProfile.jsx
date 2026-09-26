import React, { useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const BloodBankProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Metro City Central Blood Bank',
    licenseNumber: 'FDA-BB-2024-8891',
    address: '742 Healthcare Ave, Metro City',
    contactPerson: 'Dr. Arthur Mitchell',
    phone: '555-0192',
    email: 'operations@metrobloodbank.org',
    operatingHours: '24/7 Service'
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Blood Bank Facility Profile Updated.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Blood Bank Facility Profile"
        subtitle="Manage center accreditation, license registrations, emergency dispatch contact info, and hours."
      />

      <div style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)' }}>Facility Credentials</h3>
            <span className="badge badge-success">✓ Verified Blood Bank</span>
          </div>

          <Input
            label="Facility Official Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <Input
              label="License Registration #"
              value={profile.licenseNumber}
              disabled
            />
            <Input
              label="Operating Hours"
              value={profile.operatingHours}
              onChange={(e) => setProfile({ ...profile, operatingHours: e.target.value })}
            />
          </div>

          <Input
            label="Physical Depot Address"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <Input
              label="Lead Officer / Medical Director"
              value={profile.contactPerson}
              onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
            />
            <Input
              label="Emergency Hotline"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <Input
            label="Official Contact Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          <Button type="submit" variant="primary" style={{ marginTop: 'var(--spacing-2)' }}>
            Save Facility Settings
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BloodBankProfile;
