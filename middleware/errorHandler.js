module.exports.errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something Failed Internally");
};
