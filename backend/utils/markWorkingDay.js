const User = require("../models/user.model");
const moment = require("moment-timezone");

async function markWorkingDay(collectorId) {
  try {
    const user = await User.findById(collectorId);

    if (!user) {
      return {
        status: "Failed",
        message: "User not found",
      };
    }

    const workingDays = user.workingDays || [];
    const day = moment.tz("Asia/Colombo").startOf("day").format();

    if (!workingDays.includes(day)) {
      workingDays.push(day);
    }

    const updatedWorkingDays = Array.from(new Set(workingDays));

    await User.findByIdAndUpdate(collectorId, {
      $set: { workingDays: updatedWorkingDays },
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
