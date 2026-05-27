/**
 * Sidebar Component
 * -----------------
 * Fixed sidebar navigation for the dashboard.
 * Contains the logo, nav links, and is responsive (slides in on mobile).
 */

import { NavLink, Link } from 'react-router-dom';
import { HiLink, HiHome, HiChartBar, HiXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { to: '/dashboard', icon: HiChartBar, label: 'My Links', end: true },
];

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-dark-700/50">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
            <HiLink className="w-5 h-5 text-pure-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Sniplink</span>
        </Link>

        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
        >
          <HiXMark className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
          onClick={onClose}
        >
          <HiHome className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-6 border-t border-dark-700/50">
        <div className="glass-card p-4">
          <p className="text-xs text-dark-400 mb-1">Powered by</p>
          <p className="text-sm font-semibold gradient-text">Sniplink v1.0</p>
          <p className="text-xs text-dark-500 mt-1">URL Shortener & Analytics</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col sidebar-gradient border-r border-dark-700/50 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar — slides in from the left */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-64 flex flex-col sidebar-gradient border-r border-dark-700/50 z-40 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
