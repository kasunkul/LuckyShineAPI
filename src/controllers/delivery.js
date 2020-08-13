const express = require('express');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;

router.get('/', async (req, res) => {
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
          },
        ],
        order: db.sequelize.literal('laundry_order.id DESC'),

        // logging: true,
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

router.get('/list', async (req, res) => {
  try {
    const data = await db.laundry_order.findAll({
      order: db.sequelize.literal('laundry_order.id DESC'),
      include: [
        {
          model: db.user,
          as: 'driver',
        },
      ],
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
