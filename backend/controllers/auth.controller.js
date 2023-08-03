require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendResetOTP, sendFirstTimeOTP } = require("../services/sms.service");

const SECRET_KEY = process.env.SECRET_KEY;

exports.getUserData = async (req, res) => {
  try {
    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    };

    res.status(200).json({ userData: userData });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  const token = jwt.sign(
    {
      name: req.user.name,
      userID: req.user.userID,
      email: req.user.email,
      role: req.user.role,
      password: req.user.password,
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );

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
        role: "collector",
      };

      // saving user data to database
      User.findOneAndUpdate(user, update, { new: true })
        .then((result) => {
          if (!result) {
            console.log(result);
            res.status(400).send({
              message: "user Registration failed",
            });
          } else {
            res.status(201).send({
              message: "User Registerd Successfully",
              // userData: {
              //   email: result.email
              // }
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
        e,
      });
    });
};

const generatePassword = () => {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = 8;
  var password = "";

  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
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

  User.findOne({ email: email }),
    then(async (user) => {
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
              .then(async (result) => {
                if (!result) {
                  res.status(500).send({
                    message: "otp generate failed",
                  });
                } else {
                  // temp password (password) need to send via sms here
                  // phone -> user.phone
                  await sendResetOTP(user.phone, `use OTP - ${password}`);

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
      } else {
        res.status(400).json({ message: "temp passpord does not match" });
      }
    }).catch((err) => {
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
            console.log(tempPassword);

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
