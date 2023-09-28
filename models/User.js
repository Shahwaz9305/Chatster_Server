const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 3,
    maxlength: 255,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
  },
  avatar: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "Hey there i am using Chatster",
  },
  lastOnline: {
    type: Date,
  },
  rooms: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Rooms",
      default: null,
    },
  ],
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
  ],
});
module.exports.User = mongoose.model("Users", userSchema);

// Request Validation Functions for User Route

module.exports.validateRegisterUserRequest = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(255).required().messages({
      "string.empty": "Username cannot be empty",
      "string.min": "Username should have a minimum length of {#limit}",
      "string.max": "Username should have a maximum length of {#limit}",
    }),
    firstName: Joi.string().min(3).max(255).required().messages({
      "string.empty": "First name cannot be empty",
      "string.min": "First name should have a minimum length of {#limit}",
      "string.max": "First name should have a maximum length of {#limit}",
    }),
    lastName: Joi.string().min(3).max(255).required().messages({
      "string.empty": "Last name cannot be empty",
      "string.min": "Last name should have a minimum length of {#limit}",
      "string.max": "Last name should have a maximum length of {#limit}",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email",
    }),
    password: Joi.string()
      .min(8)
      .max(30)
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .messages({
        "string.empty": "Password cannot be empty",
        "string.min": "Password should have a minimum length of {#limit}",
        "string.max": "Password should have a maximum length of {#limit}",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
      }),
    avatar: Joi.string().messages({
      "string.empty": "Avatar cannot be empty",
    }),
  });

  return schema.validate(data);
};

module.exports.validateLoginUserRequest = (data) => {
  const schema = Joi.object({
    authWith: Joi.alternatives()
      .try(
        Joi.string().email().messages({
          "string.empty": "Authentication field cannot be empty",
          "string.email": "Authentication field must be a valid email",
        }),
        Joi.string().min(3).max(255).messages({
          "string.empty": "Authentication field cannot be empty",
          "string.min":
            "Authentication field should have a minimum length of {#limit}",
          "string.max":
            "Authentication field should have a maximum length of {#limit}",
        })
      )
      .required()
      .messages({
        "any.required": "Authentication field is required",
      }),
    password: Joi.string().required().messages({
      "string.empty": "Password cannot be empty",
    }),
  });

  return schema.validate(data);
};

module.exports.validateAddContactRequest = (data) => {
  const schema = Joi.object({
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.empty": "User ID cannot be empty",
        "string.pattern.base": "User ID must be a valid MongoDB ObjectId",
      }),
    contactId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.empty": "Contact ID cannot be empty",
        "string.pattern.base": "Contact ID must be a valid MongoDB ObjectId",
      }),
  });

  return schema.validate(data);
};
