"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.DATEONLY,
      },
      socialSecurityNumber: {
        type: Sequelize.STRING,
      },
      fiscalCode: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      contactNumber: {
        type: Sequelize.STRING,
      },
      street1: {
        type: Sequelize.STRING,
      },
      street2: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      stateRegion: {
        type: Sequelize.STRING,
      },
      postalCode: {
        type: Sequelize.STRING,
      },
      profileImage: {
        type: Sequelize.TEXT,
      },
      resetToken: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM("user", "admin", "merchant", "customer"),
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      password: {
        type: Sequelize.STRING,
      },
      lastSignIn: {
        type: Sequelize.DATE,
      },
      lastSignOff: {
        type: Sequelize.DATE,
      },
      occupation: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("users");
  },
};
