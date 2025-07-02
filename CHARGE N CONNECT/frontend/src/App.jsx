import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './components/customer/CustomerProfile';
import ProviderDashboard from './pages/ProviderDashboard';

// Placeholder component for provider dashboard
// const ProviderDashboard = () => <div>Provider Dashboard</div>;
const ProviderProfile = () => <div>Provider Profile</div>;

// Check for authentication
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return token && user;
};

// Get user role
const getUserRole = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user).role;
  }
  return null;
};

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const auth = isAuthenticated();
  const userRole = getUserRole();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected customer routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/customer/profile" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProfile />
          </ProtectedRoute>
        } />

        {/* Protected provider routes */}
        <Route path="/provider/dashboard" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/provider/profile" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderProfile />
          </ProtectedRoute>
        } />
        
        {/* Redirect from root to dashboard or login */}
        <Route path="/" element={
          isAuthenticated() ? (
            getUserRole() === 'customer' ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/provider/dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;