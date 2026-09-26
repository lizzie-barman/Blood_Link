import React, { useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import BloodGroupBadge from '../../components/blood/BloodGroupBadge';
import { BLOOD_GROUPS } from '../../utils/constants';

export const DonorProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '555-8392',
    bloodGroup: 'O-',
    emergencyContact: 'Mark Jenkins (555-9921)',
    availableForEmergency: true,
    address: '42 Willow Lane, Metro City'
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Donor profile updated successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Donor Profile & Eligibility"
        subtitle="Manage your health declarations, contact info, and emergency readiness."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
        <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)' }}>Personal Information</h3>

          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <Input
              label="Contact Phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <Select
              label="Blood Group"
              value={profile.bloodGroup}
              options={BLOOD_GROUPS}
              onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          <Input
            label="Residential Address / Area"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />

          <Input
            label="Emergency Contact Name & Phone"
            value={profile.emergencyContact}
            onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
          />

          <Button type="submit" variant="primary">
            Save Profile
          </Button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div className="card">
            <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-3)' }}>
              Medical Eligibility Status
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
              <BloodGroupBadge bloodGroup={profile.bloodGroup} size="lg" />
              <div>
                <span className="badge badge-success">Eligible to Donate</span>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
                  Cooldown passed (90+ days since last donation).
                </p>
              </div>
            </div>
            <ul style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', paddingLeft: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>Hemoglobin count: Satisfactory (13.8 g/dL)</li>
              <li>Weight & blood pressure: In approved range</li>
              <li>No recent travel to restricted zones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
