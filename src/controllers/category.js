const express = require('express');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;

router.post('/', async (req, res) => {
  try {
    // check category name uniqueness
    const isExists = await db.item_category.findOne({
      where: {
        itemName: req.body.itemName,
      },
    });
    if (isExists) {
      return res.sendStatus(422);
    }
    await db.item_category.create(req.body);

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // check fiscal code uniqueness
    const isExists = await db.item_category.findOne({
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
    await db.item_category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await db.item_category.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await db.item_category.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
