require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendResetOTP, sendFirstTimeOTP } = require("../services/sms.service");
const { generatePassword } = require("../utils/passwordGenerate");
const { json } = require("express");
const { markWorkingDay } = require("../utils/markWorkingDay");
const { startCollecting } = require("../services/arrears.service");

const SECRET_KEY = process.env.SECRET_KEY;

exports.getUserData = async (req, res) => {
  User.findOne({ email: req.user.email })
    .then((user) => {
      const userData = {
        userID: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
      res.status(200).json({ userData: userData });
    })
    .catch((err) => {
      res.status(200).json({ message: "user data not found" });
    });
};

exports.login = async (req, res) => {
  const token = jwt.sign(
    {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      id: req.user.id
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
  const isWorkingDay = req.body.isWorkingDay;
  if (isWorkingDay) {
    // markWorkingDay(req.user.id);
    startCollecting(req.user.id);
  }

  if (req.user.role == "admin" || req.user.role == "collector") {
    const resObject = {
      token: token,
      role: req.user.role,
    };

    return res.status(200).send(resObject);
  } else if (req.user.role == "pending") {
    return res.status(200).send({
      message:
        "Please note that the user account has not been confirmed yet. you need to login with given credentials and reset password to confirm account",
      token: token,
      role: req.user.role,
    });
  } else {
    return res.status(200).json({
      message:
        "Prior registration is required before accessing Meeting Management System",
    });
  }
};

exports.passwordResetToDefault = async (req, res) => {
  const password = generatePassword();
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = {
        email: req.body.email,
      };

      const update = {
        password: hashedPassword,
        role: "pending",
      };

      User.findOneAndUpdate(user, update)
        .then(async (result) => {
          if (!result) {
            res.status(500).send({
              message: "user password reset failed",
            });
          } else {
            // temp password (password) need to send via sms here
            // phone -> user.phone
            await sendResetOTP(user.phone, password);

            res.status(201).send({
              message: "User Password reset Successfull",
              // result,
            });
          }
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error resetting password",
            // error,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
};

exports.tempPasswordReset = async (req, res) => {
  bcrypt
    .hash(req.body.newPassword, 10)
    .then((hashedPassword) => {
      // creating user object
      const user = {
        email: req.user.email,
      };

      const update = {
        password: hashedPassword,
        // role: "collector",
      };

      req.user.role == "admin"
        ? (update.role = "admin")
        : (update.role = "collector");

      // saving user data to database
      User.findOneAndUpdate(user, update, { new: true })
        .then((result) => {
          if (!result) {
            res.status(400).send({
              message: "user Registration failed",
            });
          } else {
            res.status(201).send({
              message: "User Registerd Successfully",
            });
          }
        })
        .catch((error) => {
          res.status(500).send({
            message: error.message,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        error: e.message,
      });
    });
};

// register method
exports.addUser = async (req, res) => {
  const { name, email, phone } = req.body;
  const password = generatePassword();
  console.log(password);
  bcrypt
    .hash(password, 10)
    .then(async (hashedPassword) => {
      // creating user object
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
        role: "pending",
      });

      // temp password (password) need to send via sms here
      // phone -> user.phone
      await sendFirstTimeOTP(phone, password);

      console.log("running");

      user
        .save()
        .then((result) => {
          res.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error creating user",
            error: error.message,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
};

exports.forgetPasswordReset = async (req, res) => {
  const { tempPassword, email, newPassword } = req.body;

  User.findOne({ email: email })
    .then(async (user) => {
      const isMatch = await bcrypt.compare(tempPassword, user.tempPassword);

      if (isMatch) {
        bcrypt
          .hash(newPassword, 10)
          .then((hashedPassword) => {
            const user = {
              email: req.body.email,
            };

            const update = {
              password: hashedPassword,
              tempPassword: undefined,
            };

            User.findOneAndUpdate(user, update)
              .then((result) => {
                res.status(201).send({
                  message: "User Password reset Successfull",
                });
              })
              .catch((error) => {
                res.status(500).send({
                  message: "Error resetting password",
                  // error,
                });
              });
          })
          .catch((e) => {
            res.status(500).send({
              message: "Password was not hashed successfully",
              e,
            });
          });
      } else {
        res.status(400).json({ message: "temp passpord does not match" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "user with given email not found" });
    });
};

exports.forgetPasswordRequest = async (req, res) => {
  const tempPassword = generatePassword();
  bcrypt
    .hash(tempPassword, 10)
    .then((hashedPassword) => {
      const user = {
        email: req.body.email,
      };

      const update = {
        tempPassword: hashedPassword,
      };

      User.findOneAndUpdate(user, update)
        .then(async (result) => {
          if (!result) {
            res.status(500).send({
              message: "user with given email not found",
            });
          } else {
            // temp password (password) need to send via sms here
            // phone -> user.phone
            User.findOne(user)
              .then(async (user) => {
                await sendResetOTP(user.phone, tempPassword);
              })
              .catch((err) => {
                res.status(400).json({ message: err.message });
              });

            res.status(201).send({
              message: "User Password reset Successfull",
              result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({
            message: "Error resetting password",
            // error,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
};

exports.passwordResetByAdmin = async (req, res) => {
  const password = generatePassword();
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = {
        email: req.body.email,
      };

      const update = {
        password: hashedPassword,
        role: "pending",
      };

      User.findOneAndUpdate(user, update)
        .then(async (result) => {
          if (!result) {
            res.status(500).send({
              message: "user password reset failed",
            });
          } else {
            console.log(password);

            // temp password (password) need to send via sms here
            // phone -> user.phone
            await sendResetOTP(user.phone, password);

            res.status(201).send({
              message: "User Password reset Successfull",
              result,
            });
          }
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error resetting password",
            // error,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
};
