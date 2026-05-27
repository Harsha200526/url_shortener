/**
 * URL Form Component
 * ------------------
 * Form for creating and editing shortened URLs.
 * Supports optional custom alias and expiry date.
 *
 * Props:
 *   onSubmit(formData): Called when the form is submitted
 *   loading: Whether the form is currently submitting
 *   editMode: If true, shows "Update" instead of "Shorten"
 *   initialData: Pre-filled data for edit mode
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiLink, HiSparkles, HiCalendarDays } from 'react-icons/hi2';

const UrlForm = ({ onSubmit, loading = false, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expiryDate: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        originalUrl: initialData.originalUrl || '',
        customAlias: initialData.customAlias || '',
        expiryDate: initialData.expiryDate
          ? new Date(initialData.expiryDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    // Reset form after successful create (not edit)
    if (!editMode) {
      setFormData({ originalUrl: '', customAlias: '', expiryDate: '' });
      setShowAdvanced(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <HiLink className="w-5 h-5 text-primary-400" />
        {editMode ? 'Edit URL' : 'Shorten a URL'}
      </h2>

      {/* Original URL Input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            type="url"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleChange}
            placeholder="https://example.com/your-very-long-url"
            className="input-field"
            required
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading || !formData.originalUrl}
          className="btn-primary whitespace-nowrap flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiSparkles className="w-5 h-5" />
          )}
          {editMode ? 'Update' : 'Shorten'}
        </motion.button>
      </div>

      {/* Advanced Options Toggle */}
      {!editMode && (
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors mb-4"
        >
          {showAdvanced ? '− Hide' : '+ Show'} advanced options
        </button>
      )}

      {/* Advanced Options */}
      {(showAdvanced || editMode) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* Custom Alias */}
          {!editMode && (
            <div>
              <label className="block text-sm text-dark-400 mb-1.5">
                <HiSparkles className="w-3.5 h-3.5 inline mr-1" />
                Custom Alias (optional)
              </label>
              <input
                type="text"
                name="customAlias"
                value={formData.customAlias}
                onChange={handleChange}
                placeholder="my-custom-link"
                className="input-field"
                pattern="^[a-zA-Z0-9_-]{3,30}$"
                title="3-30 characters: letters, numbers, hyphens, underscores"
              />
            </div>
          )}

          {/* Expiry Date */}
          <div>
            <label className="block text-sm text-dark-400 mb-1.5">
              <HiCalendarDays className="w-3.5 h-3.5 inline mr-1" />
              Expiry Date (optional)
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>
        </motion.div>
      )}
    </motion.form>
  );
};

export default UrlForm;
