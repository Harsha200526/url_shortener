/**
 * URL Table Component
 * -------------------
 * Displays all shortened URLs in a responsive table/card layout.
 * Actions: copy short URL, view analytics, edit, delete, view QR code.
 *
 * Props:
 *   urls: Array of URL objects
 *   onDelete(id): Called when delete is clicked
 *   onEdit(url): Called when edit is clicked
 *   onViewQr(url): Called when QR button is clicked
 *   onViewAnalytics(url): Called when analytics button is clicked
 *   loading: Loading state
 */

import { motion } from 'framer-motion';
import {
  HiTrash,
  HiPencilSquare,
  HiClipboard,
  HiChartBar,
  HiQrCode,
  HiArrowTopRightOnSquare,
} from 'react-icons/hi2';
import { formatDate, formatRelativeTime } from '../utils/formatDate';
import copyToClipboard from '../utils/copyToClipboard';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const UrlTable = ({ urls, onDelete, onEdit, onViewQr, onViewAnalytics, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-dark-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-12 text-center"
      >
        <div className="w-16 h-16 bg-dark-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiClipboard className="w-8 h-8 text-dark-500" />
        </div>
        <h3 className="text-lg font-semibold text-dark-300 mb-2">
          No URLs yet
        </h3>
        <p className="text-dark-500">
          Create your first shortened URL using the form above.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Short URL</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, index) => {
              const isExpired = url.expiryDate && new Date(url.expiryDate) < new Date();
              const shortUrl = `${BASE_URL}/${url.shortCode}`;

              return (
                <motion.tr
                  key={url._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Original URL */}
                  <td className="max-w-xs">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark-300 hover:text-primary-400 transition-colors truncate block"
                      title={url.originalUrl}
                    >
                      {url.originalUrl.length > 50
                        ? url.originalUrl.substring(0, 50) + '...'
                        : url.originalUrl}
                    </a>
                  </td>

                  {/* Short URL */}
                  <td>
                    <div className="flex items-center gap-2">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 font-mono text-sm transition-colors"
                      >
                        /{url.shortCode}
                      </a>
                      <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-dark-500" />
                    </div>
                  </td>

                  {/* Clicks */}
                  <td>
                    <span className="text-white font-semibold">{url.clicks}</span>
                  </td>

                  {/* Created Date */}
                  <td>
                    <span className="text-dark-400 text-xs">
                      {formatRelativeTime(url.createdAt)}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    {isExpired ? (
                      <span className="badge-danger">Expired</span>
                    ) : (
                      <span className="badge-success">Active</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => copyToClipboard(shortUrl)}
                        className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                        title="Copy short URL"
                      >
                        <HiClipboard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewQr(url)}
                        className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                        title="View QR Code"
                      >
                        <HiQrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewAnalytics(url)}
                        className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-colors"
                        title="View Analytics"
                      >
                        <HiChartBar className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(url)}
                        className="p-2 rounded-lg text-dark-400 hover:text-amber-400 hover:bg-dark-700 transition-colors"
                        title="Edit URL"
                      >
                        <HiPencilSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(url._id)}
                        className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-dark-700 transition-colors"
                        title="Delete URL"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden divide-y divide-dark-800">
        {urls.map((url, index) => {
          const isExpired = url.expiryDate && new Date(url.expiryDate) < new Date();
          const shortUrl = `${BASE_URL}/${url.shortCode}`;

          return (
            <motion.div
              key={url._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 space-y-3"
            >
              {/* URL Info */}
              <div>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 font-mono text-sm font-semibold"
                >
                  /{url.shortCode}
                </a>
                <p className="text-dark-400 text-xs truncate mt-1">{url.originalUrl}</p>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-xs">
                <span className="text-white font-semibold">{url.clicks} clicks</span>
                <span className="text-dark-500">{formatRelativeTime(url.createdAt)}</span>
                {isExpired ? (
                  <span className="badge-danger">Expired</span>
                ) : (
                  <span className="badge-success">Active</span>
                )}
              </div>

              {/* Actions Row */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <HiClipboard className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewQr(url)}
                  className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  <HiQrCode className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewAnalytics(url)}
                  className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-colors"
                >
                  <HiChartBar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(url)}
                  className="p-2 rounded-lg text-dark-400 hover:text-amber-400 hover:bg-dark-700 transition-colors"
                >
                  <HiPencilSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(url._id)}
                  className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-dark-700 transition-colors"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default UrlTable;
