/**
 * App Component — Root Router
 * ---------------------------
 * Defines all application routes and their layouts.
 *
 * Route Structure:
 * - / .............. Landing page (public)
 * - /login ......... Login page (public, auth layout)
 * - /register ...... Register page (public, auth layout)
 * - /dashboard ..... Main dashboard (protected, dashboard layout)
 * - /analytics/:id . URL analytics (protected, dashboard layout)
 * - /stats/:code ... Public stats page
 * - * .............. 404 Not Found
 */

import { Routes, Route } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import PublicStats from './pages/PublicStats';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/stats/:shortCode" element={<PublicStats />} />

      {/* Auth Routes (shared layout) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics/:urlId" element={<AnalyticsPage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
