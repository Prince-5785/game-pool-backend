"use strict";

const fs = require("fs");
const path = require("path");
const { DataTypes } = require("sequelize");
const { titleCase } = require("../utils/helper");
const sequelize = require("../config/database");
const logger = require("../config/logger");

// Determine lifecycle and refresh flag
const isRefresh = process.argv.includes("refresh");

// Parse CLI args for --model <ModelName> [<ModelName>...]
const args = process.argv.slice(2);
const modelFlagIndex = args.indexOf("--model");
const modelNames =
  modelFlagIndex > -1
    ? // collect everything after `--model` until the next --something
      args.slice(modelFlagIndex + 1).filter((a) => !a.startsWith("--"))
    : [];

// Prepare containers
const models = {};
const modelsDir = path.resolve(__dirname, "../models");
const viewsDir = path.resolve(__dirname, "../views");

// Load all models
fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith(".model.js"))
  .forEach((file) => {
    const name = titleCase(path.basename(file, ".model.js"));
    const factory = require(path.join(modelsDir, file));
    models[name] = factory(sequelize, DataTypes);
  });

// Load all views
fs.readdirSync(viewsDir)
  .filter((file) => file.endsWith(".view.js"))
  .forEach((file) => {
    const name = titleCase(path.basename(file, ".view.js"));
    const factory = require(path.join(viewsDir, file));
    models[`${name}View`] = factory(sequelize, DataTypes);
  });

// Wire up associations
Object.values(models).forEach((mdl) => {
  if (typeof mdl.associate === "function") {
    mdl.associate(models);
  }
});

// Sync
(async () => {
  try {
    const syncOptions = {};
    const queryInterface = sequelize.getQueryInterface();

    if (isRefresh) {
      syncOptions.force = true;
      logger.info("Running in refresh mode: dropping and recreating tables");
    } else {
      logger.info(
        "Running in normal mode: syncing without only those which are not created already"
      );
    }

    if (modelNames.length) {
      modelNames.forEach((name) => {
        if (!models[name]) {
          logger.error(`No model found for “${name}”`);
          process.exit(1);
        }
      });

      // sync each one in sequence
      for (const name of modelNames) {
        logger.info(`Syncing ${name} only…`);
        // if you want all of them forced, pass force: true
        await models[name].sync(syncOptions);
      }
    } else {
      logger.info("Syncing all models…");
      await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 0;`);
      await sequelize.sync(syncOptions);
      await queryInterface.sequelize.query(`DROP table IF EXISTS pool_views;`);
      await queryInterface.sequelize.query(`DROP table IF EXISTS SequelizeMeta;`);
      await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1;`);

    }

    logger.info("Sync completed successfully");
    process.exit(0);
  } catch (err) {
    logger.error("Sync failed:", err);
    process.exit(1);
  }
})();
