"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("laundry_items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      itemName: {
        type: Sequelize.STRING,
      },
      itemCode: {
        type: Sequelize.STRING,
      },
      itemCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "item_categories",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      noOfUnits: {
        type: Sequelize.INTEGER,
      },
      unitPrice: {
        type: Sequelize.DOUBLE(11, 2),
      },
      lastUsedDate: {
        type: Sequelize.DATE,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("laundry_items");
  },
};
