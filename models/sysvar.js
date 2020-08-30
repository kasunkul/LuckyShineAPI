'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class sysVar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  sysVar.init({
    label: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    value: {
      type: Sequelize.STRING
    },
  }, {
    sequelize,
    modelName: 'sysVar',
  });
  return sysVar;
};