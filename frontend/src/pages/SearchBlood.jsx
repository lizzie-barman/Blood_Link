import React, { useEffect, useState } from 'react';
import BloodSearch from '../components/blood/BloodSearch';
import BloodBankCard from '../components/blood/BloodBankCard';
import MapView from '../components/map/MapView';
import { getInventory } from '../services/api';

export const SearchBlood = ({ onRequestBlood }) => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [allInventory, setAllInventory] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const transformInventoryToBloodBanks = (inventory) => {
    const banks = {};

    inventory.forEach((item) => {
      if (item.expired || !item.bloodBankId) return;

      const bank = item.bloodBankId;

      if (!banks[bank._id]) {
        banks[bank._id] = {
          id: bank._id,
          name: bank.name,
          location: bank.address,
          address: bank.address,
          city: 'Kolkata',
          state: 'West Bengal',
          distanceKm: null,
          phone: bank.phone,
          operatingHours: '24/7 Service',
          availableUnits: 0,
          components: {},
          status: 'Available',
          lastUpdated: item.updatedAt,
          coordinates: {
            lat: bank.location?.lat,
            lng: bank.location?.lng
          },
          verified: true
        };
      }

      const componentName = item.component
        .replace('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

      banks[bank._id].components[componentName] =
        (banks[bank._id].components[componentName] || 0) + item.units;

      banks[bank._id].availableUnits += item.units;

      if (new Date(item.updatedAt) > new Date(banks[bank._id].lastUpdated)) {
        banks[bank._id].lastUpdated = item.updatedAt;
      }
    });

    return Object.values(banks);
  };

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getInventory();
        const inventory = response.inventory || [];

        setAllInventory(inventory);
        setBloodBanks(transformInventoryToBloodBanks(inventory));
      } catch (err) {
        console.error('Failed to load blood inventory:', err);
        setError(err.message || 'Failed to load blood inventory.');
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const handleSearch = ({ bloodGroup, location }) => {
    let filteredInventory = allInventory.filter((item) => !item.expired);

    if (bloodGroup) {
      filteredInventory = filteredInventory.filter(
        (item) => item.bloodGroup === bloodGroup
      );
    }

    const filteredBanks = transformInventoryToBloodBanks(filteredInventory).filter(
      (bank) => {
        if (!location) return true;

        const searchLocation = location.toLowerCase();

        return (
          bank.name.toLowerCase().includes(searchLocation) ||
          bank.address.toLowerCase().includes(searchLocation) ||
          bank.city.toLowerCase().includes(searchLocation) ||
          bank.state.toLowerCase().includes(searchLocation)
        );
      }
    );

    setBloodBanks(filteredBanks);
    setSelectedBank(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Search Blood Network</h1>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            marginTop: 'var(--spacing-1)'
          }}
        >
          Locate available blood types, accredited repos, and nearby active inventories in real-time.
        </p>
      </div>

      <BloodSearch onSearch={handleSearch} />

      {loading && (
        <div>
          Loading blood-bank inventory...
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--color-danger, red)' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--spacing-6)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h3 style={{ fontSize: 'var(--font-size-md)' }}>
                Verified Facilities ({bloodBanks.length})
              </h3>

              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)'
                }}
              >
                Live inventory
              </span>
            </div>

            {bloodBanks.length === 0 ? (
              <div>No blood banks found for the selected search.</div>
            ) : (
              bloodBanks.map((bank) => (
                <BloodBankCard
                  key={bank.id}
                  bloodBank={bank}
                  onRequestBlood={onRequestBlood}
                  onContact={(bank) => setSelectedBank(bank)}
                />
              ))
            )}
          </div>

          <div>
            <MapView
              bloodBanks={bloodBanks}
              onSelectMarker={(bank) => setSelectedBank(bank)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBlood;