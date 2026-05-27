/**
 * Analytics Controller
 * --------------------
 * Provides aggregated analytics data for shortened URLs.
 * Includes click timeline (for charts), browser/device breakdown, and recent visits.
 */

const Analytics = require('../models/Analytics');
const ShortUrl = require('../models/ShortUrl');

/**
 * @desc    Get analytics for a specific URL
 * @route   GET /api/analytics/:urlId
 * @access  Private
 */
const getAnalytics = async (req, res, next) => {
  try {
    const { urlId } = req.params;

    // Find the URL and check ownership
    const url = await ShortUrl.findById(urlId);

    if (!url) {
      res.status(404);
      throw new Error('URL not found');
    }

    if (url.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view analytics for this URL');
    }

    // --- Aggregate: Click Timeline (last 30 days, grouped by date) ---
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clickTimeline = await Analytics.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          clicks: 1,
          _id: 0,
        },
      },
    ]);

    // --- Aggregate: Browser breakdown ---
    const browserStats = await Analytics.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          browser: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // --- Aggregate: Device breakdown ---
    const deviceStats = await Analytics.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: '$device',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          device: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // --- Aggregate: OS breakdown ---
    const osStats = await Analytics.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: '$os',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          os: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // --- Recent visits (last 20) ---
    const recentVisits = await Analytics.find({ urlId: url._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('timestamp browser os device referrer -_id');

    // --- Last visited time ---
    const lastVisit = await Analytics.findOne({ urlId: url._id })
      .sort({ timestamp: -1 })
      .select('timestamp -_id');

    res.json({
      success: true,
      data: {
        url,
        totalClicks: url.clicks,
        lastVisited: lastVisit ? lastVisit.timestamp : null,
        clickTimeline,
        browserStats,
        deviceStats,
        osStats,
        recentVisits,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public stats for a URL (no auth required)
 * @route   GET /api/analytics/public/:shortCode
 * @access  Public
 */
const getPublicStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const url = await ShortUrl.findOne({ shortCode }).select(
      'originalUrl shortCode clicks createdAt'
    );

    if (!url) {
      res.status(404);
      throw new Error('URL not found');
    }

    // Limited analytics for public view (just click timeline)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clickTimeline = await Analytics.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          clicks: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        totalClicks: url.clicks,
        createdAt: url.createdAt,
        clickTimeline,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics, getPublicStats };
