const jwt = require("jsonwebtoken");

module.exports.decodeToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    res.send(decodedToken);
  } catch (err) {
    res.status(401).send("Unauthorized Access");
    next(err);
  }
};
