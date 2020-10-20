const jwt = require('jsonwebtoken');
const db = require('../../models');

module.exports = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (token == "GUEST") {
            req.user = { id: 0, iat: 1603211581 };
            next();
        } else {
            const decoded = jwt.verify(token, 'lavup');

            console.log("decoded -- ", decoded);

            req.user = decoded;
            // const { id } = req.user;

            db.user.update({ lastSignOff: new Date() }, {
                where: {
                    id: decoded.id,
                },
            }, );
            next();
        }


    } catch (error) {
        res.sendStatus(401);
    }
};