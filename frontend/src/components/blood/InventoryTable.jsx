import React, { useState, useMemo } from 'react';
import BloodGroupBadge from './BloodGroupBadge';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { formatUnits, formatDateTime } from '../../utils/formatters';
import { BLOOD_GROUPS } from '../../utils/constants';

export const InventoryTable = ({
  inventory = [],
  onUpdateStock,
  editable = false
}) => {
  const [editingRow, setEditingRow] = useState(null);
  const [rowInputs, setRowInputs] = useState({ wholeBlood: 0, platelets: 0, plasma: 0 });

  // Transform raw backend inventory array into grouped rows by blood type
  const groupedInventory = useMemo(() => {
    const groups = {};
    BLOOD_GROUPS.forEach(bg => {
      groups[bg] = { bloodGroup: bg, wholeBlood: 0, platelets: 0, plasma: 0, lastUpdated: null };
    });

    inventory.forEach(item => {
      if (!item.bloodGroup || item.expired) return;
      const group = groups[item.bloodGroup];
      if (!group) return;

      const units = Number(item.units) || 0;
      if (item.component === 'WHOLE_BLOOD') group.wholeBlood += units;
      else if (item.component === 'PLATELETS') group.platelets += units;
      else if (item.component === 'PLASMA') group.plasma += units;

      if (item.updatedAt) {
        if (!group.lastUpdated || new Date(item.updatedAt) > new Date(group.lastUpdated)) {
          group.lastUpdated = item.updatedAt;
        }
      }
    });

    return Object.values(groups).map(group => {
      const total = group.wholeBlood + group.platelets + group.plasma;
      let status = 'ADEQUATE';
      if (total === 0) status = 'CRITICAL';
      else if (total < 10) status = 'LOW';
      return { ...group, status };
    });
  }, [inventory]);

  const startEdit = (item) => {
    setEditingRow(item.bloodGroup);
    setRowInputs({
      wholeBlood: item.wholeBlood || 0,
      platelets: item.platelets || 0,
      plasma: item.plasma || 0
    });
  };

  const handleSave = (bloodGroup) => {
    if (onUpdateStock) {
      // Send all inputs together to the parent
      onUpdateStock(bloodGroup, rowInputs);
    }
    setEditingRow(null);
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Blood Group</th>
            <th>Whole Blood</th>
            <th>Platelets</th>
            <th>Plasma</th>
            <th>Total Available</th>
            <th>Inventory Status</th>
            <th>Last Updated</th>
            {editable && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {groupedInventory.map((item) => {
            const isEditing = editingRow === item.bloodGroup;
            const totalUnits = item.wholeBlood + item.platelets + item.plasma;

            return (
              <tr key={item.bloodGroup}>
                <td style={{ verticalAlign: 'middle' }}>
                  <BloodGroupBadge bloodGroup={item.bloodGroup} size="sm" />
                </td>

                <td style={{ verticalAlign: 'middle' }}>
                  {isEditing ? (
                    <input type="number" min="0" className="form-input" style={{ width: '80px', padding: '4px 8px' }} value={rowInputs.wholeBlood} onChange={(e) => setRowInputs({ ...rowInputs, wholeBlood: e.target.value })} />
                  ) : (
                    <strong>{formatUnits(item.wholeBlood)}</strong>
                  )}
                </td>

                <td style={{ verticalAlign: 'middle' }}>
                  {isEditing ? (
                    <input type="number" min="0" className="form-input" style={{ width: '80px', padding: '4px 8px' }} value={rowInputs.platelets} onChange={(e) => setRowInputs({ ...rowInputs, platelets: e.target.value })} />
                  ) : (
                    <span>{formatUnits(item.platelets)}</span>
                  )}
                </td>

                <td style={{ verticalAlign: 'middle' }}>
                  {isEditing ? (
                    <input type="number" min="0" className="form-input" style={{ width: '80px', padding: '4px 8px' }} value={rowInputs.plasma} onChange={(e) => setRowInputs({ ...rowInputs, plasma: e.target.value })} />
                  ) : (
                    <span>{formatUnits(item.plasma)}</span>
                  )}
                </td>

                <td style={{ verticalAlign: 'middle', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-dark)' }}>
                  {formatUnits(totalUnits)}
                </td>

                <td style={{ verticalAlign: 'middle' }}>
                  <StatusBadge status={item.status} />
                </td>

                <td style={{ verticalAlign: 'middle', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                  {item.lastUpdated ? formatDateTime(item.lastUpdated) : '—'}
                </td>

                {editable && (
                  <td style={{ verticalAlign: 'middle' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Button variant="primary" size="sm" onClick={() => handleSave(item.bloodGroup)}>Save</Button>
                        <Button variant="secondary" size="sm" onClick={() => setEditingRow(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(item)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                        ✏️ Update Units
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;