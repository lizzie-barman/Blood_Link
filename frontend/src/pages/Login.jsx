import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useBloodLink } from '../hooks/useSocket';
import { loginUser } from '../services/api';

export const Login = ({ onLogin, onNavigate }) => {
  const navigate = useNavigate();
  const { setCurrentRole } = useBloodLink();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password
      });

      localStorage.setItem(
        'bloodlink_token',
        response.token
      );

      localStorage.setItem(
        'bloodlink_user',
        JSON.stringify(response.user)
      );

      const actualRole = String(response.user.role || '')
        .toLowerCase()
        .replace('_', '');

      setCurrentRole(actualRole);

      if (onLogin) {
        onLogin(response.user);
      }

      if (actualRole === 'hospital') {
        navigate('/hospital');
      } else if (actualRole === 'bloodbank') {
        navigate('/bloodbank');
      } else {
        navigate('/donor');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '440px',
        margin: 'var(--spacing-8) auto'
      }}
    >
      <div
        className="card"
        style={{
          padding: 'var(--spacing-8)'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-6)'
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>
            🩸
          </span>

          <h2 style={{ marginTop: 'var(--spacing-2)' }}>
            Welcome to BloodLink
          </h2>

          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--spacing-1)'
            }}
          >
            Log in to manage blood requests and donations
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
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="you@domain.org"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <Button
            type="submit"
            variant="primary"
            style={{
              marginTop: 'var(--spacing-2)'
            }}
            disabled={loading}
          >
            {loading
              ? 'Signing In...'
              : 'Sign In to Dashboard'}
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
          Don't have an account?{' '}

          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('register');
              } else {
                navigate('/register');
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
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;