const jwt = require("jsonwebtoken");
const db = require("../../models");

module.exports = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "luck_shine");
        req.user = decoded;
        next();
    } catch (error) {
        res.sendStatus(401);
    }
};