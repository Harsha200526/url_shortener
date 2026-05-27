/**
 * Redirect Controller
 * -------------------
 * Handles the core redirection logic: when a user visits a short URL,
 * this controller finds the original URL, records analytics data,
 * increments the click counter, and performs a 302 redirect.
 */

const ShortUrl = require('../models/ShortUrl');
const Analytics = require('../models/Analytics');
const UAParser = require('ua-parser-js');

/**
 * @desc    Redirect short URL to original URL & track analytics
 * @route   GET /:shortCode
 * @access  Public
 */
const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Find the URL by short code
    const url = await ShortUrl.findOne({ shortCode });

    if (!url) {
      res.status(404);
      throw new Error('Short URL not found');
    }

    // Check if the URL has expired
    if (url.expiryDate && new Date() > url.expiryDate) {
      res.status(410); // 410 Gone
      throw new Error('This short URL has expired');
    }

    // Check if URL is active
    if (!url.isActive) {
      res.status(410);
      throw new Error('This short URL is no longer active');
    }

    // --- Parse User-Agent for analytics ---
    const parser = new UAParser(req.headers['user-agent']);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    // Determine device type
    let deviceType = 'desktop';
    if (deviceInfo.type === 'mobile') deviceType = 'mobile';
    else if (deviceInfo.type === 'tablet') deviceType = 'tablet';
    else if (deviceInfo.type) deviceType = deviceInfo.type;

    // --- Record analytics (fire-and-forget for faster redirect) ---
    Analytics.create({
      urlId: url._id,
      browser: browserInfo.name || 'Unknown',
      os: osInfo.name || 'Unknown',
      device: deviceType,
      referrer: req.headers.referer || req.headers.referrer || 'Direct',
      ip: req.ip || req.connection.remoteAddress || '',
    }).catch((err) => {
      // Log but don't block the redirect
      console.error('Analytics tracking error:', err.message);
    });

    // --- Increment click counter (fire-and-forget) ---
    ShortUrl.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } }).catch(
      (err) => {
        console.error('Click increment error:', err.message);
      }
    );

    // --- Redirect to original URL ---
    res.redirect(302, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = { redirectUrl };
