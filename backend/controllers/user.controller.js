const User = require("../models/user.model");
const {
  validateMobileNumber,
  parseMobileNumber,
} = require("../utils/PhoneNumberValidation");

exports.deleteUser = async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user.role == "admin") {
        res.status(400).json({
          message: "can not remove admin",
        });
      } else {
        User.deleteOne({
          email: user.email,
        })
          .then((result) => {
            res.status(200).json({
              message: "user Removed Successfully",
            });
          })
          .catch((err) => {
            res.status(400).json({
              message: "removing user unsuccessfull !",
              error: err.message,
            });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: err.message,
      });
    });
};

exports.updateProfile = async (req, res) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;

  let payload = {};

  if (name && name != "") {
    payload.name = name;
  }
  if (email && email != "") {
    payload.email = email;
  }

  // add error message to response if phone number is invalid
  if (phone && phone != "" && validateMobileNumber(phone)) {
    payload.phone = phone;
  }

  // const filter = {
  //   _id: id
  // }

  // console.log(id, payload)

  // updating user by id
  User.findByIdAndUpdate(id, payload)
    .then((user) => {
      res.status(201).json({
        message: "Success",
        // user: user
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "updating user unsuccessfull !",
        error: err.message,
      });
    });
};

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "pending" }).select(
      "name userId email phone"
    );

    res.status(200).json({ pendingUsers: users });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getCollectors = async (req, res) => {
  User.find({ role: "collector" })
    .select("userID name email phone workingDays")
    .then((users) => {
      res.status(200).json({ collectors: users });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};



