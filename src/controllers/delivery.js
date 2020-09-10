const express = require('express');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;
const checkAuth = require('../middleware/auth');

router.get('/', checkAuth, async (req, res) => {
  try {
    // Total delivery orders and items
    const [deliveryCount, returnedDelivery, items] = await Promise.all([
      db.laundry_order.count({
        where: {
          status: {
            [Op.in]: ['pending', 'inQueue'],
          },
        },
      }),
      db.laundry_order.count({
        where: {
          status: 'returned',
        },
      }),
      db.laundry_order.findAll({
        attributes: ['id', 'assignDate', 'd', 'startLocation', 'status'],
        where: {
          [Op.and]: [
            db.Sequelize
              .literal(`MONTH(laundry_order.createdAt) = MONTH(CURDATE())
                AND YEAR(laundry_order.createdAt) = YEAR(CURDATE())`),
          ],
        },
        include: [
          {
            model: db.user,
            as: 'driver',
            required: true,
          },
        ],
        order: db.sequelize.literal('laundry_order.id DESC'),

        logging: true,
      }),
    ]);

    return res.status(200).json({
      deliveryCount,
      returnedDelivery,
      items,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/list/:type', checkAuth, async (req, res) => {
  try {
    const { type } = req.params;

    const query = {
      attributes: ['id', 'assignDate', 'd', 'startLocation', 'status'],
      order: db.sequelize.literal('laundry_order.id DESC'),
      raw: true,
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
      where: {
        status: {
          [Op.in]: ['onDelivery'],
        },
      },
    };

    // if (type !== "all") {
    //   query.where = {
    //     status: "returned",
    //   };
    // }

    const data = await db.laundry_order.findAll(query);

    data.forEach((element) => {
      element.driver = `${element['driver.firstName']} ${element['driver.lastName']}`;
      element.customer = `${element['customer.firstName']} ${element['customer.lastName']}`;
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post('/print', async (req, res) => {
  try {
    await db.laundry_order.update(
      {
        toPrint: true,
      },
      {
        where: {
          id: req.body.orderId,
        },
      },
    );
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
