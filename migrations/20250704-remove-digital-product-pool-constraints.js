"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "digital_product_pool",
      "digital_product_pool_ibfk_2"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("digital_product_pool", {
      fields: ["pool_id"],
      type: "foreign key",
      name: "digital_product_pool_ibfk_2",
      references: {
        table: "pool_views",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
};
