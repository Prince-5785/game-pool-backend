const logger = require("./logger.js");

async function connectRabbitmq() {
  try {
    // Dynamically import amqplib as it's an ES module
    const config = require("./config.js"); // assuming config is CommonJS
    const amqp = await import("amqplib");
    const connection = await amqp.default.connect(config.messageQueuing.rabitmq_url);
    const channel = await connection.createChannel();
    const { Engine } = require("json-rules-engine");
    global.rulesEngine = new Engine();
    global.rabbitChannel = channel; // make it globally available
    global.rabbitConnection = connection; // make it globally available
    logger.info("Connected to RabbitMQ");
  } catch (error) {
    logger.error("Error connecting to RabbitMQ:", error);
    process.exit(1); // exit if we can't connect (or handle as needed)
  }
}

module.exports = connectRabbitmq;
