import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchBlood from './pages/SearchBlood';

import DonorDashboard from './pages/donor/DonorDashboard';
import DonorRequests from './pages/donor/DonorRequests';
import DonorHistory from './pages/donor/DonorHistory';
import DonorProfile from './pages/donor/DonorProfile';

import HospitalDashboard from './pages/hospital/HospitalDashboard';
import CreateRequest from './pages/hospital/CreateRequest';
import HospitalRequests from './pages/hospital/HospitalRequests';
import RequestDetails from './pages/hospital/RequestDetails';

import BloodBankDashboard from './pages/bloodbank/BloodBankDashboard';
import Inventory from './pages/bloodbank/Inventory';
import BloodBankProfile from './pages/bloodbank/BloodBankProfile';
import BloodBankRequests from './pages/bloodbank/BloodBankRequests';

import Notifications from './pages/Notifications';

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('bloodlink_user');

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
};

const getRole = (user) => {
  return String(user?.role || '')
    .toLowerCase()
    .replace('_', '');
};

const getRoleHome = (role) => {
  if (role === 'hospital') {
    return '/hospital';
  }

  if (role === 'bloodbank') {
    return '/bloodbank';
  }

  return '/donor';
};

const ProtectedRoute = ({
  allowedRoles,
  children
}) => {
  const location = useLocation();

  const token = localStorage.getItem('bloodlink_token');
  const user = getStoredUser();

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    );
  }

  const role = getRole(user);

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to={getRoleHome(role)}
        replace
      />
    );
  }

  return children;
};

const AuthenticatedRoute = ({ children }) => {
  const token =
    localStorage.getItem('bloodlink_token');

  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/search-blood"
          element={<SearchBlood />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
      </Route>

      <Route element={<DashboardLayout />}>
        {/* =========================
            DONOR
        ========================= */}

        <Route
          path="/donor"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/requests"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/history"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/profile"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorProfile />
            </ProtectedRoute>
          }
        />

        {/* =========================
            HOSPITAL
        ========================= */}

        <Route
          path="/hospital"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital/create-request"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <CreateRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital/requests"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <HospitalRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital/requests/:id"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <RequestDetails />
            </ProtectedRoute>
          }
        />

        {/* =========================
            BLOOD BANK
        ========================= */}

        <Route
          path="/bloodbank"
          element={
            <ProtectedRoute allowedRoles={['bloodbank']}>
              <BloodBankDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bloodbank/inventory"
          element={
            <ProtectedRoute allowedRoles={['bloodbank']}>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bloodbank/requests"
          element={
            <ProtectedRoute allowedRoles={['bloodbank']}>
              <BloodBankRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bloodbank/profile"
          element={
            <ProtectedRoute allowedRoles={['bloodbank']}>
              <BloodBankProfile />
            </ProtectedRoute>
          }
        />

        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <Route
          path="/notifications"
          element={
            <AuthenticatedRoute>
              <Notifications />
            </AuthenticatedRoute>
          }
        />
      </Route>

      {/* Never allow an unauthenticated/unknown route to expose
          a dashboard or request creation screen. */}
      <Route
        path="/dashboard"
        element={<Navigate to="/" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default App;