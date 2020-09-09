"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn("laundry_orders", "pickUpDate", {
        type: Sequelize.DATE,
        defaultValue:false
      }),
      await queryInterface.addColumn("laundry_orders", "pickUpTime", {
        type: Sequelize.STRING,
        defaultValue:false
      }),
      await queryInterface.addColumn("laundry_orders", "deliveryTime", {
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn("laundry_orders", "addressline1", {
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn("laundry_orders", "addressline2", {
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn("laundry_orders", "city", {
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn("laundry_orders", "specialLandmarks", {
        type: Sequelize.STRING,
      })
    ])
  
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
