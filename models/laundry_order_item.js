"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class laundry_order_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      laundry_order_item.belongsTo(models.laundry_item, {
        foreignKey: "itemId",
      });
    }
  }
  laundry_order_item.init(
    {
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
        type: Sequelize.DOUBLE(11, 2),
      },
      unitsPurchased: {
        type: Sequelize.INTEGER,
      },
      subTotal: {
        type: Sequelize.DOUBLE(11, 2),
      },
      itemId: {
        type: Sequelize.INTEGER,
        references: {
          model: "laundry_items",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      slotId: {
        type: Sequelize.STRING,
      },
      needIron: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      }, 
      notes: {
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: "laundry_order_item",
    }
  );
  return laundry_order_item;
};
