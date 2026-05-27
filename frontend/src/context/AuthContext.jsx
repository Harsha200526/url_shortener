/**
 * Auth Context
 * ------------
 * Provides global authentication state to the entire app.
 * Manages JWT token storage in localStorage, user data, and auth actions.
 *
 * Usage:
 *   const { user, login, register, logout, loading } = useAuth();
 */

import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True while checking token on mount

  /**
   * On mount: Check localStorage for existing token.
   * If found, validate it by fetching the user profile.
   */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
          // Token is invalid or expired — clean up
          localStorage.removeItem('token');
          setUser(null);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Register a new user.
   * Stores the JWT token and user data on success.
   */
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, ...userData } = res.data.data;

    localStorage.setItem('token', token);
    setUser(userData);

    return res.data;
  };

  /**
   * Login an existing user.
   * Stores the JWT token and user data on success.
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, ...userData } = res.data.data;

    localStorage.setItem('token', token);
    setUser(userData);

    return res.data;
  };

  /**
   * Logout: Remove token and clear user state.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
