/**
 * Copy to Clipboard Utility
 * -------------------------
 * Copies text to the clipboard and shows a toast notification.
 * Falls back to the deprecated execCommand API for older browsers.
 */

import toast from 'react-hot-toast';

const copyToClipboard = async (text, label = 'Link') => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for non-HTTPS or older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    toast.success(`${label} copied to clipboard!`);
    return true;
  } catch (error) {
    toast.error('Failed to copy to clipboard');
    return false;
  }
};

export default copyToClipboard;
