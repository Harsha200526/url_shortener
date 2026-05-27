/**
 * Auth Layout
 * -----------
 * Layout wrapper for login and register pages.
 * Displays a centered card on a gradient background with the app logo.
 */

import { motion } from 'framer-motion';
import { Link, Outlet } from 'react-router-dom';
import { HiLink } from 'react-icons/hi2';

const AuthLayout = () => {
  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
              <HiLink className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Sniplink</span>
          </Link>
        </motion.div>

        {/* Auth Card — Content rendered by child route */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-8"
        >
          <Outlet />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-dark-500 text-sm mt-6"
        >
          © {new Date().getFullYear()} Sniplink. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default AuthLayout;
