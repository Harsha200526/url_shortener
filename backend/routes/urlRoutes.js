/**
 * URL Routes
 * ----------
 * POST   /api/urls       - Create a new short URL
 * GET    /api/urls       - List all URLs for the logged-in user
 * GET    /api/urls/:id   - Get a single URL by ID
 * PUT    /api/urls/:id   - Update a URL's destination
 * DELETE /api/urls/:id   - Delete a URL and its analytics
 * POST   /api/urls/bulk  - Bulk create URLs from CSV upload
 *
 * All routes are protected (require JWT authentication).
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
  bulkCreate,
} = require('../controllers/urlController');
const protect = require('../middleware/auth');

// Configure multer for CSV file upload (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

// All URL routes require authentication
router.use(protect);

router.route('/').post(createUrl).get(getUrls);
router.post('/bulk', upload.single('file'), bulkCreate);
router.route('/:id').get(getUrl).put(updateUrl).delete(deleteUrl);

module.exports = router;
