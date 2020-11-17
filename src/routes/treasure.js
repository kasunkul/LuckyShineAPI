const express = require("express");
const controller = require("../controllers/treasure");
const router = express.Router();
const checkAuth = require("../middleware/auth");
const {
    findTreasureBoxesValidationRules,
    validate,
} = require("../validations/validator.js");

router.post(
    "/findTreasureBoxes", [checkAuth, findTreasureBoxesValidationRules(), validate],
    controller.findTreasureBoxes
);

module.exports = router;