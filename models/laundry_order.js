"use strict";
const moment = require('moment')
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class laundry_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      laundry_order.belongsTo(models.user, {
        foreignKey: "customerId",
        as: "customer",
      }),
        laundry_order.belongsTo(models.user, {
          foreignKey: "customerId",
          as: "driver",
        });
      laundry_order.hasMany(models.laundry_order_item, {
        foreignKey: "laundryOrderId",
      });
    }
  }
  laundry_order.init(
    {
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
        type: Sequelize.DOUBLE(11, 2),
      },
      tax: {
        type: Sequelize.DOUBLE(11, 2),
      },
      totalOrderAmount: {
        type: Sequelize.DOUBLE(11, 2),
      },
      totalItems: {
        type: Sequelize.INTEGER,
      },
      orderType: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      driverId: {
        type: Sequelize.INTEGER,
      },
      assignDate: {
        type: Sequelize.DATE,
      },
      startLocation: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING,
      },
      orderPayed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      toPrint: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deliveryDate: {
        type: Sequelize.DATE,
      },
      shopId: {
        type: Sequelize.INTEGER,
      },
      isDeliveryOrder: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      d:{
        type:Sequelize.VIRTUAL,
        get(){
          return moment(this.assignDate).format('YYYY-MM-DD')
        }
      }
    },
    {
      sequelize,
      modelName: "laundry_order",
    }
  );
  return laundry_order;
};
