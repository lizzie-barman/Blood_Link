import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import StatCard from '../components/dashboard/StatCard';
import { getInventory } from '../services/api';

export const Home = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNav = (target) => {
    if (onNavigate) {
      onNavigate(target);
      return;
    }
    if (target === 'search') navigate('/search-blood');
    else if (target === 'register') navigate('/register');
    else if (target === 'login') navigate('/login');
    else if (target === 'dashboard') navigate('/donor');
    else navigate('/');
  };

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const response = await getInventory();
        setInventory(response.inventory || []);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const activeInventory = inventory.filter((item) => !item.expired);

  const unitsAvailable = activeInventory.reduce(
    (total, item) => total + Number(item.units || 0),
    0
  );

  const bloodBankIds = new Set(
    activeInventory
      .filter((item) => item.bloodBankId?._id)
      .map((item) => item.bloodBankId._id)
  );

  const totalBloodBanks = bloodBankIds.size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: 'var(--spacing-12) 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-4)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-1) var(--spacing-3)',
          backgroundColor: 'var(--color-primary-100)',
          color: 'var(--color-primary-dark)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-semibold)'
        }}>
          <span>🚨</span> Emergency Blood Network Live
        </div>

        <h1 style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 'var(--font-weight-extrabold)',
          maxWidth: '800px',
          letterSpacing: '-0.02em'
        }}>
          Every Second Counts in Saving a Life. Connect with <span style={{ color: 'var(--color-primary)' }}>BloodLink</span>.
        </h1>

        <p style={{ maxWidth: '640px', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
          Real-time coordination platform connecting voluntary blood donors, emergency hospitals, and certified blood repositories within minutes.
        </p>

        <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="danger" size="lg" onClick={() => handleNav('search')}>
            Find Blood Now
          </Button>
          <Button variant="primary" size="lg" onClick={() => handleNav('register')}>
            Become a Donor
          </Button>
          <Button variant="secondary" size="lg" onClick={() => handleNav('dashboard')}>
            Enter Portal
          </Button>
        </div>
      </section>

      {/* Live Stats */}
      <section className="grid grid-cols-4 gap-4">
        <StatCard
          title="Registered Donors"
          value="—"
          icon="👥"
          change="Coming soon"
        />

        <StatCard
          title="Active Requests"
          value="—"
          icon="🚨"
          change="Coming soon"
        />

        <StatCard
          title="Blood Units Ready"
          value={loading ? '...' : unitsAvailable.toLocaleString()}
          icon="🩸"
          change={loading ? 'Loading live inventory' : `Across ${totalBloodBanks} centers`}
          trend="positive"
        />

        <StatCard
          title="Lives Impacted"
          value="—"
          icon="❤️"
          change="Coming soon"
        />
      </section>

      {/* Role Portals Information */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>🩸</div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-2)' }}>For Blood Donors</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
            Get notified of urgent transfusion requirements near you, track donation eligibility, and maintain a verified digital donation record.
          </p>
          <Button variant="secondary" size="sm" onClick={() => handleNav('register')}>
            Join as Donor
          </Button>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>🏥</div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-2)' }}>For Hospitals</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
            Broadcast emergency blood requirements directly to nearby verified blood banks and registered compatible donors in seconds.
          </p>
          <Button variant="secondary" size="sm" onClick={() => handleNav('register')}>
            Hospital Onboarding
          </Button>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>🏢</div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-2)' }}>For Blood Banks</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
            Manage real-time blood stock counts, automate shortage alerts, coordinate replenishment, and synchronize with national registries.
          </p>
          <Button variant="secondary" size="sm" onClick={() => handleNav('register')}>
            Register Facility
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;