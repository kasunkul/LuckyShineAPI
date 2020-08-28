const express = require('express');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;

router.get('/', async (req, res) => {
  try {
    // Total order
    const [itemsCount, pendingCount] = await Promise.all([
      db.laundry_order.count(),
      db.laundry_order.count({
        where: {
          status: 'pending',
        },
      }),
    ]);

    const completedCount = itemsCount - pendingCount;

    const items = await db.laundry_order.findAll({
      where: {
        [Op.and]: [
          db.Sequelize
            .literal(`MONTH(laundry_order.createdAt) = MONTH(CURDATE())
                  AND YEAR(laundry_order.createdAt) = YEAR(CURDATE())`),
        ],
      },
    });

    return res.status(200).json({
      itemsCount,
      pendingCount,
      completedCount,
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
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
