const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const { Op } = db.Sequelize;

router.post('/with-password', checkAuth, async (req, res) => {
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

router.post('/', checkAuth, async (req, res) => {
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

router.put('/status/:id', checkAuth, async (req, res) => {
  try {
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

router.put('/:id', checkAuth, async (req, res) => {
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
    delete req.body.password;
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

router.get('/', checkAuth, async (req, res) => {
  try {
    // Total employees and active employees

    const [totalEmp, activeEmp] = await Promise.all([
      db.user.count({
        where: {
          role: {
            [Op.in]: ['admin', 'labManager', 'storeManager'],
          },
        },
      }),
      db.user.count({
        where: {
          role: {
            [Op.in]: ['admin', 'labManager', 'storeManager'],
          },
          status: 'active',
        },
      }),
    ]);

    // Monthly top performers
    const query = `SELECT 
    CONCAT(firstName, ' ', lastName) AS name,
    id,
    status,
    role,
    DATE_FORMAT(CONVERT_TZ(lastSignOff, '+00:00', '+02:00'),
            '%d/%m/%y') AS signOff,
    DATE_FORMAT(CONVERT_TZ(lastSignIn, '+00:00', '+02:00'),
    '%d/%m/%y') AS signIn,
    TIMESTAMPDIFF(HOUR,
        lastSignIn,
        lastSignOff) AS hours
FROM
    lavup_db.users
WHERE
    role IN ('admin' , 'labManager', 'storeManager', 'driver') limit 5`;

    const performers = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const inactive = totalEmp - activeEmp;

    return res.status(200).json({
      totalEmp,
      activeEmp,
      inactive,
      performers,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/list/:type', checkAuth, async (req, res) => {
  try {
    const { type } = req.params;
    // type can be all and active

    let query = `SELECT 
    CONCAT(firstName, ' ', lastName) AS name,
    id,
    status,
    role,
    DATE_FORMAT(CONVERT_TZ(lastSignOff, '+00:00', '+02:00'),
    '%d/%m/%y') AS signOff,
    DATE_FORMAT(CONVERT_TZ(lastSignIn, '+00:00', '+02:00'),
    '%d/%m/%y') AS signIn,
    TIMESTAMPDIFF(HOUR,
        lastSignIn,
        lastSignOff) AS hours
FROM
    lavup_db.users
WHERE
    role IN ('admin' , 'labManager', 'storeManager', 'driver')`;
    if (type === 'active') {
      query += " AND status = 'active'";
    }

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
