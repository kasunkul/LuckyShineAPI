'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class treasure extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            treasure.hasMany(models.money_value, {
                foreignKey: 'treasure_id'
            })
        }
    };
    treasure.init({
        latitude: {
            type: Sequelize.STRING
        },
        activeImage: {
            type: Sequelize.DOUBLE,
        },
        longtitude: {
            type: Sequelize.DOUBLE,
        },
        name: {
            type: Sequelize.STRING,
        }
    }, {
        sequelize,
        modelName: 'treasure',
    });
    return treasure;
};