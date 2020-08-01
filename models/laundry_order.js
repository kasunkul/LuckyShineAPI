'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class laundry_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  laundry_order.init({
    customerId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    },
    orderValue: {
      type: Sequelize.DOUBLE(11,2)
    },
    tax: {
      type: Sequelize.DOUBLE(11,2)
    },
    totalOrderAmount: {
      type: Sequelize.DOUBLE(11,2)
    },
    totalItems: {
      type: Sequelize.INTEGER
    },
    orderType: {
      type: Sequelize.STRING
    },
    status:{
      type:Sequelize.ENUM('Pending','InQueue', 'Completed')
    },
  }, {
    sequelize,
    modelName: 'laundry_order',
  });
  return laundry_order;
};