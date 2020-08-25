const express = require("express");

const router = express.Router();
const db = require("../../models");
const checkAuth = require("../middleware/auth");
// const { Op } = db.Sequelize;
router.get("/", async (req, res) => {
  try {
    // Total delivery orders and items
    const [inactiveCount, activeCount, items] = await Promise.all([
      db.user.count({
        where: {
          status: "inactive",
          role: "customer",
        },
      }),
      db.user.count({
        where: {
          status: "active",
          role: "customer",
        },
      }),
      db.user.findAll({
        where: {
          role: "customer",
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

router.get("/list", checkAuth, async (req, res) => {
  try {
    const data = await db.shop.findAll();

    console.log("data", data);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }
});

router.get("/drivers", checkAuth, async (req, res) => {
  try {
    const data = await db.user.findAll({
      attributes: ["firstName", "lastName", "fullName", "id"],
      order: db.sequelize.literal("id DESC"),
      where: {
        role: "driver",
      },
      raw: true,
    });

    data.forEach((element) => {
      element.fullName = element.firstName + " " + element.lastName;
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
