const express = require("express");
const db = require("../../models");
const axios = require("axios");
const router = express.Router();
const { sendEmail } = require("../utils/sendEmail");
router.post("/", async (req, res) => {
  try {
    const data = [];
    for (let i = 1; i <= 3; i++) {
      for (let index = 1; index <= 700; index++) {
        data.push({
          uniqueId: `S${index}`,
          type: "shop",
          shopId: i,
        });
      }
    }

    for (let index = 1; index <= 3000; index++) {
      data.push({
        uniqueId: `L${index}`,
        type: "lab",
        shopId: null,
      });
    }

    await db.slot.bulkCreate(data);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
  try {
    await sendEmail();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/v2", async (req, res) => {
  try {
    // await sendEmail();
    
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// var req = unirest("POST", "");

// req.headers({

// });



module.exports = router;
