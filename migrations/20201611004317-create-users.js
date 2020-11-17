"use strict";
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable("users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            age: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            password: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            email: {
                allowNull: true,
                type: Sequelize.STRING,
            },
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable("users");
    },
};