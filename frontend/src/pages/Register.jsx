import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { BLOOD_GROUPS, USER_ROLES } from '../utils/constants';
import { useBloodLink } from '../hooks/useSocket';
import { registerUser } from '../services/api';

export const Register = ({ onRegister, onNavigate }) => {
  const navigate = useNavigate();
  const { setCurrentRole } = useBloodLink();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: USER_ROLES.DONOR,
    bloodGroup: 'O+',
    phone: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formattedRole = formData.role.toLowerCase().replace('_', '');

    const response = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formattedRole,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      location: {
        lat: 22.5726,
        lng: 88.3639
      }
    });

    if (response?.token) {
      localStorage.setItem('bloodlink_token', response.token);
    }

    if (response?.user) {
      localStorage.setItem('bloodlink_user', JSON.stringify(response.user));
    }

    setCurrentRole(formattedRole);

    if (formattedRole === 'hospital') {
      navigate('/hospital');
    } else if (formattedRole === 'bloodbank') {
      navigate('/bloodbank');
    } else {
      navigate('/donor');
    }
  } catch (error) {
    console.error('Registration failed:', error);
    alert(error.message || 'Registration failed');
  }
};

  return (
    <div style={{ maxWidth: '520px', margin: 'var(--spacing-8) auto' }}>
      <div className="card" style={{ padding: 'var(--spacing-8)' }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-6)'
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>🩸</span>

          <h2 style={{ marginTop: 'var(--spacing-2)' }}>
            Join BloodLink Network
          </h2>

          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--spacing-1)'
            }}
          >
            Register as a Donor, Hospital Partner, or Certified Blood Bank
          </p>
        </div>

        {error && (
          <div
            style={{
              color: 'red',
              marginBottom: 'var(--spacing-4)',
              padding: '10px',
              borderRadius: '8px',
              background: '#fff1f1'
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-4)'
          }}
        >
          <Select
            label="Account Category"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            options={[
              {
                value: USER_ROLES.DONOR,
                label: 'Voluntary Blood Donor'
              },
              {
                value: USER_ROLES.HOSPITAL,
                label: 'Hospital Emergency Unit'
              },
              {
                value: USER_ROLES.BLOOD_BANK,
                label: 'Certified Blood Bank'
              }
            ]}
          />

          <Input
            label={
              formData.role === USER_ROLES.DONOR
                ? 'Full Name'
                : 'Facility / Organization Name'
            }
            required
            placeholder={
              formData.role === USER_ROLES.DONOR
                ? 'Jane Doe'
                : 'Metro General Hospital'
            }
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-4)'
            }}
          >
            <Input
              label="Contact Phone"
              required
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) =>
                handleChange('phone', e.target.value)
              }
            />

            {formData.role === USER_ROLES.DONOR ? (
              <Select
                label="Blood Group"
                value={formData.bloodGroup}
                onChange={(e) =>
                  handleChange('bloodGroup', e.target.value)
                }
                options={BLOOD_GROUPS}
              />
            ) : (
              <Input
                label="Registration License #"
                placeholder="REG-2026-X"
                value={formData.address}
                onChange={(e) =>
                  handleChange('address', e.target.value)
                }
              />
            )}
          </div>

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="contact@entity.org"
            value={formData.email}
            onChange={(e) =>
              handleChange('email', e.target.value)
            }
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="Create secure password"
            value={formData.password}
            onChange={(e) =>
              handleChange('password', e.target.value)
            }
          />

          <div
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)'
            }}
          >
            📍 Your current location will be used for nearby donor
            matching and blood-bank searches.
          </div>

          <Button
            type="submit"
            variant="primary"
            style={{ marginTop: 'var(--spacing-2)' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </form>

        <div
          style={{
            marginTop: 'var(--spacing-6)',
            textAlign: 'center',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)'
          }}
        >
          Already have an account?{' '}

          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('login');
              } else {
                navigate('/login');
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer'
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;