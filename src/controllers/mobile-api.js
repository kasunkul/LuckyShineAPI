const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../models');

const { Op } = db.Sequelize;
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.post('/updateUserField', checkAuth, async (req, res) => {
  try {
    const { fieldName } = req.body;
    const { value } = req.body;
    const userId = req.user.id;

    const user = await db.user.findOne({
      where: {
        id: userId,
      },
    });

    if (user) {
      const query = `UPDATE users SET ${fieldName} = '${value}' WHERE id = ${userId}`;

      await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.UPDATE,
      });
    }

    return res.status(200).json('Successfully updated User.');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email } = req.body;

    // check number uniqueness
    const isExists = await db.user.findOne({
      where: {
        email,
      },
    });

    if (isExists) {
      return res.status(200).json({
        status : 0,
        title: "Email già esistente.",
        message: "Account disponibile con il seguente email. Contatta il team di lavup per ulteriori difficoltà",
      });
    }

    const resetToken = Math.floor(1000 + Math.random() * 9000);
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    await db.user.create({
      firstName: req.body.firstName,
      lastName: '',
      dob: req.body.dob,
      socialSecurityNumber: '',
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      role: 'customer',
      status: 'active',
      password,
      occupation: '',
      isAppUser: 1,
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  try {
    // 1. check whether user exists and active
    const isUserExist = await db.user.findOne({
      where: {
        email: req.body.email,
        status: 'active',
        role: {
          [Op.in]: ['user', 'admin', 'customer'],
        },
      },
    });
    // if not exist
    if (!isUserExist) {
      return res.sendStatus(401);
    }

    // 2. check whether password matches or not
    const isMatch = bcrypt.compareSync(req.body.password, isUserExist.password);
    if (!isMatch) {
      return res.sendStatus(401);
    }

    // 3. issue a JWT
    const { id } = isUserExist;
    const userName = `${isUserExist.firstName} ${isUserExist.lastName}`;
    const token = await jwt.sign(
      {
        id,
      },
      'lavup',
    );

    db.user.update(
      { lastSignIn: new Date() },
      {
        where: {
          id: isUserExist.id,
        },
      },
    );

    return res.status(200).json({
      access_token: token,
      // role: [isUserExist.role],
      user: {
        role: [isUserExist.role],
        data: {
          displayName: userName,
          photoURL: 'assets/images/avatars/Velazquez.jpg',
          email: isUserExist.email,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.get('/getProfile', checkAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `SELECT 

    firstName as name,
      email,
      contactNumber,
      dob,
      concat(users.street1,' ',users.street2) as address,
      occupation,
      socialSecurityNumber
  
   FROM users where users.id = ${userId}`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/getAllCategories', checkAuth, async (req, res) => {
  try {
    const query = `(SELECT 
      0 as id,
      'All' as itemName,
      '' as activeImage,
      '' as inactiveImage
      )
      UNION ALL
      ( 
      SELECT id, itemName  ,
      activeImage,
      inactiveImage
      FROM lavup_db.item_categories
      )`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/getAllItemsFromCategories/:CatId', checkAuth, async (req, res) => {
  try {
    const { CatId } = req.params;
    const userId = req.user.id;
    let tax = 0;

    let CategoryCheck = '';

    if (CatId > 0) {
      CategoryCheck += `and itemCategoryId = ${CatId}`;
    }

    const tax_query = 'SELECT * FROM lavup_db.sysVars where label = \'Tax value\'';

    const tax_data = await db.sequelize.query(tax_query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    tax = (parseFloat(tax_data[0].value) + 100) / 100;

    console.error("tax -- ",tax);

    const query = `SELECT 
    laundry_items.id,
    laundry_items.itemName,
    itemCode,
    itemCategoryId,
    item_categories.itemName as itemCategoryName,
    round(round((laundry_items.unitPrice * ${tax} ),1),2) as unitPrice,
    ifnull(laundry_items.description,'') as description,
    ifnull(cart_items.units,0) as selected,
    0 as maxQty,
    ifnull(cart_items.needIron,0) as iron,
    ifnull(cart_items.notes,'') as notes,
    ifnull(image,'') as image
    
  FROM lavup_db.laundry_items 
  LEFT JOIN lavup_db.item_categories ON laundry_items.itemCategoryId = item_categories.id
  LEFT JOIN (SELECT * FROM cart_items WHERE userId = ${userId}) cart_items ON laundry_items.id = cart_items.itemId
  where laundry_items.status = 1 ${CategoryCheck}`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/getAllItemsSearch', checkAuth, async (req, res) => {
  try {
    console.log('req.body....', req.body);
    const { searchQuery } = req.body;
    const userId = req.user.id;
    let tax = 0;
    const tax_query = 'SELECT * FROM lavup_db.sysVars where label = \'Tax value\'';

    const tax_data = await db.sequelize.query(tax_query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    tax = (parseFloat(tax_data[0].value) + 100) / 100;

    console.log('searchQuery....', req.body.searchQuery);

    const query = `SELECT 
    laundry_items.id,
    laundry_items.itemName,
    itemCode,
    itemCategoryId,
    item_categories.itemName as itemCategoryName,
    round(round((laundry_items.unitPrice * ${tax} ),1),2) as unitPrice,
    ifnull(laundry_items.description,'') as description,
    ifnull(cart_items.units,0) as selected,
    0 as maxQty,
    ifnull(cart_items.needIron,0) as iron,
    ifnull(cart_items.notes,'') as notes,
    ifnull(image,'') as image
    
  FROM lavup_db.laundry_items 
  LEFT JOIN lavup_db.item_categories ON laundry_items.itemCategoryId = item_categories.id
  LEFT JOIN (SELECT * FROM cart_items WHERE userId = ${userId}) cart_items ON laundry_items.id = cart_items.itemId
  where laundry_items.status = 1 and laundry_items.itemName LIKE '%${searchQuery}%'`;

    console.log('query....', query);

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    console.log('data....', data);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/getCartItems', checkAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    let tax = 0;
    const tax_query = 'SELECT * FROM lavup_db.sysVars where label = \'Tax value\'';

    const tax_data = await db.sequelize.query(tax_query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    tax = (parseFloat(tax_data[0].value) + 100) / 100;

    const query = `SELECT 
    laundry_items.id,
    itemName,
    itemCode,
    itemCategoryId,
    round(round((laundry_items.unitPrice * ${tax} ),1),2) as unitPrice,
    ifnull(description,'') as description,
    ifnull(cart_items.units,0) as selected,
    0 as maxQty,
    ifnull(cart_items.needIron,0) as iron,
    ifnull(image,'') as image
    
  FROM lavup_db.laundry_items 
  RIGHT JOIN (SELECT * FROM cart_items WHERE userId = ${userId}) cart_items ON laundry_items.id = cart_items.itemId
  where laundry_items.status = 1 `;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/addToCart', checkAuth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    const isExists = await db.cart_item.findOne({
      where: {
        itemId,
        userId,
      },
    });

    if (isExists) {
      await db.cart_item.update(
        {
          units: (isExists.units + 1),
        },
        {
          where: {
            id: isExists.id,
          },
        },
      );
    } else {
      const laundry_item = await db.laundry_item.findOne({
        where: {
          id: itemId,
        },
      });

      await db.cart_item.create({
        itemId,
        userId,
        unitPrice: laundry_item.unitPrice,
        units: 1,
        needIron: 0,
      });
    }

    return res.status(200).json('Successfully added to Cart.');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/removeFromCart', checkAuth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    const isExists = await db.cart_item.findOne({
      where: {
        itemId,
        userId,
      },
    });

    if (isExists) {
      if ((isExists.units - 1) > 0) {
        await db.cart_item.update(
          {
            units: (isExists.units - 1),
          },
          {
            where: {
              id: isExists.id,
            },
          },
        );
      } else {
        await db.cart_item.destroy(
          {
            where: {
              id: isExists.id,
            },
          },
        );
      }
    }

    return res.status(200).json('Successfully removed from Cart.');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/deleteFromCart', checkAuth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    const isExists = await db.cart_item.findOne({
      where: {
        itemId,
        userId,
      },
    });

    if (isExists) {
      await db.cart_item.destroy(
        {
          where: {
            id: isExists.id,
          },
        },
      );
    }

    return res.status(200).json('Successfully Deleted from Cart.');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/getOrderHistory', checkAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `SELECT 

    concat('LAVUP','',laundry_orders.id) as orderId,
    totalOrderAmount,
    status,
    createdAt
    
    FROM lavup_db.laundry_orders where customerId = ${userId}
    ORDER BY laundry_orders.id DESC
    
    `;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/getOrderDetails', checkAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    let { orderId } = req.body;
    orderId = orderId.replace('LAVUP', '');

    const query = `SELECT 
                    CONCAT(addressline1,' ',city) as address,
                    specialLandmarks as specialLandmarks,
                    laundry_orders.id,
                    concat('LAVUP','',laundry_orders.id) as orderId,
                    totalOrderAmount,
                    tax,
                    orderValue,
                    status,
                    notes,
                    createdAt
    FROM lavup_db.laundry_orders where customerId = ${userId} and laundry_orders.id = '${orderId}'`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const query2 = `SELECT 
    laundry_order_items.unitPrice,
    laundry_order_items.subTotal,
    laundry_order_items.unitsPurchased,
    laundry_items.itemName
    FROM lavup_db.laundry_order_items
    LEFT JOIN laundry_items ON laundry_items.id = laundry_order_items.itemId
    WHERE lavup_db.laundry_order_items.laundryOrderId = '${orderId}'`;

    const data2 = await db.sequelize.query(query2, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    data[0].laundry_order_items = data2;

    console.log(data);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/updateCartItemIronStatus', checkAuth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const { needIron } = req.body;
    const userId = req.user.id;

    const isExists = await db.cart_item.findOne({
      where: {
        itemId,
        userId,
      },
    });

    if (isExists) {
      await db.cart_item.update(
        {
          needIron,
        },
        {
          where: {
            id: isExists.id,
          },
        },
      );
    }

    return res.status(200).json('Successfully added to Cart.');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/updateCartItemNotes', checkAuth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const { notes } = req.body;
    const userId = req.user.id;

    const isExists = await db.cart_item.findOne({
      where: {
        itemId,
        userId,
      },
    });

    if (isExists) {
      await db.cart_item.update(
        {
          notes,
        },
        {
          where: {
            id: isExists.id,
          },
        },
      );
    }

    return res.status(200).json('Successfully added to Cart.');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/getCartPrices', checkAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `SELECT
    sysVars.value as tax_percentage,
    subtotal.sum as subtotal,
    (subtotal.sum * ((sysVars.value + 100)/100)) as grandTotal,
    (subtotal.sum * ((sysVars.value)/100)) as vat
    FROM (

    SELECT name,label,value, 1 as join_id FROM lavup_db.sysVars 
    ) sysVars 
    LEFT JOIN (
    SELECT SUM(unitPrice * units) sum , 1 as join_id from cart_items where userId = ${userId}
    ) subtotal on sysVars.join_id = subtotal.join_id

    where sysVars.name = 'tax'`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/confirmOrder', checkAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { pickUpDate } = req.body;
    const { pickUpTime } = req.body;
    const { deliveryDate } = req.body;
    const { deliveryTime } = req.body;
    const { notes } = req.body;
    const { addressline1 } = req.body;
    const { addressline2 } = req.body;
    const { city } = req.body;
    const { specialLandmarks } = req.body;
    // const userId = 46;

    // get order calculation
    const query = `SELECT
    sysVars.value as tax_percentage,
    round(round((subtotal.sum ),1),2) as subtotal,
    (round(round((subtotal.sum ),1),2) * ((sysVars.value + 100)/100)) as grandTotal,
    (round(round((subtotal.sum ),1),2) * ((sysVars.value)/100)) as vat,
    count.count
    FROM (

    SELECT name,label,value, 1 as join_id FROM lavup_db.sysVars 
    ) sysVars 
    LEFT JOIN (
    SELECT SUM(unitPrice * units) sum , 1 as join_id from cart_items where userId = ${userId}
    ) subtotal on sysVars.join_id = subtotal.join_id
    LEFT JOIN (
    SELECT SUM(units) count , 1 as join_id from cart_items where userId = ${userId}
    ) count on sysVars.join_id = count.join_id

    where sysVars.name = 'tax'`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const orderValue = data[0].subtotal;
    const tax = data[0].vat;
    const totalOrderAmount = data[0].grandTotal;
    const totalItems = data[0].count;

    const laundry_order = await db.laundry_order.create({
      pickUpDate,
      pickUpTime,
      deliveryDate,
      deliveryTime,
      notes,
      addressline1,
      addressline2,
      city,
      specialLandmarks,
      customerId: userId,
      orderValue,
      tax,
      totalOrderAmount,
      totalItems,
      orderType: 'app',
      status: 'pending to pick',
      orderPayed: 0,
      toPrint: 0,
      isDeliveryOrder: 1,
    });

    if (laundry_order) {
      const cart_data = await db.cart_item.findAll({
        where: {
          userId,
        },
      });

      for (const elements of cart_data) {
        await db.laundry_order_item.create({
          laundryOrderId: laundry_order.id,
          unitPrice: elements.unitPrice,
          unitsPurchased: elements.units,
          subTotal: (elements.units * elements.unitPrice),
          itemId: elements.itemId,
          slotId: '',
          needIron: elements.needIron,
          notes: elements.notes,
        });
      }
    }

    await db.cart_item.destroy(
      {
        where: {
          userId,
        },
      },
    );

    return res.status(200).json('Successfully confirmed the Order.');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
