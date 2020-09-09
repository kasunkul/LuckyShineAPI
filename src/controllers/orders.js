const express = require('express');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;
const checkAuth = require('../middleware/auth');
const e = require('express');

async function getIds(id) {
  try {
    const q = `SELECT 
    uniqueId
FROM
    lavup_db.slots
WHERE
    shopId = ${id}
        AND uniqueId NOT IN (SELECT 
            laundry_order_items.slotId
        FROM
            lavup_db.laundry_order_items
                INNER JOIN
            laundry_orders ON laundry_order_items.laundryOrderId = laundry_orders.id
        WHERE
            laundry_orders.shopId = ${id}
                AND laundry_order_items.slotId IS NOT NULL)
ORDER BY CONVERT( uniqueId , UNSIGNED)`;
    let data = await db.sequelize.query(q, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    data = data
      .map((e) => Number(e.uniqueId))
      .reduce((r, n) => {
        const lastSubArray = r[r.length - 1];

        if (!lastSubArray || lastSubArray[lastSubArray.length - 1] !== n - 1) {
          r.push([]);
        }

        r[r.length - 1].push(n);

        return r;
      }, []);
    return data;
  } catch (error) {
    throw new Error();
  }
}

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
    // const data = await db.laundry_order.findAll({
    //   order: db.sequelize.literal("laundry_order.id DESC"),
    //   logging:console.log
    // });
    const data = await db.sequelize.query(
      `SELECT 
    id,
    customerId,
    orderValue,
    tax,
    totalOrderAmount,
    totalItems,
    orderType,
    status,
    driverId,
    assignDate,
    startLocation,
    notes,
    orderPayed,
    toPrint,
    deliveryDate,
    shopId,
    isDeliveryOrder,
    DATE_FORMAT(CONVERT_TZ(createdAt, '+00:00', '+02:00'),
            '%Y-%m-%d %h:%i %p') AS createdAt,
    updatedAt
FROM
    laundry_orders
ORDER BY laundry_orders.id DESC`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/list-this-month', checkAuth, async (req, res) => {
  try {
    // const data = await db.laundry_order.findAll({
    //   order: db.sequelize.literal("laundry_order.id DESC"),
    //   logging:console.log
    // });
    const data = await db.sequelize.query(
      `SELECT 
      id,
      customerId,
      orderValue,
      tax,
      totalOrderAmount,
      totalItems,
      orderType,
      status,
      driverId,
      assignDate,
      startLocation,
      notes,
      orderPayed,
      toPrint,
      deliveryDate,
      shopId,
      isDeliveryOrder,
      DATE_FORMAT(CONVERT_TZ(createdAt, '+00:00', '+02:00'),
              '%Y-%m-%d %h:%i %p') AS createdAt,
      updatedAt
  FROM
      laundry_orders
  WHERE
      MONTH(laundry_orders.createdAt) = MONTH(CURDATE())
          AND YEAR(laundry_orders.createdAt) = YEAR(CURDATE())
  ORDER BY laundry_orders.id DESC`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

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

router.get('/v2/:id', checkAuth, async (req, res) => {
  try {
    // 		laundry_order_items
    const meta = await db.laundry_order.findOne({
      attributes: [
        'id',
        'customerId',
        'notes',
        'orderType',
        'orderPayed',
        'createdAt',
        'assignDate',
        'totalItems',
        'totalOrderAmount',
        'status',
        'shopId',
        'isDeliveryOrder',
      ],
      where: {
        id: req.params.id,
      },
      raw: true,
    });

    const items = await db.laundry_order_item.findAll({
      raw: true,
      attributes: ['id', 'itemId', 'slotId', 'needIron'],
      where: {
        laundryOrderId: req.params.id,
      },
      include: [
        {
          model: db.laundry_item,
          attributes: ['itemName'],
        },
      ],
    });

    if (meta.status === 'processing' && meta.shopId) {
      // first get all the available slots
      const ids = await getIds(meta.shopId);

      console.log('ids', ids);

      // if items length = (slot length + 2)
      const equalIdx = ids.findIndex((e) => e.length === items.length + 2);

      if (equalIdx >= 0) {
        console.log('this if');
        ids[equalIdx].forEach((e, i) => {
          if (i !== 0 && i !== ids[equalIdx].length - 1) {
            items[i - 1].slotId = e;
          }
        });
      }

      // if items length < slot length
      const idx = ids.findIndex((e) => e.length > items.length + 2);
      if (idx >= 0) {
        ids[idx].forEach((e, i) => {
          if (i !== 0 && i <= items.length) {
            console.log('if');
            items[i - 1].slotId = e;
          }
        });
      }

      //
    }

    return res.status(200).json({ meta, items });
  } catch (error) {
    console.log(error);
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
          include: [
            {
              model: db.laundry_item,
            },
          ],
        },
      ],
    });

    // if (data.dataValues.status === "processing" && data.dataValues.shopId) {
    //   // first get all the available slots
    //   const ids = await getIds(data.dataValues.shopId);
    //   console.log('ids',data.dataValues.laundry_order_items)
    // }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
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

    if (status === 'ready') {
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
