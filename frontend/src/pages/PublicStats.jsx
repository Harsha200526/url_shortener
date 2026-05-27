/**
 * Public Stats Page
 * -----------------
 * Displays limited analytics for a short URL without authentication.
 * Shows total clicks and click timeline.
 * Accessible at: /stats/:shortCode
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiLink,
  HiCursorArrowRays,
  HiCalendarDays,
  HiArrowTopRightOnSquare,
} from 'react-icons/hi2';
import api from '../services/api';
import ClickChart from '../components/ClickChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatDate';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const PublicStats = () => {
  const { shortCode } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await api.get(`/analytics/public/${shortCode}`);
        setStats(res.data.data);
      } catch (err) {
        setError('URL not found or stats unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStats();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="glass-card p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-dark-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiLink className="w-8 h-8 text-dark-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Not Found</h2>
          <p className="text-dark-400 mb-6">{error}</p>
          <Link to="/" className="btn-primary inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const shortUrl = `${BASE_URL}/${stats.shortCode}`;

  return (
    <div className="min-h-screen bg-dark-950 hero-gradient">
      {/* Header */}
      <header className="border-b border-dark-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <HiLink className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Sniplink</span>
          </Link>
          <span className="text-xs text-dark-500">Public Stats</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        {/* URL Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center"
        >
          <h1 className="text-2xl font-bold text-white mb-4">Link Statistics</h1>

          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-primary-400 font-mono font-semibold hover:text-primary-300 transition-colors inline-flex items-center gap-2"
          >
            {shortUrl}
            <HiArrowTopRightOnSquare className="w-4 h-4" />
          </a>

          <p className="text-dark-400 text-sm mt-2 truncate">
            → {stats.originalUrl}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 text-center"
          >
            <HiCursorArrowRays className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{stats.totalClicks}</p>
            <p className="text-sm text-dark-400">Total Clicks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 text-center"
          >
            <HiCalendarDays className="w-8 h-8 text-accent-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">
              {formatDate(stats.createdAt)}
            </p>
            <p className="text-sm text-dark-400">Created On</p>
          </motion.div>
        </div>

        {/* Click Timeline Chart */}
        <ClickChart data={stats.clickTimeline} title="Click Trends" />
      </main>
    </div>
  );
};

export default PublicStats;
