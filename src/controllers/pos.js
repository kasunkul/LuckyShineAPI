const express = require('express');
const moment = require('moment');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const { sendEmail } = require('../utils/sendEmail');
const { cal } = require('../utils/priceCal');

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

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
      email,
    } = req.body;
    // const orderValue = cart.map((e) => e.price).reduce((a, b) => a + b);
    const status = 'inQueue';

    let deliveryDate = null;
    if (assignDate) {
      deliveryDate = assignDate;
    }

    const orderData = {
      customerId,
      // orderValue,
      // tax: orderValue * taxAmount - orderValue,
      // totalOrderAmount: orderValue * taxAmount,
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
      orderData.customerId = 2;
    }
    if (!driverId) {
      delete orderData.driverId;
      delete orderData.assignDate;
      delete orderData.notes;
    }

    const data = await db.laundry_order.create(orderData, { transaction });

    const { orderValue, tax, totalOrderAmount, cartBulk } = await cal(
      cart,
      data.dataValues.id
    );

    // const cartBulk = [];
    // cart.forEach((e, i) => {
    //   for (let index = 0; index < e.qty; index++) {
    //     cartBulk.push({
    //       laundryOrderId: data.dataValues.id,
    //       unitPrice: e.unitPrice,
    //       itemId: e.id,
    //       needIron: e.needIron,
    //       subTotal: (e.unitPrice * taxAmount).toFixed(1),
    //       unitsPurchased: 1,
    //     });
    //   }
    //   e.idx = i + 1;
    // });
    await db.laundry_order.update(
      {
        totalOrderAmount,
        orderValue,
        tax,
      },
      {
        where: {
          id: data.dataValues.id,
        },
        transaction,
      }
    );

    const user = await db.user.findOne({
      where: {
        id: customerId,
      },
      raw: true,
    });

    await db.laundry_order_item.bulkCreate(cartBulk, { transaction });

    const title = 'Il tuo ordine è confermato';

    const templateData = {
      name: user.firstName,
      orderNo: data.dataValues.id,
      orderDate: moment().format('YYYY-MM-DD'),
      totalItems,
      orderValue: totalOrderAmount,
      items: cart,
      title,
      // shpping
    };

    if (isDeliveryOrder) {
      templateData.shipping = `${user.street1} ${user.street2} ${user.city} ${user.stateRegion} ${user.postalCode}`;
      templateData.assignDate = moment(assignDate).format('YYYY-MM-DD');
      templateData.assignDateTo = moment(assignDate)
        .add(7, 'days')
        .format('YYYY-MM-DD');
    }

    let emailAddress = user.email;
    if (user.id === 2) {
      emailAddress = email;
    }

    sendEmail(templateData, emailAddress);

    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    await transaction.rollback();

    res.sendStatus(500);
  }
});

router.get('/itemList', checkAuth, async (req, res) => {
  try {
    const items = await db.laundry_item.findAll({
      attributes: [
        ['itemName', 'name'],
        'id',
        'image',
        ['unitPrice', 'price'],
        'unitPrice',
        'itemCategoryId',
        'DiscountPrice',
      ],

      where: {
        status: true,
      },
      raw: true,
    });
    const categories = await db.item_category.findAll({
      include: [
        {
          model: db.laundry_item,
          where: {
            status: true,
          },
          required: true,
        },
      ],
    });
    let taxAmount = 0;
    const taxQ = "SELECT * FROM lavup_db.sysVars where label = 'Tax value'";
    const taxD = await db.sequelize.query(taxQ, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    taxAmount = (parseFloat(taxD[0].value) + 100) / 100;

    items.forEach((element, i, a) => {
      a[i].qty = 1;
      element.needIron = false;
      // if (element.DiscountPrice) {
      //   console.log('come to this if',element.DiscountPrice)
      //   element.price = (
      //     Number(element.DiscountPrice) * Number(taxAmount)
      //   ).toFixed(1);
      // } else {
      //   element.price = (Number(element.unitPrice) * Number(taxAmount)).toFixed(
      //     1
      //   );
      // }
      element.price = (Number(element.unitPrice) * Number(taxAmount)).toFixed(
        1
      );
      element.DiscountPrice = (
        Number(element.DiscountPrice) * Number(taxAmount)
      ).toFixed(1);
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
        {
          model: db.shop,
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
