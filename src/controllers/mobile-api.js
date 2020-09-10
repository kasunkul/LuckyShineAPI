const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../models');

const { Op } = db.Sequelize;
const checkAuth = require('../middleware/auth');

const router = express.Router();

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
      return res.sendStatus(422);
    }

    const resetToken = Math.floor(1000 + Math.random() * 9000);
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    await db.user.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dob: req.body.dob,
      socialSecurityNumber: req.body.socialSecurityNumber,
      email: req.body.email,
      role: 'user',
      status: 'active',
      password,
      occupation: req.body.occupation,
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
          [Op.in]: ['user'],
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
          email: 'johndoe@withinpixels.com',
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


    let query = `SELECT 

    concat(firstName,' ',lastName) as name,
      email,
      contactNumber,
      dob,
      concat(users.street1,' ',users.street2) as address,
      occupation,
      socialSecurityNumber
  
   FROM users where user.id = ${userId}`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/getAllCategories', async (req, res) => {

  try {
    const query = `(SELECT 
      0 as id,
      'All' as itemName 
      )
      UNION ALL
      ( 
      SELECT id, itemName 
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

router.get('/getAllItemsFromCategories/:CatId', async (req, res) => {
  try {
    const { CatId } = req.params;

    let CategoryCheck = '';

    if (CatId > 0) {
      CategoryCheck += `and itemCategoryId = ${CatId}`;
    }

    const query = `SELECT 
    laundry_items.id,
    itemName,
    itemCode,
    itemCategoryId,
    laundry_items.unitPrice,
    ifnull(description,'') as description,
    ifnull(cart_items.units,0) as selected,
    0 as maxQty,
    ifnull(cart_items.needIron,0) as iron,
    ifnull(image,'') as image
    
  FROM lavup_db.laundry_items 
  LEFT JOIN (SELECT * FROM cart_items WHERE userId = 46) cart_items ON laundry_items.id = cart_items.itemId
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

router.post('/getAllItemsSearch', async (req, res) => {
  try {
    const { searchQuery } = req.body.searchQuery;

    const query = `SELECT 
    laundry_items.id,
    itemName,
    itemCode,
    itemCategoryId,
    laundry_items.unitPrice,
    ifnull(description,'') as description,
    ifnull(cart_items.units,0) as selected,
    0 as maxQty,
    ifnull(cart_items.needIron,0) as iron,
    ifnull(image,'') as image
    
  FROM lavup_db.laundry_items 
  LEFT JOIN (SELECT * FROM cart_items WHERE userId = 46) cart_items ON laundry_items.id = cart_items.itemId
  where laundry_items.status = 1 and itemName LIKE '%${searchQuery}%'`;

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

    const itemId = req.body.itemId;
    const userId = req.user.id;

    const isExists = await db.cart_item.findOne({
      where: {
        itemId,
        userId
      },
    });

    if(isExists){


      if((isExists.units - 1) > 0){
        await db.cart_item.update(
          {
            units: (isExists.units - 1),
          },
          {
            where: {
              id: isExists.id,
            },
          }
        );
      }else{

        await db.cart_item.delete(
          {
            where: {
              id: isExists.id,
            },
          }
        );

      }

      

    }

    
    return res.status(200).json("Successfully removed from Cart.");

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/getOrderHistory', checkAuth, async (req, res) => {
  try {

  
    const userId = req.user.id;

    let query = `SELECT 

    concat('LAVUP','',laundry_orders.id) as orderId,
    totalOrderAmount,
    status,
    createdAt
    
    FROM lavup_db.laundry_orders where customerId = ${userId}`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/updateCartItemIronStatus', checkAuth, async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const needIron = req.body.needIron;
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
          needIron: needIron,
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
    const itemId = req.body.itemId;
    const notes = req.body.notes;
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
          notes: notes,
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
    let query = `SELECT
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

router.post('/confirmOrder',  async (req, res) => {
  try {
    const pickUpDate = req.body.pickUpDate;
    const pickUpTime = req.body.pickUpTime;
    const deliveryDate = req.body.deliveryDate;
    const deliveryTime = req.body.deliveryTime;
    const notes = req.body.notes;
    const addressline1 = req.body.addressline1;
    const addressline2 = req.body.addressline2;
    const city = req.body.city;
    const specialLandmarks = req.body.specialLandmarks;
    const userId = 46;

    //get order calculation
    let query = `SELECT
    sysVars.value as tax_percentage,
    subtotal.sum as subtotal,
    (subtotal.sum * ((sysVars.value + 100)/100)) as grandTotal,
    (subtotal.sum * ((sysVars.value)/100)) as vat,
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

    const orderValue = data[0].subtotal
    const tax = data[0].vat
    const totalOrderAmount = data[0].grandTotal;
    const totalItems = data[0].count;

    let laundry_order = await db.laundry_order.create({
      pickUpDate: pickUpDate,
      pickUpTime: pickUpTime,
      deliveryDate: deliveryDate,
      deliveryTime: deliveryTime,
      notes: notes,
      addressline1: addressline1,
      addressline2: addressline2,
      city: city,
      specialLandmarks: specialLandmarks,
      userId: userId,
      orderValue: orderValue,
      tax: tax,
      totalOrderAmount: totalOrderAmount,
      totalItems: totalItems,
      orderType: "app",
      status: "pending",
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

      for (let elements of cart_data) {
        await db.laundry_order_item.create({
          laundryOrderId: laundry_order.id,
          unitPrice: elements.unitPrice,
          unitsPurchased: elements.units,
          subTotal: (elements.units * elements.unitPrice),
          itemId: elements.itemId,
          slotId: "",
          needIron: elements.needIron,
          notes: elements.notes
        });
      }
    } 

    await db.cart_item.delete(
      {
        where: {
          userId,
        },
      }
    );

    return res.status(200).json('Successfully confirmed the Order.');

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
