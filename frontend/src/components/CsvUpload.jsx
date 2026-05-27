/**
 * CSV Upload Component
 * --------------------
 * Allows users to upload a CSV file for bulk URL shortening.
 * CSV format: Each row has URL in column 1, optional alias in column 2.
 *
 * Props:
 *   onUpload(file): Called with the selected File object
 *   loading: Whether the upload is in progress
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiArrowUpTray, HiDocumentText, HiXMark } from 'react-icons/hi2';

const CsvUpload = ({ onUpload, loading = false }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type === 'text/csv' || dropped.name.endsWith('.csv'))) {
      setFile(dropped);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <HiArrowUpTray className="w-5 h-5 text-primary-400" />
        Bulk Upload (CSV)
      </h2>
      <p className="text-sm text-dark-400 mb-4">
        Upload a CSV file with URLs. Format: <code className="text-primary-400">url,alias(optional)</code>
      </p>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-dark-600 hover:border-dark-500 hover:bg-dark-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <HiDocumentText className="w-8 h-8 text-primary-400" />
            <div className="text-left">
              <p className="text-sm text-white font-medium">{file.name}</p>
              <p className="text-xs text-dark-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="p-1 rounded-lg text-dark-400 hover:text-red-400 hover:bg-dark-700 transition-colors"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <HiArrowUpTray className="w-10 h-10 text-dark-500 mx-auto mb-3" />
            <p className="text-sm text-dark-400">
              Drag & drop a CSV file, or <span className="text-primary-400">browse</span>
            </p>
          </>
        )}
      </div>

      {/* Upload Button */}
      {file && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiArrowUpTray className="w-5 h-5" />
          )}
          {loading ? 'Uploading...' : 'Upload & Shorten'}
        </motion.button>
      )}
    </motion.div>
  );
};

export default CsvUpload;
