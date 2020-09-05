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
      role: "user",
      status: "active",
      password: password,
      occupation: req.body.occupation,
      isAppUser:  1
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

router.get('/getAllCategories',  async (req, res) => {
  try {

    let query = `(SELECT 
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

router.get('/getAllItemsFromCategories/:CatId',  async (req, res) => {
  try {

    const { CatId } = req.params;
    
    let CategoryCheck = "";

    if (CatId > 0) {
      CategoryCheck += `and itemCategoryId = ${CatId}`;
    }

    let query = `SELECT 
                  id,
                  itemName,
                  itemCode,
                  itemCategoryId,
                  unitPrice,
                  '' as description,
                  0 as selected,
                  0 as maxQty,
                  0 as iron,
                  '' as image
                FROM lavup_db.laundry_items 
                where status = 1 ${CategoryCheck}`;

    const data = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/getAllItemsSearch',  async (req, res) => {
  try {

    const { searchQuery } = req.body.searchQuery;

    let query = `SELECT 
                  id,
                  itemName,
                  itemCode,
                  itemCategoryId,
                  unitPrice,
                  '' as description,
                  0 as selected,
                  0 as maxQty,
                  0 as iron,
                  '' as image
                FROM lavup_db.laundry_items 
                where status = 1 and itemName LIKE '%${searchQuery}%'`;

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

    const itemId = req.body.itemId;
    const userId = req.user.id;

    const isExists = await db.cart_item.findOne({
      where: {
        itemId,
        userId
      },
    });

    if(isExists){


      await db.cart_item.update(
        {
          units: (isExists.units + 1 ),
        },
        {
          where: {
            id: isExists.id,
          },
        }
      );

    }else{

      const laundry_item = await db.laundry_item.findOne({
        where: {
          id: itemId
        },
      });

      await db.cart_item.create({
        itemId: itemId,
        userId: userId,
        unitPrice: laundry_item.unitPrice,
        units: 1,
        needIron: 0
      });
    }


    
    return res.status(200).json("Successfully added to Cart.");

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


module.exports = router;
