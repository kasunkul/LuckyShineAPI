const express = require('express');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const { Op } = db.Sequelize;

router.post('/', checkAuth, async (req, res) => {
  try {
    // check category name uniqueness
    const isExists = await db.laundry_item.findOne({
      where: {
        itemName: req.body.itemName,
      },
    });
    if (isExists) {
      return res.sendStatus(422);
    }
    await db.laundry_item.create(req.body);

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/status/:id', checkAuth, async (req, res) => {
  try {
    await db.laundry_item.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/:id', checkAuth, async (req, res) => {
  try {
    // check fiscal code uniqueness
    const isExists = await db.laundry_item.findOne({
      where: {
        itemName: req.body.itemName,
        id: {
          [Op.ne]: req.params.id,
        },
      },
    });

    if (isExists) {
      return res.sendStatus(422);
    }
    await db.laundry_item.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }
});

router.get('/list', checkAuth, async (req, res) => {
  try {
    const data = await db.laundry_item.findAll({
      include: [{ model: db.item_category }],
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const highestItemQuery = `SELECT 
    itemName, tb2.c, tb2.total
FROM
    laundry_items
        INNER JOIN
    (SELECT 
        itemId, SUM(unitPrice) AS total, COUNT(*) AS c
    FROM
        lavup_db.laundry_order_items
    WHERE
        MONTH(laundry_order_items.createdAt) = MONTH(CURDATE())
            AND YEAR(laundry_order_items.createdAt) = YEAR(CURDATE())
    GROUP BY itemId
    ORDER BY total DESC
    LIMIT 1) AS tb2 ON laundry_items.id = tb2.itemId`;

    const leastItemQuery = `SELECT 
    itemName, tb2.c, tb2.total
FROM
    laundry_items
        INNER JOIN
    (SELECT 
        itemId, SUM(unitPrice) AS total, COUNT(*) AS c
    FROM
        lavup_db.laundry_order_items
    WHERE
        MONTH(laundry_order_items.createdAt) = MONTH(CURDATE())
            AND YEAR(laundry_order_items.createdAt) = YEAR(CURDATE())
    GROUP BY itemId
    ORDER BY total
    LIMIT 1) AS tb2 ON laundry_items.id = tb2.itemId`;

    const query = `SELECT 
    t1.*, 
    DATE_FORMAT(CONVERT_TZ(t2.d, '+00:00', '+02:00'),
    '%d/%m/%y') AS d
FROM
    (SELECT 
        laundry_order_items.itemId,
            COUNT(*) AS numberOfUnits,
            laundry_items.itemName,
            laundry_items.unitPrice
    FROM
        lavup_db.laundry_order_items
    INNER JOIN laundry_items ON laundry_order_items.itemId = laundry_items.id
    WHERE
        MONTH(laundry_order_items.createdAt) = MONTH(CURDATE())
            AND YEAR(laundry_order_items.createdAt) = YEAR(CURDATE())
    GROUP BY itemId) AS t1
        INNER JOIN
    ((SELECT 
        COALESCE(MAX(createdAt)) AS d, itemId
    FROM
        laundry_order_items
    GROUP BY itemId)) AS t2 ON t1.itemId = t2.itemId`;

    const [itemsCount, items, highestSale, leastSale] = await Promise.all([
      db.laundry_item.count(),
      db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      }),
      db.sequelize.query(highestItemQuery, {
        type: db.sequelize.QueryTypes.SELECT,
        logging:console.log
      }),
      db.sequelize.query(leastItemQuery, {
        type: db.sequelize.QueryTypes.SELECT,
        logging:console.log 
      }),

    ]);
    

    console.log('higest sale',highestSale[0])

    return res.status(200).json({
      itemsCount,
      highestSale: highestSale[0],
      leastSale: leastSale[0],
      items,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/:id', checkAuth, async (req, res) => {
  try {
    const data = await db.laundry_item.findOne({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
