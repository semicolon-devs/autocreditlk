require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user.model");
// var nodemailer = require("nodemailer");

const SECRET_KEY = process.env.SECRET_KEY;

exports.getCollectors = async (req, res, next) => {
  User.find({ role: "collector" })
    .select("userID name email phone")
    .then((users) => {
      res.status(200).json({ collectors: users });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.deleteUser = async (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user.role == "admin") {
        res.status(400).json({ message: "can not remove admin" });
      } else {
        User.deleteOne({ email: user.email })
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
      res.status(400).json({ message: err.message });
    });
};

exports.login = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).send(info.message);
    }

    const token = jwt.sign(
      {
        name: user.name,
        userID: user.userID,
        email: user.email,
        role: user.role,
        password: user.password,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    if (user.role == "admin" || user.role == "collector") {
      const resObject = {
        token: token,
        userData: {
          name: user.name,
          userId: user.userID,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      };
      return res.status(200).send(resObject);
    } else if (user.role == "pending") {
      return res.status(200).send({
        message:
          "Please note that the user account has not been confirmed yet. you need to login with given credentials and reset password to confirm account",
        userData: {
          token: token,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(200).json({
        message:
          "Prior registration is required before accessing Meeting Management System",
      });
    }
  })(req, res, next);
};

// exports.logout = async (req, res, next) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.status(200).json({ message: "logout successfull" });
//   });
// };

exports.passwordResetToDefault = async (req, res, next) => {
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
        .then((result) => {
          if (!result) {
            res.status(500).send({
              message: "user password reset failed",
            });
          } else {
            // // send mail to the user with generated password
            // var transporter = nodemailer.createTransport({
            //   service: process.env.EMAIL_PROVIDER,
            //   auth: {
            //     user: process.env.EMAIL_ADDRESS,
            //     pass: process.env.EMAIL_PASSWORD,
            //   },
            // });

            // var mailOptions = {
            //   from: process.env.EMAIL_ADDRESS,
            //   to: req.body.email,
            //   subject: "meeting scheduling new login",
            //   text: `login credentionals of your account \n${req.body.email} \n${password}`,
            // };

            // console.log(mailOptions);

            // transporter.sendMail(mailOptions, function (error, info) {
            //   if (error) {
            //     console.log(error);
            //   } else {
            //     console.log("Email sent: " + info.response);
            //   }
            // });
            // // -------------------------------
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

exports.passwordReset = async (req, res, next) => {
  bcrypt
    .hash(req.body.newPassword, 10)
    .then((hashedPassword) => {
      // creating user object
      const user = {
        email: req.body.email,
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
            res.status(500).send({
              message: "user Registration failed",
            });
          } else {
            res.status(201).send({
              message: "User Registerd Successfully",
              result,
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

exports.getPendingUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "pending" }).select(
      "name userId email"
    );

    res.status(200).json({ pendingUsers: users });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const generatePassword = () => {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = 12;
  var password = "";

  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
};

// register method
exports.addUser = async (req, res, next) => {
  const { name, userID, email, phone, address } = req.body;
  const password = generatePassword();
  console.log(password);
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      // creating user object
      const user = new User({
        name: name,
        userID: userID,
        email: email,
        password: hashedPassword,
        phone: phone,
        address: address,
        role: "pending",
      });

      // // send mail to the user with generated password
      // var transporter = nodemailer.createTransport({
      //   service: process.env.EMAIL_PROVIDER,
      //   auth: {
      //     user: process.env.EMAIL_ADDRESS,
      //     pass: process.env.EMAIL_PASSWORD,
      //   },
      // });

      // var mailOptions = {
      //   from: process.env.EMAIL_ADDRESS,
      //   to: req.body.email,
      //   subject: "meeting scheduling login",
      //   text: `login credentionals of your account \n ${req.body.email} \n ${password}`,
      // };

      // console.log(mailOptions);

      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Email sent: " + info.response);
      //   }
      // });

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
            error: error.message
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


exports.forgetPasswordReset = async (req, res, next) => {
  const {tempPassword, email, newPassword} = req.body;

  User.findOne({email: email})
  ,then(async (user) => {
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
          tempPassword: undefined
        };
  
        User.findOneAndUpdate(user, update)
          .then((result) => {
            if (!result) {
              res.status(500).send({
                message: "otp generate failed",
              });
            } else {
              // // send mail to the user with generated password
              // var transporter = nodemailer.createTransport({
              //   service: process.env.EMAIL_PROVIDER,
              //   auth: {
              //     user: process.env.EMAIL_ADDRESS,
              //     pass: process.env.EMAIL_PASSWORD
              //   }
              // });
  
              // var mailOptions = {
              //   from: process.env.EMAIL_ADDRESS,
              //   to: req.body.email,
              //   subject: 'password reset',
              //   text: `password for meeting scheduling system is updated. \n\n
              //   if you didnot requiest this reset contact admin as soon as possible`
              // };
  
              // transporter.sendMail(mailOptions, function (error, info) {
              //   if (error) {
              //     console.log(error);
              //   } else {
              //     console.log('Email sent: ' + info.response);
              //   }
              // });
              // // -------------------------------
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
      res.status(400).json({message: "temp passpord does not match"})
    }
  })
  .catch((err) => {
    res.status(400).json({message: "user with given email not found"})
  })
};

exports.forgetPasswordRequest = async (req, res, next) => {
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
        .then((result) => {
          if (!result) {
            res.status(500).send({
              message: "user with given email not found",
            });
          } else {
            console.log(tempPassword);
            // // send mail to the user with generated password
            // var transporter = nodemailer.createTransport({
            //   service: process.env.EMAIL_PROVIDER,
            //   auth: {
            //     user: process.env.EMAIL_ADDRESS,
            //     pass: process.env.EMAIL_PASSWORD
            //   }
            // });

            // var mailOptions = {
            //   from: process.env.EMAIL_ADDRESS,
            //   to: req.body.email,
            //   subject: 'Account Recovery Link - Meeting Management System',
            //   text: `We have received a request to reset the password for your account in the Meeting Management System.\n
            //         To proceed with resetting your password, please click on the following link: \n\n
            //         http://localhost:3000/auth/reset?email=${req.body.email}&temp=${tempPassword}`
            // };

            // console.log(mailOptions);

            // transporter.sendMail(mailOptions, function (error, info) {
            //   if (error) {
            //     console.log(error);
            //   } else {
            //     console.log('Email sent: ' + info.response);
            //   }
            // });
            // // -------------------------------
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

exports.passwordResetByAdmin = async (req, res, next) => {
  const password = generatePassword();
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = {
        email: req.body.email,
      };

      const update = {
        password: hashedPassword,
        role: 'pending'
      };

      User.findOneAndUpdate(user, update)
        .then((result) => {
          if (!result) {
            res.status(500).send({
              message: "user password reset failed",
            });
          } else {
            console.log(password);
            // // send mail to the user with generated password
            // var transporter = nodemailer.createTransport({
            //   service: process.env.EMAIL_PROVIDER,
            //   auth: {
            //     user: process.env.EMAIL_ADDRESS,
            //     pass: process.env.EMAIL_PASSWORD
            //   }
            // });

            // var mailOptions = {
            //   from: process.env.EMAIL_ADDRESS,
            //   to: req.body.email,
            //   subject: 'meeting scheduling new login',
            //   text: `login credentionals of your account \n${req.body.email} \n${password}`
            // };

            // console.log(mailOptions);

            // transporter.sendMail(mailOptions, function (error, info) {
            //   if (error) {
            //     console.log(error);
            //   } else {
            //     console.log('Email sent: ' + info.response);
            //   }
            // });
            // // -------------------------------
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