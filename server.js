const config = require("./config/config");
const logger = require("./config/logger");


let server;
(async () => {
  // Await RabbitMQ connection first
  // if (config.messageQueuing.status) await connectRabbitmq();

  // Now require models after RabbitMQ is ready
  const models = require("./models");
  const app = require("./app");

  // Authenticate and start the server
  models.sequelize.authenticate().then(async () => {
    logger.info("Connected to MySql");
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  });
})();

const closeDatabaseConnection = async () => {
  try {
    await models.sequelize.close();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error("Error closing database connection:", error);
  }
};

const exitHandler = async () => {
  if (server) {
    server.close(async () => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
  if (global.rabbitChannel) await global.rabbitChannel.close();
  if (global.rabbitConnection) await global.rabbitConnection.close();
  await closeDatabaseConnection();
};

const unexpectedErrorHandler = async (error) => {
  logger.error(error);
  await exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received");
  if (server) {
    await exitHandler();
  }
});
