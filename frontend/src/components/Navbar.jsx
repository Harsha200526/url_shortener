/**
 * Navbar Component
 * ----------------
 * Top navigation bar for the dashboard.
 * Shows the hamburger menu button on mobile, page title area, and user profile dropdown.
 */

import { useState, useRef, useEffect } from 'react';
import { HiBars3, HiUser, HiArrowRightOnRectangle } from 'react-icons/hi2';
import useAuth from '../hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
        {/* Left: Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          aria-label="Open sidebar"
        >
          <HiBars3 className="w-6 h-6" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-dark-800 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-pure-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-dark-200">
              {user?.name || 'User'}
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-card py-2 animate-slide-down">
              <div className="px-4 py-3 border-b border-dark-700">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-dark-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-dark-800 transition-colors"
              >
                <HiArrowRightOnRectangle className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
