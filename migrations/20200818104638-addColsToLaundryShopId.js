"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("laundry_orders", "shopId", {
      type: Sequelize.INTEGER,
      references:{
        model:'shops',
        key:'id'
      },
      onUpdate:'cascade',
      onDelete:'cascade'

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
