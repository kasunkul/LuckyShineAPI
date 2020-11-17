"use strict";
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable("treasures", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            latitude: {
                type: Sequelize.DOUBLE,
            },
            longtitude: {
                type: Sequelize.DOUBLE,
            },
            name: {
                type: Sequelize.STRING,
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable("treasures");
    },
};