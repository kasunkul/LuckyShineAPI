const express = require("express");

const router = express.Router();
const db = require("../../models");

router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      totalItems,
      orderType,
      driverId,
      assignDate,
      notes,
      cart,
      orderPayed,
      shopId,
    } = req.body;
    const orderValue = cart.map((e) => e.price).reduce((a, b) => a + b);
    const status = "pending";

    const orderData = {
      customerId,
      orderValue,
      tax: 0,
      totalOrderAmount: orderValue,
      totalItems,
      orderType,
      driverId,
      assignDate,
      notes,
      status,
      toPrint:1,
      orderPayed,
      shopId,
      deliveryDate:assignDate
    };

    if (!customerId) {
      orderData.customerId = 4;
    }
    if (!driverId) {
      delete orderData.driverId;
      delete orderData.assignDate;
      delete orderData.notes;
    }
    const data = await db.laundry_order.create(orderData);
    const cartBulk = [];
    cart.forEach((e) => {
      for (let index = 0; index < e.qty; index++) {
        cartBulk.push({
          laundryOrderId: data.dataValues.id,
          unitPrice: e.unitPrice,
          itemId: e.id,
        });
      }
    });
    // cart.forEach((element) => {
    //   element.laundryOrderId = data.dataValues.id;
    //   element.unitsPurchased = element.qty;
    //   element.subTotal = element.qty * element.price;
    //   element.itemId = element.id;
    //   delete element.id;
    // });

    await db.laundry_order_item.bulkCreate(cartBulk);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/itemList", async (req, res) => {
  try {
    const data = await db.laundry_item.findAll({
      attributes: [
        ["itemName", "name"],
        "id",
        ["unitPrice", "price"],
        "unitPrice",
      ],
      raw: true,
    });
    data.forEach((element, i, a) => {
      a[i].qty = 1;
      element.needIron = false;
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
