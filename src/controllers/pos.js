const express = require('express');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

router.post('/', checkAuth, async (req, res) => {
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
      isDeliveryOrder,
    } = req.body;
    const orderValue = cart.map((e) => e.price).reduce((a, b) => a + b);
    const status = 'inQueue';

    let deliveryDate = null;
    if (assignDate) {
      deliveryDate = assignDate;
    }

    const orderData = {
      customerId,
      orderValue,
      tax: orderValue * (22 / 100),
      totalOrderAmount: orderValue + orderValue * (22 / 100),
      totalItems,
      orderType,
      driverId,
      assignDate,
      notes,
      status,
      toPrint: 1,
      orderPayed,
      shopId,
      deliveryDate,
      isDeliveryOrder,
    };

    if (!customerId) {
      orderData.customerId = 4;
    }
    if (!driverId) {
      delete orderData.driverId;
      delete orderData.assignDate;
      delete orderData.notes;
    }

    console.log('cart', cart);
    const data = await db.laundry_order.create(orderData);
    const cartBulk = [];
    cart.forEach((e) => {
      for (let index = 0; index < e.qty; index++) {
        cartBulk.push({
          laundryOrderId: data.dataValues.id,
          unitPrice: e.unitPrice,
          itemId: e.id,
          needIron: e.needIron,
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
    res.sendStatus(500);
  }
});

router.get('/itemList', checkAuth, async (req, res) => {
  try {
    const items = await db.laundry_item.findAll({
      attributes: [
        ['itemName', 'name'],
        'id',
        ['unitPrice', 'price'],
        'unitPrice',
        'itemCategoryId',
      ],
      where: {
        status: true,
      },
      raw: true,
    });
    const categories = await db.item_category.findAll({
      include: [{
        model: db.laundry_item,
        where: {
          status: true,
        },
        required: true,
      }],
    });
    items.forEach((element, i, a) => {
      a[i].qty = 1;
      element.needIron = false;
    });
    res.status(200).json({ items, categories });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/list/:type', checkAuth, async (req, res) => {
  try {
    const { type } = req.params;

    const query = {
      order: db.sequelize.literal('laundry_order.id DESC'),
      // raw: true,
      include: [
        {
          model: db.user,
          as: 'driver',
          attributes: ['firstName', 'lastName', 'fullName'],
          required: false,
        },
        {
          model: db.user,
          as: 'customer',
          attributes: [
            'firstName',
            'lastName',
            'address',
            'street1',
            'street2',
            'city',
            'stateRegion',
            'postalCode',
            'fullName',
          ],
          required: false,
        },
      ],

    };

    if (type !== 'all') {
      query.where = {
        status: 'returned',
      };
    }

    const data = await db.laundry_order.findAll(query);

    // data.forEach((element) => {
    //   element.driver = `${element["driver.firstName"]} ${element["driver.lastName"]}`;
    //   element.customer = `${element["customer.firstName"]} ${element["customer.lastName"]}`;
    // });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
