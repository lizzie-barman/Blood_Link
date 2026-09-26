import React from 'react';
import { formatDateTime } from '../../utils/formatters';

export const RequestTimeline = ({ stages = [] }) => {
  const defaultStages = [
    { title: 'Emergency Request Created', time: 'Just now', completed: true, active: false },
    { title: 'Matching Nearby Donors', time: 'In progress', completed: true, active: true },
    { title: 'Donor Accepted & Dispatched', time: 'Pending', completed: false, active: false },
    { title: 'Hospital Delivery & Transfusion', time: 'Pending', completed: false, active: false }
  ];

  const timelineItems = stages.length > 0 ? stages : defaultStages;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'relative' }}>
      {timelineItems.map((stage, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: stage.completed
              ? 'var(--color-success)'
              : stage.active
              ? 'var(--color-primary)'
              : 'var(--color-border)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-xs)',
            flexShrink: 0
          }}>
            {stage.completed ? '✓' : idx + 1}
          </div>
          <div>
            <div style={{
              fontWeight: stage.active ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
              color: stage.active ? 'var(--color-primary)' : 'var(--color-text-primary)'
            }}>
              {stage.title || stage.stage}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              {stage.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestTimeline;
