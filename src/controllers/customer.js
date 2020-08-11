const express = require('express');

const router = express.Router();
const db = require('../../models');

// const { Op } = db.Sequelize;
router.get('/', async (req, res) => {
  try {
    // Total delivery orders and items
    const [inactiveCount, activeCount, items] = await Promise.all([
      db.user.count({
        where: {
          status: 'inactive',
          role: 'customer',
        },
      }),
      db.user.count({
        where: {
          status: 'active',
          role: 'customer',
        },
      }),
      db.user.findAll({
        where: {
          role: 'customer',
        },
      }),
    ]);

    const totalCustomerVisits = 0;

    return res.status(200).json({
      inactiveCount,
      activeCount,
      items,
      totalCustomerVisits,
    });
  } catch (error) {
    // console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
