const jwt = require('jsonwebtoken');
const db = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    // const { id } = req.user;

    db.user.update(
      { lastSeen: new Date() },
      {
        where: {
          id: decoded.id,
        },
      },
    );
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};
