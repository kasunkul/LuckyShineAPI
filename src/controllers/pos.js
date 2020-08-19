const express = require('express');

const router = express.Router();
const db = require('../../models');

router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      totalItems,
      orderType,
      driverId,
      assignDate,
      notes,
      cart,
    } = req.body;
    const orderValue = cart.map((e) => e.price).reduce((a, b) => a + b);
    const status = 'pending';

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
    };

    if (!customerId) {
      delete orderData.customerId;
    }
    if (!driverId) {
      delete orderData.driverId;
      delete orderData.assignDate;
      delete orderData.notes;
    }
    await db.laundry_order.create(orderData);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/itemList', async (req, res) => {
  try {
    const data = await db.laundry_item.findAll({
      attributes: [
        ['itemName', 'name'],
        'id',
        ['unitPrice', 'price'],
        'unitPrice',
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
