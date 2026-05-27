/**
 * ShortUrl Model
 * --------------
 * Stores shortened URL entries created by users.
 * Each URL has a unique shortCode, optional custom alias,
 * click counter, optional expiry date, and a generated QR code.
 */

const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Fast lookup for user's URLs
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true, // Fast lookup for redirects
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values while enforcing uniqueness for non-null
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    qrCode: {
      type: String, // Base64 data URI for the QR code image
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
