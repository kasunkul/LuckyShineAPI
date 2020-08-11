"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("laundry_orders", "driverId", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
      queryInterface.addColumn("laundry_orders", "assignDate", {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("laundry_orders", "startLocation", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("laundry_orders", "notes", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("users", "isAppUser", {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }),
      queryInterface.changeColumn("users", "role", { type: Sequelize.STRING }),
      queryInterface.changeColumn("laundry_orders", "status", {
        type: Sequelize.STRING,
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
