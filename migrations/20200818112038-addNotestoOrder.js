"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("laundry_order_items", "notes", {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
   
  },
};
