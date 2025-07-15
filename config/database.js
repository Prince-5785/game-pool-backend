const { Sequelize } = require("sequelize");
const config = require("./config");
const logger = require("./logger");

const sequelize = new Sequelize({
  dialect: config.database.dialect,
  replication: {
    write: {
      host: config.database.write.host,
      username: config.database.write.username,
      password: config.database.write.password,
      database: config.database.write.database,
    },
    read: [
      {
        host: config.database.read.host,
        username: config.database.read.username,
        password: config.database.read.password,
        database: config.database.read.database,
      },
    ],
  },
  logging: config.database.logging ? (msg) => logger.info(msg) : false,
  pool: {
    max: 100, // Maximum number of connections in pool
    min: 0, // Minimum number of connections in pool
    // acquire: 60000,  // Increase timeout to 60 seconds
    // idle: 10000      // Maximum time a connection can be idle before being released
  },
});

module.exports = sequelize;
