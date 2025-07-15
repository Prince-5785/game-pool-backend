const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const config = require("./config");

// Custom transform: If the logged info is an Error, replace its message with the stack trace.
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    // Return a new object with the error stack
    return { ...info, message: info.stack };
  }
  return info;
});

// Combined format: adds timestamp, error formatting, splat support, and conditionally colorizes logs.
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  enumerateErrorFormat(),
  winston.format.splat(), // Enables string interpolation (e.g., logger.info('Hello %s', name))
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
);

// Define arrays for transports, exceptionHandlers, and rejectionHandlers.
let transports = [];
let exceptionHandlers = [];
let rejectionHandlers = [];

// Use file-based logging (with daily rotation) if enabled in the config; otherwise, log only to stdout.
if (config.logger.fileTransport) {
  // Both stdout and file logging.
  transports.push(
    new winston.transports.Console({
      stderrLevels: ["error"],
      format:
        (config.env === "development" || config.env === "local")
          ? winston.format.combine(winston.format.colorize(), customFormat)
          : customFormat,
    }),
    new DailyRotateFile({
      filename: "../logs/api/apilog-%DATE%.log",
      datePattern: "yyyy-MM-DD",
      zippedArchive: false,
      maxSize: config.logger.maxSize,
      maxFiles: config.logger.maxFiles,
      level: config.logger.level,
    })
  );

  // Exception Handlers: Log both to stdout and files.
  exceptionHandlers.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new DailyRotateFile({
      filename: "../logs/api/unhandledExceptions-%DATE%.log",
      datePattern: "yyyy-MM-DD",
      zippedArchive: false,
      maxSize: config.logger.maxSize,
      maxFiles: config.logger.maxFiles,
      level: "error",
    })
  );

  // Rejection Handlers: Log both to stdout and files.
  rejectionHandlers.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new DailyRotateFile({
      filename: "../logs/api/unhandledRejections-%DATE%.log",
      datePattern: "yyyy-MM-DD",
      zippedArchive: false,
      maxSize: config.logger.maxSize,
      maxFiles: config.logger.maxFiles,
      level: "error",
    })
  );
} else {
  // Log only to stdout.
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat),
    })
  );

  exceptionHandlers.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );

  rejectionHandlers.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

const logger = winston.createLogger({
  level: config.logger.level,
  format: customFormat,
  transports,
  exceptionHandlers,
  rejectionHandlers,
});

module.exports = logger;
