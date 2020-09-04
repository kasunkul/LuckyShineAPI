'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("laundry_order_items", "needIron", {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      }),
      queryInterface.addColumn("laundry_items", "isHangable", {
        type: Sequelize.BOOLEAN,
        defaultValue:false
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
  }
};
