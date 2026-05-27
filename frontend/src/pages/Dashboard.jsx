/**
 * Dashboard Page
 * --------------
 * Main authenticated page displaying:
 * - Summary stats cards
 * - URL creation form
 * - CSV bulk upload
 * - Table of all user's URLs
 * - Edit URL modal
 * - QR code modal
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiLink, HiCursorArrowRays, HiClock, HiChartBar } from 'react-icons/hi2';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import StatsCards from '../components/StatsCards';
import UrlForm from '../components/UrlForm';
import UrlTable from '../components/UrlTable';
import CsvUpload from '../components/CsvUpload';
import QrCodeModal from '../components/QrCodeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatRelativeTime } from '../utils/formatDate';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [qrUrl, setQrUrl] = useState(null); // URL object for QR modal
  const [editUrl, setEditUrl] = useState(null); // URL object for edit mode

  /**
   * Fetch all URLs for the current user.
   */
  const fetchUrls = useCallback(async () => {
    try {
      const res = await api.get('/urls');
      setUrls(res.data.data);
    } catch (error) {
      toast.error('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  /**
   * Create a new short URL.
   */
  const handleCreate = async (formData) => {
    setCreating(true);
    try {
      const payload = {
        originalUrl: formData.originalUrl,
        ...(formData.customAlias && { customAlias: formData.customAlias }),
        ...(formData.expiryDate && { expiryDate: formData.expiryDate }),
      };

      await api.post('/urls', payload);
      toast.success('URL shortened successfully!');
      fetchUrls(); // Refresh the list
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create short URL';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  /**
   * Update an existing URL.
   */
  const handleUpdate = async (formData) => {
    if (!editUrl) return;
    setCreating(true);

    try {
      const payload = {
        originalUrl: formData.originalUrl,
        expiryDate: formData.expiryDate || null,
      };

      await api.put(`/urls/${editUrl._id}`, payload);
      toast.success('URL updated successfully!');
      setEditUrl(null);
      fetchUrls();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update URL';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  /**
   * Delete a URL.
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/urls/${id}`);
      toast.success('URL deleted successfully');
      setUrls(urls.filter((url) => url._id !== id));
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  /**
   * Handle CSV file upload for bulk URL creation.
   */
  const handleCsvUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/urls/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { created, failed, errors } = res.data.data;
      toast.success(`${created} URLs created successfully${failed > 0 ? `, ${failed} failed` : ''}`);

      if (errors && errors.length > 0) {
        errors.forEach((err) => {
          toast.error(`Row ${err.row}: ${err.error}`, { duration: 5000 });
        });
      }

      fetchUrls();
    } catch (error) {
      const message =
        error.response?.data?.message || 'CSV upload failed';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  // --- Compute Dashboard Stats ---
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const activeLinks = urls.filter(
    (url) => !url.expiryDate || new Date(url.expiryDate) > new Date()
  ).length;
  const latestUrl = urls.length > 0 ? urls[0] : null;

  const stats = [
    {
      label: 'Total Links',
      value: urls.length,
      icon: HiLink,
      color: 'primary',
    },
    {
      label: 'Total Clicks',
      value: totalClicks,
      icon: HiCursorArrowRays,
      color: 'accent',
    },
    {
      label: 'Active Links',
      value: activeLinks,
      icon: HiChartBar,
      color: 'emerald',
    },
    {
      label: 'Last Created',
      value: latestUrl ? formatRelativeTime(latestUrl.createdAt) : '—',
      icon: HiClock,
      color: 'amber',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-dark-400 mt-1">
          Manage your shortened URLs and view analytics
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* URL Creation Form */}
      {editUrl ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Editing URL</h2>
            <button
              onClick={() => setEditUrl(null)}
              className="text-sm text-dark-400 hover:text-white transition-colors"
            >
              ← Cancel Edit
            </button>
          </div>
          <UrlForm
            onSubmit={handleUpdate}
            loading={creating}
            editMode
            initialData={editUrl}
          />
        </div>
      ) : (
        <UrlForm onSubmit={handleCreate} loading={creating} />
      )}

      {/* CSV Bulk Upload */}
      <CsvUpload onUpload={handleCsvUpload} loading={uploading} />

      {/* URLs Table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Your Links ({urls.length})
        </h2>
        <UrlTable
          urls={urls}
          onDelete={handleDelete}
          onEdit={setEditUrl}
          onViewQr={setQrUrl}
          onViewAnalytics={(url) => navigate(`/analytics/${url._id}`)}
          loading={loading}
        />
      </div>

      {/* QR Code Modal */}
      {qrUrl && <QrCodeModal url={qrUrl} onClose={() => setQrUrl(null)} />}
    </motion.div>
  );
};

export default Dashboard;
