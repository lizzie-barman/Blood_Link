import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import InventoryTable from '../../components/blood/InventoryTable';
import { useBloodLink } from '../../hooks/useSocket';

export const BloodBankDashboard = ({ onNavigateTab }) => {
  const navigate = useNavigate();
  const { inventory } = useBloodLink();

  const currentInventory = inventory || [];

  const activeInventory = currentInventory.filter((item) => !item.expired);

  const totalUnits = activeInventory.reduce(
    (total, item) => total + Number(item.units || 0),
    0
  );

  const expiredCount = currentInventory.filter((item) => item.expired).length;

  const lastUpdated = currentInventory.length
    ? currentInventory.reduce((latest, item) => {
        if (!item.updatedAt) return latest;
        if (!latest) return item.updatedAt;
        return new Date(item.updatedAt) > new Date(latest)
          ? item.updatedAt
          : latest;
      }, null)
    : null;

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleString()
    : 'No inventory data';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <DashboardHeader
        title="Metro Blood Bank Operations"
        subtitle="Live inventory surveillance, depletion forecasts, and emergency cross-matching."
        actionLabel="Manage Inventory"
        onAction={() => {
          if (onNavigateTab) onNavigateTab('inventory');
          else navigate('/bloodbank/inventory');
        }}
      />

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Available Units"
          value={totalUnits}
          icon="🩸"
          change="From live inventory"
          trend="positive"
        />

        <StatCard
          title="Expired Inventory"
          value={expiredCount}
          icon="⚠️"
          change="Excluded from availability"
          trend={expiredCount > 0 ? 'negative' : 'positive'}
        />

        <StatCard
          title="Inventory Records"
          value={currentInventory.length}
          icon="📦"
          change="Live database records"
          trend="neutral"
        />

        <StatCard
          title="Blood Banks"
          value={
            new Set(
              activeInventory
                .filter((item) => item.bloodBankId?._id)
                .map((item) => item.bloodBankId._id)
            ).size
          }
          icon="🏥"
          change="With active inventory"
          trend="positive"
        />
      </div>

      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-4)'
          }}
        >
          <h3 style={{ fontSize: 'var(--font-size-md)' }}>
            Live Inventory
          </h3>

          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)'
            }}
          >
            Updated {formattedLastUpdated}
          </span>
        </div>

        <InventoryTable inventory={currentInventory} />
      </div>
    </div>
  );
};

export default BloodBankDashboard;