"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn("laundry_orders", "orderPayed", {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      }),
      await queryInterface.addColumn("laundry_orders", "toPrint", {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      }),
      await queryInterface.addColumn("laundry_orders", "deliveryDate", {
        type: Sequelize.DATE,
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
