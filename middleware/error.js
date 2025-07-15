const {
    ValidationError,
    DatabaseError,
    ConnectionError,
  } = require("sequelize");
  const { status: httpStatus } = require("http-status");
  const config = require("../config/config");
  const logger = require("../config/logger");
  const ApiError = require("../utils/ApiError");
  const { sendError } = require("../utils/ApiResponse");
  
  const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
      let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      let message = httpStatus[statusCode];
  
      if (error instanceof ValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = error.message;
      } else if (error instanceof DatabaseError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = error.message;
      } else if (error instanceof ConnectionError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Database connection error";
      } else if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message || httpStatus[statusCode];
      }
  
      error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
  };
  
  // eslint-disable-next-line no-unused-vars
  const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === "production" && !err.isOperational) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
  
    res.locals.errorMessage = err.message;
    
    let data = [];
    if (config.env === "development" ||config.env === "local" ) {
      logger.error(err);
      data = err.stack;
    }
  
    return sendError(res, message, statusCode, data);
  };
  
  module.exports = {
    errorConverter,
    errorHandler,
  };
  