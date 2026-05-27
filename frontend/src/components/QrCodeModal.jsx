/**
 * QR Code Modal Component
 * -----------------------
 * Displays a QR code in a modal overlay with download functionality.
 *
 * Props:
 *   url: The ShortUrl object (must have .qrCode and .shortCode)
 *   onClose: Called when the modal is closed
 */

import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiArrowDownTray } from 'react-icons/hi2';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const QrCodeModal = ({ url, onClose }) => {
  if (!url) return null;

  const shortUrl = `${BASE_URL}/${url.shortCode}`;

  /**
   * Download QR code as a PNG file.
   * Creates a temporary anchor element to trigger the download.
   */
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `qr-${url.shortCode}.png`;
    link.href = url.qrCode;
    link.click();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="glass-card p-8 max-w-sm w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2">QR Code</h3>
          <p className="text-sm text-dark-400 mb-6 font-mono">/{url.shortCode}</p>

          {/* QR Code Image */}
          <div className="bg-white rounded-2xl p-6 inline-block mb-6">
            <img
              src={url.qrCode}
              alt={`QR Code for ${shortUrl}`}
              className="w-48 h-48"
            />
          </div>

          {/* Short URL Display */}
          <p className="text-sm text-dark-300 mb-6 break-all">{shortUrl}</p>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <HiArrowDownTray className="w-5 h-5" />
            Download QR Code
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QrCodeModal;
