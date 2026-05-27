/**
 * Analytics Model
 * ---------------
 * Stores individual click/visit events for each shortened URL.
 * Captures timestamp, browser, OS, device type, referrer, and IP.
 * Used to power the analytics dashboard with click trends and device breakdowns.
 */

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShortUrl',
    required: true,
    index: true, // Fast aggregation queries per URL
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  os: {
    type: String,
    default: 'Unknown',
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown',
  },
  referrer: {
    type: String,
    default: 'Direct',
  },
  ip: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
