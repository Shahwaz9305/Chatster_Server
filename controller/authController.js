const jwt = require("jsonwebtoken");

module.exports.auth = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    res.send(decodedToken);
  } catch (err) {
    next(err);
  }
};
