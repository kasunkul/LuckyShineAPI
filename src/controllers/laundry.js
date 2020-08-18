const express = require('express');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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
    return res.sendStatus(500);
  }
});

router.get('/list', async (req, res) => {
  try {
    const data = await db.laundry_item.findAll({
      include: [{ model: db.item_category }],
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  try {
    // Total laundry items
    const [itemsCount] = await Promise.all([db.laundry_item.count()]);

    await db.laundry_item.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const highestSale = 25;
    const leastSale = 50;

    const items = await db.laundry_item.findAll();

    return res.status(200).json({
      itemsCount,
      highestSale,
      leastSale,
      items,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
