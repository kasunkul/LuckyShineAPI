const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const db = require('../../models');


const { Op } = db.Sequelize;

router.post('/with-password', async (req, res) => {
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
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    await db.user.create(req.body);

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

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
    delete req.body.password;
    // const salt = bcrypt.genSaltSync(10);
    // req.body.password = bcrypt.hashSync(req.body.password, salt);
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

router.get('/', async (req, res) => {
  try {
    // Total employees and active employees

    const [totalEmp, activeEmp] = await Promise.all([
      db.user.count({
        where: {
          role: {
            [Op.ne]: 'customer',
          },
        },
      }),
      db.user.count({
        where: {
          role: {
            [Op.ne]: 'customer',
          },
          status: 'active',
        },
      }),
    ]);

    const itemsPerEmp = 0;

    // Monthly top performers

    const performers = await db.user.findAll({
      where: {
        role: {
          [Op.ne]: 'customer',
        },
      },
    });

    return res.status(200).json({
      totalEmp,
      activeEmp,
      itemsPerEmp,
      performers,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await db.user.findOne({
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
