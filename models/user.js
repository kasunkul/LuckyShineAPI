"use strict";
const bcrypt = require("bcrypt");
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
    user.init({
        name: {
            type: Sequelize.STRING,
        },
        age: {
            type: Sequelize.INTEGER,
        },
        password: {
            type: Sequelize.DATEONLY,
        },
        email: {
            type: Sequelize.STRING,
        },
    }, {
        sequelize: sequelize,
        modelName: "user",
    });

    user.addHook('beforeCreate', (user, options) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
    });

    return user;
};