'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class laundry_order_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  laundry_order_item.init({
    laundryOrderId: {
      type: Sequelize.INTEGER,
      references: {
        model: "laundry_orders",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
    unitPrice: {
      type: Sequelize.DOUBLE(11,2)
    },
    unitsPurchased: {
      type: Sequelize.INTEGER
    },
    subTotal: {
      type: Sequelize.DOUBLE(11,2)
    },
  }, {
    sequelize,
    modelName: 'laundry_order_item',
  });
  return laundry_order_item;
};