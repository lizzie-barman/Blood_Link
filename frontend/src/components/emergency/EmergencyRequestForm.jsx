import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { ConfirmationModal } from '../common/Modal';
import { BLOOD_GROUPS } from '../../utils/constants';

export const EmergencyRequestForm = ({
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const [formData, setFormData] = useState({
  hospitalName: initialData.hospitalName || '',
  location: initialData.location || '',
  patientId:
    initialData.patientId ||
    `PT-${Math.floor(1000 + Math.random() * 9000)}`,
  bloodGroup: initialData.bloodGroup || 'O+',
  component: initialData.component || 'PLATELETS',
  unitsRequired: initialData.unitsRequired || 1,
  urgency: initialData.urgency || 'CRITICAL',
  requiredBy: initialData.requiredBy || '',
  notes: initialData.notes || ''
});

  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] =
    useState(false);

  const validate = () => {
    const errs = {};

    if (!formData.hospitalName.trim()) {
      errs.hospitalName =
        'Hospital name is required';
    }

    if (!formData.location.trim()) {
      errs.location =
        'Hospital address / location is required';
    }

    if (!formData.patientId.trim()) {
      errs.patientId =
        'Patient ID is required';
    }

    if (
      !formData.unitsRequired ||
      formData.unitsRequired <= 0
    ) {
      errs.unitsRequired =
        'Please specify at least 1 unit';
    }

    if (
      ![
        'WHOLE_BLOOD',
        'PLASMA',
        'PLATELETS'
      ].includes(formData.component)
    ) {
      errs.component =
        'Please select a valid blood component';
    }

    if (
      ![
        'CRITICAL',
        'URGENT',
        'NORMAL'
      ].includes(formData.urgency)
    ) {
      errs.urgency =
        'Please select a valid urgency level';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmedSubmit = () => {
    setShowConfirmModal(false);

    if (onSubmit) {
      const requestData = {
        hospitalName:
          formData.hospitalName.trim(),
        hospitalPhone:
          initialData.hospitalPhone || '',
        bloodGroup:
          formData.bloodGroup,
        component:
          formData.component,
        unitsRequired:
          Number(formData.unitsRequired),
        urgency:
          formData.urgency,
        radius: 10,
        location: {
          lat:
            initialData.location?.lat ??
            22.5726,
          lng:
            initialData.location?.lng ??
            88.3639
        }
      };

      onSubmit(requestData);
    }
  };

  return (
    <>
      <form
        onSubmit={handlePreSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-4)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--spacing-4)'
          }}
        >
          <Input
            label="Hospital / Medical Facility"
            required
            placeholder="e.g. Apollo Gleneagles Hospital"
            value={formData.hospitalName}
            error={errors.hospitalName}
            onChange={(e) =>
              setFormData({
                ...formData,
                hospitalName: e.target.value
              })
            }
          />

          <Input
            label="Hospital Location / Ward Area"
            required
            placeholder="e.g. Salt Lake Sector 3, Kolkata"
            value={formData.location}
            error={errors.location}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: e.target.value
              })
            }
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--spacing-4)'
          }}
        >
          <Input
            label="Patient ID / Case Ref"
            required
            placeholder="e.g. PT-8831"
            value={formData.patientId}
            error={errors.patientId}
            onChange={(e) =>
              setFormData({
                ...formData,
                patientId: e.target.value
              })
            }
          />

          <Select
            label="Blood Group"
            required
            value={formData.bloodGroup}
            options={BLOOD_GROUPS}
            onChange={(e) =>
              setFormData({
                ...formData,
                bloodGroup: e.target.value
              })
            }
          />

          <Select
            label="Component"
            required
            value={formData.component}
            options={[
              {
                value: 'WHOLE_BLOOD',
                label: 'Whole Blood'
              },
              {
                value: 'PLASMA',
                label: 'Plasma'
              },
              {
                value: 'PLATELETS',
                label: 'Platelets'
              }
            ]}
            onChange={(e) =>
              setFormData({
                ...formData,
                component: e.target.value
              })
            }
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--spacing-4)'
          }}
        >
          <Input
            label="Units Required"
            type="number"
            min="1"
            max="20"
            required
            value={formData.unitsRequired}
            error={errors.unitsRequired}
            onChange={(e) =>
              setFormData({
                ...formData,
                unitsRequired:
                  Number(e.target.value)
              })
            }
          />

          <Select
            label="Urgency Level"
            required
            value={formData.urgency}
            options={[
              {
                value: 'CRITICAL',
                label:
                  '🚨 Critical (Immediate Transfusion)'
              },
              {
                value: 'URGENT',
                label:
                  '⚠️ Urgent (Within 4-6 Hours)'
              },
              {
                value: 'NORMAL',
                label:
                  'ℹ️ Normal (Scheduled)'
              }
            ]}
            onChange={(e) =>
              setFormData({
                ...formData,
                urgency: e.target.value
              })
            }
          />

          <Input
            label="Required By"
            placeholder="e.g. Within 2 hours / 21:00 PM"
            value={formData.requiredBy}
            onChange={(e) =>
              setFormData({
                ...formData,
                requiredBy: e.target.value
              })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Clinical Indication / Emergency Notes
          </label>

          <textarea
            rows="3"
            className="form-input"
            placeholder="Provide relevant clinical info for donors and regional blood depots..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value
              })
            }
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-3)',
            marginTop: 'var(--spacing-2)'
          }}
        >
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="danger"
            size="lg"
          >
            Broadcast Emergency Request
          </Button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() =>
          setShowConfirmModal(false)
        }
        onConfirm={handleConfirmedSubmit}
        title="Broadcast Emergency Requisition?"
        message={`You are requesting ${formData.unitsRequired} units of ${formData.bloodGroup} ${formData.component === 'WHOLE_BLOOD' ? 'Whole Blood' : formData.component === 'PLASMA' ? 'Plasma' : 'Platelets'} for ${formData.hospitalName}. This will immediately alert eligible donors and regional blood banks.`}
        confirmLabel="Confirm & Broadcast"
        cancelLabel="Review Details"
        variant="danger"
      />
    </>
  );
};

export default EmergencyRequestForm;