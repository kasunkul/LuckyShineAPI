"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class laundry_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      laundry_item.belongsTo(models.item_category, {
        foreignKey: "itemCategoryId",
      });
    }
  }
  laundry_item.init(
    {
      itemName: {
        type: Sequelize.STRING,
      },
      itemCode: {
        type: Sequelize.STRING,
      },
      itemCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "item_categories",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      noOfUnits: {
        type: Sequelize.INTEGER,
      },
      unitPrice: {
        type: Sequelize.DOUBLE(11, 2),
      },
      lastUsedDate: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      image: {
        type: Sequelize.STRING,
      },
      isHangable: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      }
     
    },
    {
      sequelize,
      modelName: "laundry_item",
    }
  );
  return laundry_item;
};
