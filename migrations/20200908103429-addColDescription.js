"use strict";

module.exports = {
  up:  (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("item_categories", "description", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("laundry_items", "description", {
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
  },
};
