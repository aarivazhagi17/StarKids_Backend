const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
{
  parentName: {
    type: String,
    required: true,
    trim: true
  },

  childrenName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },

  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },

  program: {
    type: String,
    required: true
  },

  centerCity: {
    type: String,
    required: true
  },

  message: {
    type: String,
    default: ""
  },
},
{
  timestamps: true
}
);

module.exports = mongoose.model("Contact", ContactSchema);