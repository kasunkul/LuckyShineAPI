'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class item_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      item_category.hasMany(models.laundry_item,{
        foreignKey:'itemCategoryId'
      })
    }
  };
  item_category.init({
    itemName: {
      type: Sequelize.STRING
    },
    activeImage: {
      type: Sequelize.STRING,
    },
    inactiveImage: {
      type: Sequelize.STRING,
    }
  }, {
    sequelize,
    modelName: 'item_category',
  });
  return item_category;
};