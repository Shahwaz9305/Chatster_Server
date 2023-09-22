const User = require("../models/User");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

// Register User
module.exports.registerUser = async (req, res, next) => {
  try {
    const { userName, firstName, lastName, email, password, avatar } = req.body;

    let user = await User.findOne({ userName: userName });

    if (user) return res.send("User with this User Name Already Exist");
    user = await User.findOne({ email: email });
    if (user) return res.send("User with this Email Already exist");

    user = new User({
      userName,
      firstName,
      lastName,
      email,
      password,
      avatar,
    });

    user.password = await bcrypt.hash(user.password, 10);

    let savedUser = await user.save();
    savedUser = _.pick(savedUser, [
      "userName",
      "firstName",
      "lastName",
      "email",
      "avatar",
    ]);
    res.send(savedUser);
  } catch (err) {
    next(err);
  }
};

// SigIn User
module.exports.logIn = async (req, res, next) => {
  try {
    const { authWith, password } = req.body;

    let user = await User.findOne().or([
      { userName: authWith },
      { email: authWith },
    ]);
    if (!user)
      return res.send("User with this User Name or Email dosen't Exist");

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) return res.send("Icorrect Password");

    user = _.pick(user, [
      "userName",
      "firstName",
      "lastName",
      "email",
      "avatar",
    ]);

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY);

    res.send(token);
  } catch (err) {
    next(err);
  }
};

// Add Contact Route
module.exports.addContact = async (req, res, next) => {
  try {
    const { userId, contactId } = req.body;

    const user = await User.updateOne(
      { _id: userId },
      { $push: { contacts: contactId } },
      { new: true }
    );

    res.send(user);
  } catch (err) {
    next(err);
  }
};

// Find User by Id
module.exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    let user = await User.findById({ _id: userId });

    user = user.toObject();
    user = _.omit(user, "password");

    res.send(user);
  } catch (err) {
    next(err);
  }
};

// Get contacts of a User
module.exports.getContacts = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate("contacts");

    let contacts = user.contacts;
    contacts = _.map(
      contacts,
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
    res.send(contacts);
  } catch (err) {
    next(err);
  }
};
