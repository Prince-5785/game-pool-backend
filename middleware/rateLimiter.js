const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10000,  // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});

module.exports = apiLimiter;

