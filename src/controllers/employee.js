const express = require('express');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;

router.post('/', async (req, res) => {
  try {
    // check fiscal code uniqueness
    const isExists = await db.user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (isExists) {
      return res.sendStatus(422);
    }
    await db.user.create(req.body);

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // check fiscal code uniqueness
    const isExists = await db.user.findOne({
      where: {
        email: req.body.email,
        id: {
          [Op.ne]: req.body.id,
        },
      },
    });

    if (isExists) {
      return res.sendStatus(422);
    }
    await db.user.update(req.body, {
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
