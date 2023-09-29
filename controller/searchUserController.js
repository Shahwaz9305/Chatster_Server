const { User } = require("../models/User");
const _ = require("lodash");

module.exports.searchUser = async (req, res) => {
  const { contactName, userName } = req.params;
  let regex = new RegExp(`^${contactName}`, "i");
  let users = await User.find({
    userName: { $regex: regex },
  });

  users = _.map(
    users,
    _.partialRight(_.pick, [
      "_id",
      "userName",
      "firstName",
      "lastName",
      "email",
      "avatar",
      "about",
      "lastOnline",
    ])
  );

  users = users.filter((user) => user.userName !== userName);

  res.status(200).send(users);
};
