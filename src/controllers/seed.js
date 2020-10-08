const express = require('express');
const axios = require('axios');
const db = require('../../models');

const router = express.Router();
const { sendEmail } = require('../utils/sendEmail');
const { cal } = require('../utils/priceCal');

router.post('/', async (req, res) => {
  try {
    const data = [];
    for (let i = 1; i <= 3; i++) {
      for (let index = 1; index <= 700; index++) {
        data.push({
          uniqueId: `S${index}`,
          type: 'shop',
          shopId: i,
        });
      }
    }

    for (let index = 1; index <= 3000; index++) {
      data.push({
        uniqueId: `L${index}`,
        type: 'lab',
        shopId: null,
      });
    }

    await db.slot.bulkCreate(data);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  try {
    await sendEmail();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/v2', async (req, res) => {
  try {
    // await sendEmail();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/shop', async (req, res) => {
  try {
    // 3.5 - 2.87 = 0.63
    const orders = [
      {
        qty: 2,
        unitPrice: 0.98,
        id: 1,
        needIron: true,
      },
      // {
      //   qty: 2,
      //   unitPrice: 6.15,
      //   id: 1,
      //   needIron: true,
      // },
      // {
      //   qty: 2,
      //   unitPrice: 2.62,
      //   id: 1,
      //   needIron: true,
      // },
    ];
    const data = await cal(orders, 1);
    console.log('order total', data.orderValue); // 28.2
    console.log('tax', data.tax); //
    console.log('total order amount', data.totalOrderAmount); // 28.2

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
