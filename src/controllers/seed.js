const express = require("express");
const db = require("../../models");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = [];
    for (let i = 1; i <= 3; i++) {
      for (let index = 1; index <= 200; index++) {
        data.push({
          uniqueId: index,
          type: "slot",
          shopId: i,
        });
      }
    }
    
    await db.slot.bulkCreate(data);
    res.sendStatus(200);
  } catch (error) {
      console.log(error)
    res.sendStatus(500);
  }
});

module.exports = router;
