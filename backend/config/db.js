/**
 * Database Configuration
 * ----------------------
 * Connects to MongoDB using Mongoose.
 * Reads the connection URI from the MONGO_URI environment variable.
 * Exits the process if the connection fails (fail-fast approach).
 *
 * Note: The `family: 4` option forces IPv4 DNS resolution,
 * which fixes the common "querySrv ETIMEOUT" error on some networks.
 */

// Force nodemon restart with the newly created harsha_db_user credentials
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Force IPv4 DNS resolution — fixes SRV timeout on many networks
      family: 4,
      // Wait up to 30 seconds for server selection
      serverSelectionTimeoutMS: 30000,
      // Wait up to 30 seconds for socket connection
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`   Tip: If you see ETIMEOUT, try:`);
    console.error(`   1. Check your internet connection`);
    console.error(`   2. Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access`);
    console.error(`   3. Try a different network (e.g., mobile hotspot)`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
