const User = require("../models/user.model");
const Customer = require("../models/customer.model");

async function getWorkingUsers(date) {
  const selectedDate = new Date(date + "T00:00:00+05:30");
  try {
    const usersWithDate = await User.find({
      workingDays: { $in: [new Date(selectedDate)] },
    }).select("_id");

    const userIds = usersWithDate.map((user) => user._id);
    return userIds;
  } catch (err) {
    return {
      status: "Failed",
      message: err.message,
    };
  }
}

async function getCustomersToPay(date) {
  try {
    const startOfDay = new Date(date + "T00:00:00+05:30");

    const workingUserIds = await getWorkingUsers(date);
    const customersToPay = await Customer.find({
      startDate: { $lte: startOfDay },
      collectorId: { $in: workingUserIds },
    });

    return customersToPay;
  } catch (err) {
    return {
      status: "Failed",
      message: err.message,
    };
  }
}

module.exports = {
  getCustomersToPay,
};
