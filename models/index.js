const fs = require("fs");
const path = require("path");
const { titleCase } = require("../utils/helper");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const models = {};
const modelsDirectory = __dirname;

// Load all the models
fs.readdirSync(modelsDirectory)
  .filter((file) => file.endsWith(".model.js"))
  .forEach((file) => {
    const modelName = titleCase(path.basename(file, ".model.js"));
    const modelFactory = require(path.join(modelsDirectory, file));
    models[modelName] = modelFactory(sequelize, DataTypes);
  });

// load all of our view‐definitions
const viewsDir = path.resolve(__dirname, "../views");
fs.readdirSync(viewsDir)
  .filter((f) => f.endsWith(".view.js"))
  .forEach((file) => {
    const viewName = titleCase(path.basename(file, ".view.js")) + "View";
    const viewFactory = require(path.join(viewsDir, file));
    models[viewName] = viewFactory(sequelize, DataTypes);
  });

// Now that all models are defined, set up associations
Object.values(models).forEach((mdl) => {
  if (typeof mdl.associate === "function") {
    mdl.associate(models);
  }
});

// console.log("Models loaded:", Object.keys(models));

// Expose sequelize and the Sequelize constructor too
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;