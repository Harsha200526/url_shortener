/**
 * URL Shortener Backend — Server Entry Point
 * ===========================================
 * This is the main server file that:
 * 1. Loads environment variables
 * 2. Connects to MongoDB
 * 3. Configures Express middleware (CORS, JSON parsing)
 * 4. Mounts API routes
 * 5. Registers the redirect handler (must come after API routes)
 * 6. Applies the global error handler
 * 7. Starts the HTTP server
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// --- Load environment variables ---
dotenv.config();

// --- Connect to MongoDB ---
connectDB();

// --- Initialize Express ---
const app = express();

// --- Core Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/urls', require('./routes/urlRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// --- Health Check Endpoint ---
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'URL Shortener API is running',
    timestamp: new Date().toISOString(),
  });
});

// --- Redirect Handler ---
// This must come AFTER all /api routes to avoid conflicts.
// Any request to /:shortCode will attempt a redirect.
const { redirectUrl } = require('./controllers/redirectController');
app.get('/:shortCode', redirectUrl);

// --- Global Error Handler (must be last middleware) ---
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔗 Redirects: http://localhost:${PORT}/:shortCode`);
});
