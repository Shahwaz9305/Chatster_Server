const {
  User,
  validateRegisterUserRequest,
  validateLoginUserRequest,
  validateAddContactRequest,
  validateMongoDBId,
} = require("../models/User");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

// Register User
module.exports.registerUser = async (req, res, next) => {
  try {
    const { error } = validateRegisterUserRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { userName, firstName, lastName, password, avatar } = req.body;

    let user = await User.findOne().or([
      { userName: userName },
      { email: email },
    ]);

    if (user)
      return res
        .status(400)
        .send({ error: "User with this username or email already exists" });

    user = new User({
      userName,
      firstName,
      lastName,
      email,
      password,
      avatar,
    });

    user.password = await bcrypt.hash(user.password, 12);

    let savedUser = await user.save();
    savedUser = _.pick(savedUser, [
      "userName",
      "firstName",
      "lastName",
      "email",
      "avatar",
    ]);
    res.status(201).send(savedUser);
  } catch (err) {
    next(err);
  }
};

// logIn User
module.exports.logIn = async (req, res, next) => {
  try {
    const { error } = validateLoginUserRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { authWith, password } = req.body;

    let user = await User.findOne().or([
      { userName: authWith },
      { email: authWith },
    ]);

    if (!user)
      return res
        .status(404)
        .send("User with this User Name or Email dosen't Exist");

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) return res.status(403).send("Icorrect Password");

    user = _.pick(user, [
      "_id",
      "userName",
      "firstName",
      "lastName",
      "email",
      "avatar",
    ]);

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY);

    res.status(200).send(token);
  } catch (err) {
    next(err);
  }
};

// Add Contact Route
module.exports.addContact = async (req, res, next) => {
  try {
    const { error } = validateAddContactRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { userId, contactId } = req.body;

    let user = await User.findById(userId);
    if (user.contacts.includes(contactId))
      return res.status(200).send("User Already Present");

    user = await User.updateOne(
      { _id: userId },
      { $push: { contacts: contactId } },
      { new: true }
    );

    res.status(200).send("Contact Added Successfully");
  } catch (err) {
    next(err);
  }
};

// Find User by Id
module.exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    let user = await User.findById({ _id: userId });

    user = user.toObject();
    user = _.omit(user, "password");

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// Get contacts of a User
module.exports.getContacts = async (req, res, next) => {
  try {
    const { userId } = req.params;
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
    res.status(200).send(contacts);
  } catch (err) {
    next(err);
  }
};
