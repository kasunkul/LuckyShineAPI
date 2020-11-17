"use strict";
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable("money_values", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            treasure_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            amt: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable("money_values");
    },
};