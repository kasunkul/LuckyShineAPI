'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class money_value extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            money_value.belongsTo(models.treasure, {
                foreignKey: 'treasure_id',
            });
        }
    }
    money_value.init({
        treasure_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'item_categories',
                key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
        amt: {
            type: Sequelize.INTEGER,
        },
    }, {
        sequelize,
        modelName: 'money_value',
    });
    return money_value;
};