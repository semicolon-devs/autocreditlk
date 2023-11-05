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
    const trimmedWorkingDays = workingDays.map((day) =>
      moment(day).format("YYYY-MM-DD")
    );

    const dayToSave = moment.tz("Asia/Colombo").format("YYYY-MM-DD");

    if (!trimmedWorkingDays.includes(dayToSave)) {
      workingDays.push(dayToSave);
    }

    const updatedWorkingDays = Array.from(new Set(workingDays));

    // await User.findByIdAndUpdate(collectorId, {
    //   $unset: { workingDays: 1 },
    // });

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
