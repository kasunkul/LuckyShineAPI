const express = require('express');
const moment = require('moment');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

router.post('/sales', checkAuth, async (req, res) => {
  try {
    const { startDate, endDate, categoryId, shopId, itemId } = req.body;

    let query = `SELECT 
    laundry_items.itemName,
    SUM(unitsPurchased) AS unitsPurchased,
    SUM(laundry_order_items.unitPrice * unitsPurchased) AS unitPrice,
    itemId,
    laundry_items.itemCategoryId
FROM
    lavup_db.laundry_order_items
        INNER JOIN
    laundry_items ON laundry_order_items.itemId = laundry_items.id
        INNER JOIN
    laundry_orders ON laundry_order_items.laundryOrderId = laundry_orders.id
        `;

    if (startDate) {
      query += `WHERE
            (DATE(laundry_orders.createdAt) >= DATE('${startDate}'))`;
    }
    if (endDate) {
      if (query.includes('WHERE')) {
        query += `AND
                (DATE(laundry_orders.createdAt) <= DATE('${endDate}'))`;
      } else {
        query += `WHERE
        (DATE(laundry_orders.createdAt) <= DATE('${endDate}'))`;
      }
    }

    if (shopId) {
      if (query.includes('WHERE')) {
        query += `AND
            laundry_orders.shopId = ${shopId}`;
      } else {
        query += `WHERE
            laundry_orders.shopId = ${shopId}`;
      }
    }

    if (categoryId) {
      if (query.includes('WHERE')) {
        query += `AND
            laundry_items.itemCategoryId = ${categoryId}`;
      } else {
        query += `WHERE
            laundry_items.itemCategoryId =${categoryId}`;
      }
    }

    if (itemId) {
      if (query.includes('WHERE')) {
        query += `AND
        laundry_order_items.itemId = ${itemId}`;
      } else {
        query += `WHERE
        laundry_order_items.itemId =${itemId}`;
      }
    }

    query += ` GROUP BY laundry_items.itemName , laundry_order_items.itemId`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
