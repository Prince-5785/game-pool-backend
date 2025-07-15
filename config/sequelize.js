const config = require("./config");
const logger = require("./logger");
 
module.exports = {
  [config.env]: {
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
  },
};
 