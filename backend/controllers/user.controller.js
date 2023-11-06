const User = require("../models/user.model");
const Installment = require("../models/installment.model");
const Customer = require("../models/customer.model");
const {
  validateMobileNumber,
  parseMobileNumber,
} = require("../utils/PhoneNumberValidation");
const moment = require("moment-timezone");

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
    .select("userID name email phone")
    .then((users) => {
      res.status(200).json({ collectors: users });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.getCollectorsByDate = async (req, res) => {
  const date = req.params.date;
  const dayStartTime = new Date(date + "T00:00:00+05:30");
  const dayEndTime = new Date(date + "T23:59:59+05:30");
  User.find({ email: { $ne: "semicolondevsteam@gmail.com" } })
    .select("id name email phone workingDays")
    .then(async (users) => {
      const collectorsWithToday = await Promise.all(
        users.map(async (user) => {
          const workingDays = user.workingDays || [];
          const trimmedWorkingDays = workingDays.map((day) =>
            moment(day).format("YYYY-MM-DD")
          );
          const isTodayWorkingDay = trimmedWorkingDays.includes(date);
          const installments = await Installment.find({
            collectedBy: user.id,
            paidDate: { $gte: dayStartTime, $lt: dayEndTime },
          });

          const totalCollected = installments.reduce((total, installment) => {
            return total + installment.amount;
          }, 0);

          return {
            userID: user.userID,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isTodayWorkingDay,
            totalCollected,
          };
        })
      );

      res.status(200).json({ collectors: collectorsWithToday });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.markWorkingDay = async (req, res) => {
  try {
    const isWorkingDay = req.body.isWorkingDay;
    const collectorId = req.params.id;

    if (isWorkingDay) {
      const user = await User.findById(collectorId);

      if (!user) {
        return {
          status: "Failed",
          message: "User not found",
        };
      }

      const workingDays = user.workingDays || [];
      const trimmedWorkingDays = workingDays.map((day) =>
        moment(day).format("YYYY-MM-DD")
      );

      const dayToSave = moment.tz("Asia/Colombo").format("YYYY-MM-DD");

      if (!trimmedWorkingDays.includes(dayToSave)) {
        workingDays.push(dayToSave);
      }

      const updatedWorkingDays = Array.from(new Set(workingDays));

      await User.findByIdAndUpdate(collectorId, {
        $set: { workingDays: updatedWorkingDays },
      });
    }
    return {
      status: "Success",
    };
  } catch (err) {
    return {
      status: "Failed",
      message: err.message,
    };
  }
};
