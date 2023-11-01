const User = require("../models/user.model");
const moment = require("moment-timezone");

async function markWorkingDay(collectorId, date) {
  try {
    const user = await User.findById(collectorId);

    if (!user) {
      return {
        status: "Failed",
        message: "User not found",
      };
    }

    const workingDays = user.workingDays || [];

    const day = moment(date ? new Date(date) : new Date())
      .tz("Asia/Colombo")
      .startOf("day")
      .format();

    // Check if the day is already in the workingDays array
    if (!workingDays.includes(day)) {
      workingDays.push(day);
    }

    await User.findByIdAndUpdate(collectorId, {
      workingDays: workingDays,
    });

    return {
      status: "Success",
    };
  } catch (err) {
    return {
      status: "Failed",
      message: err.message,
    };
  }
}

module.exports = {
  markWorkingDay,
};
