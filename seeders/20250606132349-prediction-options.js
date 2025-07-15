"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const values = ["L", "V", "E", "LE", "LV", "LVE"];

    const Predictions = values.map((value) => ({
      value,
    }));

    await queryInterface.bulkInsert("prediction", Predictions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("prediction", null, {});
  },
};
