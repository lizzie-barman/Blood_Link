import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import EmergencyRequestForm from '../../components/emergency/EmergencyRequestForm';
import { useBloodLink } from '../../hooks/useSocket';

export const CreateRequest = ({ onNavigateTab }) => {
  const navigate = useNavigate();
  const { createEmergencyRequest } = useBloodLink();

  const handleSubmit = async (formData) => {
    try {
      await createEmergencyRequest(formData);

      if (onNavigateTab) {
        onNavigateTab('requests');
      } else {
        navigate('/hospital/requests');
      }
    } catch (error) {
      console.error(
        'Emergency request creation failed:',
        error
      );

      alert(
        error?.message ||
          'Unable to create emergency request. Please try again.'
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-6)',
        maxWidth: '720px'
      }}
    >
      <DashboardHeader
        title="Broadcast Emergency Blood Request"
        subtitle="Submit a patient transfusion requisition to search all regional blood banks and registered donors."
      />

      <div
        className="card"
        style={{
          padding: 'var(--spacing-8)'
        }}
      >
        <EmergencyRequestForm
          onSubmit={handleSubmit}
          onCancel={() => {
            if (onNavigateTab) {
              onNavigateTab('dashboard');
            } else {
              navigate('/hospital');
            }
          }}
        />
      </div>
    </div>
  );
};

export default CreateRequest;