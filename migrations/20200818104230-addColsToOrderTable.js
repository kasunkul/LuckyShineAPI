"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("laundry_orders", "pickUpDate", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("laundry_orders", "pickUpTime", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("laundry_orders", "deliveryTime", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("laundry_orders", "addressline1", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("laundry_orders", "addressline2", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("laundry_orders", "city", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("laundry_orders", "specialLandmarks", {
        type: Sequelize.STRING,
      }),
    ]);
    // return Promise.resolve()
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
