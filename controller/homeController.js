module.exports.home = (req, res, next) => {
  try {
    res.send("This is Chatster home Route");
  } catch (err) {
    next(err);
  }
};
