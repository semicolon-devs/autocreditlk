const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tempPassword: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    workingDays: [
      {
        type: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
