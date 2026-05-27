/**
 * Analytics Page
 * --------------
 * Displays detailed analytics for a specific shortened URL.
 * Shows click chart, device/browser/OS breakdowns, and recent visit history.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiArrowLeft,
  HiCursorArrowRays,
  HiClock,
  HiDevicePhoneMobile,
  HiGlobeAlt,
  HiComputerDesktop,
} from 'react-icons/hi2';
import api from '../services/api';
import ClickChart from '../components/ClickChart';
import StatsCards from '../components/StatsCards';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateTime, formatRelativeTime } from '../utils/formatDate';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const AnalyticsPage = () => {
  const { urlId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/${urlId}`);
        setAnalytics(res.data.data);
      } catch (error) {
        toast.error('Failed to load analytics');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [urlId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) return null;

  const { url, totalClicks, lastVisited, clickTimeline, browserStats, deviceStats, osStats, recentVisits } = analytics;
  const shortUrl = `${BASE_URL}/${url.shortCode}`;

  // Prepare stats cards
  const stats = [
    {
      label: 'Total Clicks',
      value: totalClicks,
      icon: HiCursorArrowRays,
      color: 'primary',
    },
    {
      label: 'Last Visited',
      value: lastVisited ? formatRelativeTime(lastVisited) : 'Never',
      icon: HiClock,
      color: 'accent',
    },
    {
      label: 'Top Browser',
      value: browserStats[0]?.browser || '—',
      icon: HiGlobeAlt,
      color: 'emerald',
      subtext: browserStats[0] ? `${browserStats[0].count} clicks` : undefined,
    },
    {
      label: 'Top Device',
      value: deviceStats[0]?.device || '—',
      icon: HiComputerDesktop,
      color: 'amber',
      subtext: deviceStats[0] ? `${deviceStats[0].count} clicks` : undefined,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Back Button + URL Info */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Analytics
        </h1>

        <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-primary-400 font-mono font-semibold text-lg">
              {shortUrl}
            </p>
            <p className="text-dark-400 text-sm truncate mt-1">
              → {url.originalUrl}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-dark-500">
            <span>Created {formatRelativeTime(url.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Click Timeline Chart */}
      <ClickChart data={clickTimeline} />

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Browser Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <HiGlobeAlt className="w-4 h-4 text-primary-400" />
            Browsers
          </h3>
          {browserStats.length === 0 ? (
            <p className="text-dark-500 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {browserStats.map((stat) => {
                const percentage = totalClicks > 0 ? (stat.count / totalClicks) * 100 : 0;
                return (
                  <div key={stat.browser}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">{stat.browser}</span>
                      <span className="text-dark-400">{stat.count}</span>
                    </div>
                    <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <HiDevicePhoneMobile className="w-4 h-4 text-accent-400" />
            Devices
          </h3>
          {deviceStats.length === 0 ? (
            <p className="text-dark-500 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {deviceStats.map((stat) => {
                const percentage = totalClicks > 0 ? (stat.count / totalClicks) * 100 : 0;
                const icon =
                  stat.device === 'mobile' ? '📱' :
                  stat.device === 'tablet' ? '📋' :
                  stat.device === 'desktop' ? '💻' : '❓';
                return (
                  <div key={stat.device}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">
                        {icon} {stat.device.charAt(0).toUpperCase() + stat.device.slice(1)}
                      </span>
                      <span className="text-dark-400">{stat.count}</span>
                    </div>
                    <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* OS Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <HiComputerDesktop className="w-4 h-4 text-emerald-400" />
            Operating Systems
          </h3>
          {osStats.length === 0 ? (
            <p className="text-dark-500 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {osStats.map((stat) => {
                const percentage = totalClicks > 0 ? (stat.count / totalClicks) * 100 : 0;
                return (
                  <div key={stat.os}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">{stat.os}</span>
                      <span className="text-dark-400">{stat.count}</span>
                    </div>
                    <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Visits Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-6 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <HiClock className="w-5 h-5 text-primary-400" />
            Recent Visits
          </h3>
        </div>

        {recentVisits.length === 0 ? (
          <div className="p-8 text-center text-dark-500">
            No visits recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Browser</th>
                  <th>OS</th>
                  <th>Device</th>
                  <th>Referrer</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.map((visit, index) => (
                  <tr key={index}>
                    <td className="text-dark-300 whitespace-nowrap">
                      {formatDateTime(visit.timestamp)}
                    </td>
                    <td>{visit.browser}</td>
                    <td>{visit.os}</td>
                    <td>
                      <span className="capitalize">{visit.device}</span>
                    </td>
                    <td className="max-w-[200px] truncate">{visit.referrer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;
