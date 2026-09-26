import React from 'react';
import BloodGroupBadge from '../blood/BloodGroupBadge';
import StatusBadge from '../common/StatusBadge';
import { formatDate, formatUnits } from '../../utils/formatters';

export const DonationHistory = ({ donations = [] }) => {
  const defaultHistory = [
    { id: 'don-1', centerName: 'Metro City Central Blood Bank', date: '2026-05-14', units: 1, bloodGroup: 'O-', status: 'COMPLETED' },
    { id: 'don-2', centerName: 'St. Jude Blood Drive', date: '2026-01-20', units: 1, bloodGroup: 'O-', status: 'COMPLETED' },
    { id: 'don-3', centerName: 'Red Cross Mobile Van', date: '2025-09-08', units: 1, bloodGroup: 'O-', status: 'COMPLETED' }
  ];

  const list = donations.length > 0 ? donations : defaultHistory;

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Center / Event</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Blood Group</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Volume Donated</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Donation Date</th>
            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Verification Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 'var(--font-weight-medium)' }}>
                {item.centerName}
              </td>
              <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                <BloodGroupBadge bloodGroup={item.bloodGroup} size="sm" />
              </td>
              <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                {formatUnits(item.units)}
              </td>
              <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)' }}>
                {formatDate(item.date)}
              </td>
              <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationHistory;
