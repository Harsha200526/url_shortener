/**
 * useAuth Hook
 * ------------
 * A convenience hook to access the AuthContext.
 * Throws a helpful error if used outside of an AuthProvider.
 *
 * Usage:
 *   const { user, login, logout } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;
