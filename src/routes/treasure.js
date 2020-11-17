const express = require("express");
const controller = require("../controllers/treasure");
const router = express.Router();
const checkAuth = require('../middleware/auth');

router.post("/findTreasureBoxes", checkAuth, controller.findTreasureBoxes);

module.exports = router;