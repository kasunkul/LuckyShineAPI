'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('laundry_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      orderValue: {
        type: Sequelize.DOUBLE(11,2)
      },
      tax: {
        type: Sequelize.DOUBLE(11,2)
      },
      totalOrderAmount: {
        type: Sequelize.DOUBLE(11,2)
      },
      totalItems: {
        type: Sequelize.INTEGER
      },
      orderType: {
        type: Sequelize.STRING
      },
      status:{
        type:Sequelize.ENUM('Pending','InQueue', 'Completed')
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
    await queryInterface.dropTable('laundry_orders');
  }
};