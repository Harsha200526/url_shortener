/**
 * Analytics Routes
 * ----------------
 * GET /api/analytics/public/:shortCode - Public stats for a URL (no auth)
 * GET /api/analytics/:urlId            - Full analytics for a URL (auth required)
 */

const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getPublicStats,
} = require('../controllers/analyticsController');
const protect = require('../middleware/auth');

// Public stats route (must be defined before the :urlId param route)
router.get('/public/:shortCode', getPublicStats);

// Protected analytics route
router.get('/:urlId', protect, getAnalytics);

module.exports = router;
