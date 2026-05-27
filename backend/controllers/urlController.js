/**
 * URL Controller
 * --------------
 * Handles CRUD operations for shortened URLs.
 * Features: create (with optional alias), list, get, update, delete, and bulk CSV upload.
 * Each operation is scoped to the authenticated user (ownership enforcement).
 */

const ShortUrl = require('../models/ShortUrl');
const Analytics = require('../models/Analytics');
const { nanoid } = require('nanoid');
const validator = require('validator');
const QRCode = require('qrcode');
const { parse } = require('csv-parse/sync');

/**
 * @desc    Create a new short URL
 * @route   POST /api/urls
 * @access  Private
 */
const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiryDate } = req.body;

    // --- Validate URL ---
    if (!originalUrl) {
      res.status(400);
      throw new Error('Please provide a URL to shorten');
    }

    if (!validator.isURL(originalUrl, { require_protocol: true })) {
      res.status(400);
      throw new Error(
        'Please provide a valid URL (must include http:// or https://)'
      );
    }

    // --- Generate or validate short code ---
    let shortCode;

    if (customAlias) {
      // Validate custom alias format (alphanumeric, hyphens, underscores, 3-30 chars)
      if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)) {
        res.status(400);
        throw new Error(
          'Custom alias must be 3-30 characters and contain only letters, numbers, hyphens, or underscores'
        );
      }

      // Check if alias is already taken
      const existing = await ShortUrl.findOne({
        $or: [{ shortCode: customAlias }, { customAlias }],
      });
      if (existing) {
        res.status(400);
        throw new Error('This custom alias is already taken');
      }

      shortCode = customAlias;
    } else {
      // Generate a unique 8-character nanoid
      shortCode = nanoid(8);

      // Extremely unlikely collision check
      while (await ShortUrl.findOne({ shortCode })) {
        shortCode = nanoid(8);
      }
    }

    // --- Validate expiry date ---
    let parsedExpiry = null;
    if (expiryDate) {
      parsedExpiry = new Date(expiryDate);
      if (isNaN(parsedExpiry.getTime()) || parsedExpiry <= new Date()) {
        res.status(400);
        throw new Error('Expiry date must be a valid future date');
      }
    }

    // --- Generate QR code ---
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCode = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#1e1b4b', light: '#ffffff' },
    });

    // --- Create the short URL record ---
    const url = await ShortUrl.create({
      userId: req.user._id,
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      expiryDate: parsedExpiry,
      qrCode,
    });

    res.status(201).json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all URLs for the logged-in user
 * @route   GET /api/urls
 * @access  Private
 */
const getUrls = async (req, res, next) => {
  try {
    const urls = await ShortUrl.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single URL by ID
 * @route   GET /api/urls/:id
 * @access  Private
 */
const getUrl = async (req, res, next) => {
  try {
    const url = await ShortUrl.findById(req.params.id);

    if (!url) {
      res.status(404);
      throw new Error('URL not found');
    }

    // Ownership check — users can only view their own URLs
    if (url.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this URL');
    }

    res.json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a URL's destination
 * @route   PUT /api/urls/:id
 * @access  Private
 */
const updateUrl = async (req, res, next) => {
  try {
    const { originalUrl, expiryDate } = req.body;

    const url = await ShortUrl.findById(req.params.id);

    if (!url) {
      res.status(404);
      throw new Error('URL not found');
    }

    // Ownership check
    if (url.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this URL');
    }

    // Validate new URL if provided
    if (originalUrl) {
      if (!validator.isURL(originalUrl, { require_protocol: true })) {
        res.status(400);
        throw new Error('Please provide a valid URL');
      }
      url.originalUrl = originalUrl;
    }

    // Update expiry date if provided
    if (expiryDate !== undefined) {
      if (expiryDate === null) {
        url.expiryDate = null; // Remove expiry
      } else {
        const parsedExpiry = new Date(expiryDate);
        if (isNaN(parsedExpiry.getTime()) || parsedExpiry <= new Date()) {
          res.status(400);
          throw new Error('Expiry date must be a valid future date');
        }
        url.expiryDate = parsedExpiry;
      }
    }

    const updatedUrl = await url.save();

    res.json({
      success: true,
      data: updatedUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a URL and all its analytics data
 * @route   DELETE /api/urls/:id
 * @access  Private
 */
const deleteUrl = async (req, res, next) => {
  try {
    const url = await ShortUrl.findById(req.params.id);

    if (!url) {
      res.status(404);
      throw new Error('URL not found');
    }

    // Ownership check
    if (url.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this URL');
    }

    // Delete associated analytics data first
    await Analytics.deleteMany({ urlId: url._id });

    // Delete the URL
    await url.deleteOne();

    res.json({
      success: true,
      message: 'URL and associated analytics deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk create URLs from CSV upload
 * @route   POST /api/urls/bulk
 * @access  Private
 *
 * CSV format: Each row should have a URL in the first column.
 * Optional second column for custom alias.
 */
const bulkCreate = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a CSV file');
    }

    // Parse CSV content
    const csvContent = req.file.buffer.toString('utf-8');
    const records = parse(csvContent, {
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      res.status(400);
      throw new Error('CSV file is empty');
    }

    if (records.length > 100) {
      res.status(400);
      throw new Error('Maximum 100 URLs per CSV upload');
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const originalUrl = row[0];
      const customAlias = row[1] || null;

      try {
        // Validate URL
        if (!validator.isURL(originalUrl, { require_protocol: true })) {
          errors.push({ row: i + 1, url: originalUrl, error: 'Invalid URL' });
          continue;
        }

        // Generate short code
        const shortCode = customAlias || nanoid(8);

        // Generate QR code
        const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
        const qrCode = await QRCode.toDataURL(shortUrl, {
          width: 300,
          margin: 2,
        });

        const url = await ShortUrl.create({
          userId: req.user._id,
          originalUrl,
          shortCode,
          customAlias: customAlias || undefined,
          qrCode,
        });

        results.push(url);
      } catch (err) {
        errors.push({
          row: i + 1,
          url: originalUrl,
          error: err.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        created: results.length,
        failed: errors.length,
        urls: results,
        errors,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUrl, getUrls, getUrl, updateUrl, deleteUrl, bulkCreate };
