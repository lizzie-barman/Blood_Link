import React, { useState } from 'react';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import { BLOOD_GROUPS, BLOOD_COMPONENTS } from '../../utils/constants';

export const BloodSearch = ({ onSearch, initialFilters = {} }) => {
  const [bloodGroup, setBloodGroup] = useState(initialFilters.bloodGroup || 'O+');
  const [component, setComponent] = useState(initialFilters.component || 'Platelets');
  const [state, setState] = useState(initialFilters.state || 'West Bengal');
  const [city, setCity] = useState(initialFilters.city || 'Kolkata');
  const [radius, setRadius] = useState(initialFilters.radius || '15');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ bloodGroup, component, state, city, radius });
    }
  };

  const handleReset = () => {
    setBloodGroup('');
    setComponent('');
    setState('');
    setCity('');
    setRadius('25');
    if (onSearch) {
      onSearch({ bloodGroup: '', component: '', state: '', city: '', radius: '25' });
    }
  };

  return (
    <div className="card" style={{ padding: 'var(--spacing-6)' }}>
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)' }}>Find Blood Near You</h2>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Filter across verified regional blood depots, platelet component stocks, and emergency supply points.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--spacing-4)',
          alignItems: 'flex-start'
        }}>
          {/* Blood Group */}
          <Select
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={BLOOD_GROUPS}
            placeholder="All Groups"
          />

          {/* Blood Component */}
          <Select
            label="Component"
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            options={BLOOD_COMPONENTS}
            placeholder="All Components"
          />

          {/* State */}
          <Input
            label="State"
            placeholder="e.g. West Bengal, Delhi"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />

          {/* District / City */}
          <Input
            label="District / City"
            placeholder="e.g. Kolkata, South 24 Pgs"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {/* Search Radius */}
          <Select
            label="Radius"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            options={[
              { value: '5', label: 'Within 5 km' },
              { value: '10', label: 'Within 10 km' },
              { value: '15', label: 'Within 15 km' },
              { value: '25', label: 'Within 25 km' },
              { value: '50', label: 'Within 50 km' }
            ]}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
          <Button type="button" variant="secondary" size="md" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button type="submit" variant="primary" size="md">
            🔍 Search Blood Repositories
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BloodSearch;
