/**
 * JWT Token Generator
 * -------------------
 * Creates a signed JSON Web Token containing the user's ID.
 * Token expiry is configured via the JWT_EXPIRE environment variable.
 *
 * @param {string} userId - The MongoDB ObjectId of the user
 * @returns {string} Signed JWT token
 */

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
