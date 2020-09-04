"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class cart_item extends Model {
   
  }
  cart_item.init(
    {
      itemId: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      unitPrice: {
        type: Sequelize.DOUBLE(11, 2),
      },
      units: {
        type: Sequelize.INTEGER,
      },
      needIron: {
        type: Sequelize.BOOLEAN,
      }
    },
    {
      sequelize,
      modelName: "cart_item",
    }
  );
  return cart_item;
};
