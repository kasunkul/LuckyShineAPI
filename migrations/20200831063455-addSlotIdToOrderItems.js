'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("laundry_orders", "slotId"),
      queryInterface.addColumn("laundry_order_items", "slotId", {
        type: Sequelize.STRING,
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
