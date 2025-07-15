const logger = require('../config/logger');
const { sequelize } = require('../models');

/**
 * A helper to catch asynchronous errors and optionally manage a transaction.
 *
 * @param {Function} fn - The async route handler (expects req, res, next).
 * @param {Object} [options] - Optional settings.
 * @param {boolean} [options.useTransaction=true] - If true, the handler is run in a new transaction.
 * @param {boolean} [options.skipModifiedBy=false] - If true, skip injecting modified_by into req.body.
 * @param {Function|null} [options.getTransaction=null] - Optional accessor to retrieve an existing transaction from req.
 * @returns {Function} A function wrapping the original handler.
 */
const catchAsync = (fn, options = {}) => {
  const {
    useTransaction = true,
    skipModifiedBy = false,
    getTransaction = null,
  } = options;

  return async (req, res, next) => {
    
    if (!useTransaction) {
      console.log("test");
      return Promise.resolve(fn(req, res, next)).catch(next);
    }
    console.log("test555");
    const transaction = await sequelize.transaction();
    req.transaction = transaction;
    try {
      if (!skipModifiedBy && req.identity && req.body) {
        req.body.modified_by = req.identity.identity_id;
      }

      await fn(req, res, next);
      await transaction.commit();
    } catch (error) {
      // Roll back the appropriate transaction
      if (getTransaction) {
        const existingTx = getTransaction(req);
        if (existingTx && typeof existingTx.rollback === 'function') {
          try {
            await existingTx.rollback();
            logger.info('Existing transaction rolled back due to error.');
          } catch (rbErr) {
            logger.error('Rollback failed:', rbErr);
          }
        }
      } else {
        await transaction.rollback();
      }
      next(error);
    }
  };
};

module.exports = catchAsync;
