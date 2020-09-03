"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("item_categories", "activeImage", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("item_categories", "inactiveImage", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("laundry_items", "image", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("item_categories", "description", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("item_categories", "maximumQty", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
