const express = require('express');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;
const checkAuth = require('../middleware/auth');

router.get('/', checkAuth, async (req, res) => {
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

router.get('/list', checkAuth, async (req, res) => {
  try {
    const data = await db.laundry_order.findAll({
      order: db.sequelize.literal('laundry_order.id DESC'),
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/available-slots', checkAuth, async (req, res) => {
  try {
    const query = `SELECT 
    *
FROM
    slots`;
    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/:id', checkAuth, async (req, res) => {
  try {
    const data = await db.laundry_order.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: db.laundry_order_item,
          include:[{
            model:db.laundry_item
          }]
        },
      ],
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/update-status', checkAuth, async (req, res) => {
  try {
    const { id, status, items } = req.body;

    // update status in the order
    await db.laundry_order.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      },
    );

    if (status === 'inQueue') {
      console.log('if statement');
      for (const iterator of items) {
        const { id, slotId } = iterator;
        db.laundry_order_item.update(
          {
            slotId,
          },
          {
            where: {
              id,
            },
          },
        );
      }
    }

    if (status === 'completed') {
      for (const iterator of items) {
        const { id, slotId } = iterator;
        db.laundry_order_item.update(
          {
            slotId: null,
          },
          {
            where: {
              id,
            },
          },
        );
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put('/:id', checkAuth, async (req, res) => {
  try {
    await db.laundry_order.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
