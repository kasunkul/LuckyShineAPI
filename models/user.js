"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
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
        type: Sequelize.ENUM("pending", "active", "inactive", "archived"),
        defaultValue: "pending",
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
      passwordResetToken: {
        type: Sequelize.STRING,

        // allowNull:false
      },
      isAppUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      fullName: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
      address: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${this.street1} ${this.street2} ${this.city} ${this.stateRegion} ${this.postalCode}`;
        },
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
