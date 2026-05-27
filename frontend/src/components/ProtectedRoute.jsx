/**
 * Protected Route Component
 * -------------------------
 * Wraps routes that require authentication.
 * Redirects to /login if the user is not authenticated.
 * Shows a loading spinner while checking auth state on initial load.
 */

import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Still checking if token is valid
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not authenticated — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render the child route
  return children;
};

export default ProtectedRoute;
