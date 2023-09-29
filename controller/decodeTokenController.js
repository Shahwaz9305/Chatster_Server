const jwt = require("jsonwebtoken");

module.exports.decodeToken = async (req, res) => {
  const { token } = req.body;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  res.send(decodedToken);
};
