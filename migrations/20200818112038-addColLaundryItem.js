"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("laundry_order_items", "itemId", {
      type: Sequelize.INTEGER,
      references:{
        model:'laundry_items',
        key:'id'
      },
      onDelete:'cascade',
      onUpdate:'cascade'

    });
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
