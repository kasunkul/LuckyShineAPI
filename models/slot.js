'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class slot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  slot.init({
    uniqueId: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
  }, {
    sequelize,
    modelName: 'slot',
  });
  return slot;
};