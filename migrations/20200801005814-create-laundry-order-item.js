'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('laundry_order_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      laundryOrderId: {
        type: Sequelize.INTEGER,
        references: {
          model: "laundry_orders",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      unitPrice: {
        type: Sequelize.DOUBLE(11,2)
      },
      unitsPurchased: {
        type: Sequelize.INTEGER
      },
      subTotal: {
        type: Sequelize.DOUBLE(11,2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('laundry_order_items');
  }
};