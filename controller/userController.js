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
const { Chat } = require("../models/Chat");

// Register User
module.exports.registerUser = async (req, res) => {
  const { error } = validateRegisterUserRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { userName, firstName, lastName, email, password, avatar } = req.body;

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
    "_id",
    "userName",
    "firstName",
    "lastName",
    "email",
    "avatar",
  ]);
  res.status(201).send(savedUser);
};

// logIn User
module.exports.logIn = async (req, res) => {
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
};

// Add Contact Route
module.exports.addContact = async (req, res) => {
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
};

// Find User by Id
module.exports.getUser = async (req, res) => {
  const { userId } = req.params;

  let user = await User.findById({ _id: userId });

  user = user.toObject();
  user = _.omit(user, "password");

  res.status(200).send(user);
};

// Get contacts of a User
module.exports.getContacts = async (req, res) => {
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

  for (const contact of contacts) {
    const chat = await Chat.findOne({
      $or: [
        { sender: userId, receiver: contact._id },
        { receiver: userId, sender: contact._id },
      ],
    })
      .limit(1)
      .sort("-createdAt");

    const lastChatInfo = {
      lastChat: chat?.content,
      lastChatTimestamp: chat?.createdAt,
      lastChatType: chat?.contentType,
    };

    Object.assign(contact, lastChatInfo);
  }

  res.status(200).send(contacts);
};

module.exports.setAvatar = async (req, res) => {
  const { id, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { avatar: avatar },
    { new: true }
  );
  res.status(200).send(user);
};
