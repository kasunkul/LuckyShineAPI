const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../models');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, contactNumber } = req.body;

    // check contact number uniqueness
    const isExists = await db.user.findOne({
      where: {
        contactNumber,
      },
    });
    if (isExists) {
      return res.sendStatus(422);
    }
    const resetToken = Math.floor(1000 + Math.random() * 9000);
    await db.user.create({
      firstName,
      lastName,
      contactNumber,
      resetToken,
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post('/signup-verify', async (req, res) => {
  try {
    const { resetToken, id } = req.body;

    // check contact number uniqueness
    const isExists = await db.user.findOne({
      where: {
        resetToken,
        id,
      },
    });
    if (!isExists) {
      // doesn't exists
      return res.sendStatus(422);
    }

    await db.user.update(
      {
        status: 'active',
      },
      {
        where: {
          id,
        },
      },
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/set-password', async (req, res) => {
  try {
    const { resetToken, id } = req.body;
    const isExists = await db.user.findOne({
      where: {
        resetToken,
        id,
      },
    });
    if (!isExists) {
      // doesn't exists
      return res.sendStatus(422);
    }
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    await db.user.update(
      {
        password,
      },
      {
        where: {
          id,
        },
      },
    );
    return res.sendStatus(200);
  } catch (error) {
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
      process.env.JWT_KEY,
    );

    return res.status(200).json({ token, userName, role: isUserExist.role });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post('/forget-password', async (req, res) => {
  try {
    const { email } = req.body;
    // 1. check whether user exists and active
    const isUserExist = await db.user.findOne({
      where: {
        email,
        status: 'active',
      },
    });
    // if not exist
    if (!isUserExist) {
      return res.sendStatus(422);
    }
    const passwordResetToken = Math.floor(1000 + Math.random() * 9000);
    await db.user.update({
      passwordResetToken,
    }, {
      where: {
        email,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
