const express = require("express");

const router = express.Router();
const db = require("../../models");
const checkAuth = require("../middleware/auth");

const { Op } = db.Sequelize;
router.get("/", checkAuth, async (req, res) => {
  try {
    // query
    const query = `select * from (SELECT 
      CONCAT(users.firstName, ' ', lastName) AS name,
      customerId AS id,
      users.contactNumber,
      users.status,
      SUM(totalOrderAmount) AS value
  FROM
      lavup_db.laundry_orders
          INNER JOIN
      users ON laundry_orders.customerId = users.id
  WHERE
      MONTH(laundry_orders.createdAt) = MONTH(CURDATE())
          AND YEAR(laundry_orders.createdAt) = YEAR(CURDATE())
  GROUP BY customerId) k order by k.value desc;`;

    //
    const standardCustomersQ = `SELECT COUNT(*) AS standard FROM lavup_db.laundry_orders INNER JOIN
  users ON laundry_orders.customerId = users.id WHERE
  MONTH(laundry_orders.createdAt) = MONTH(CURDATE())
  AND YEAR(laundry_orders.createdAt) = YEAR(CURDATE())
  AND users.email = 'standard@gmail.com'`;

  const customers = `SELECT COUNT(*) AS registeredCustomers FROM (SELECT 
  customerId FROM lavup_db.laundry_orders
  INNER JOIN users ON laundry_orders.customerId = users.id
  WHERE
      MONTH(laundry_orders.createdAt) = MONTH(CURDATE())
          AND YEAR(laundry_orders.createdAt) = YEAR(CURDATE())
          AND users.email != 'standard@gmail.com'
  GROUP BY customerId) AS x`
    // Total delivery orders and items
    const [
      inactiveCount,
      activeCount,
      items,
      standard,
      customersCount

    ] = await Promise.all([
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
      db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
      }),
      db.sequelize.query(standardCustomersQ, {
        type: db.sequelize.QueryTypes.SELECT,
      }),
      db.sequelize.query(customers, {
        type: db.sequelize.QueryTypes.SELECT,
      }),
    ]);



    
    
    const totalCustomerVisits = standard[0].standard + customersCount[0].registeredCustomers
    return res.status(200).json({
      inactiveCount,
      activeCount,
      items,
      totalCustomerVisits

      
    });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get("/list/:type", checkAuth, async (req, res) => {
  try {
    const { type } = req.params;

    let query = `SELECT 
    users.id,
    contactNumber,
    users.status,
    CONCAT(firstName, ' ', lastName) AS fullName,
    k.d,
    IF(isAppUser,
      'Mobile app customer',
      'Walking customer') AS customerType
FROM
    users
        LEFT JOIN
    (SELECT 
        COALESCE(MAX(createdAt)) AS d, customerId
    FROM
        laundry_orders
    GROUP BY customerId) AS k ON k.customerId = users.id
WHERE
    role = 'customer'`;

    if (type === "active") {
      query += " and users.status = 'active'";
    }
    if (type === "inactive") {
      query += " and users.status = 'inactive'";
    }
    if (type ==='month') {
      query += ` and MONTH(k.d) = MONTH(CURDATE())
      AND YEAR(k.d) = YEAR(CURDATE())`
    }

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      logging:console.log
    });

    return res.status(200).json(data);
  } catch (error) {
    console.log('error',error)
    return res.sendStatus(500);
  }
});

router.get("/drivers", checkAuth, async (req, res) => {
  try {
    const data = await db.user.findAll({
      attributes: ["firstName", "lastName", "fullName", "id"],
      order: db.sequelize.literal("id DESC"),
      logging: console.log,
      where: {
        role: "driver",
      },
      raw: true,
    });

    data.forEach((element) => {
      element.fullName = `${element.firstName} ${element.lastName}`;
    });

    return res.status(200).json(data);
  } catch (error) {
    // console.log('data',data)
    return res.sendStatus(500);
  }
});

module.exports = router;
