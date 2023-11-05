const User = require("../models/user.model");
const Customer = require("../models/customer.model");
const moment = require("moment-timezone");

async function getWorkingUsers(date) {
  const selectedDate = moment(date ? new Date(date) : new Date())
    .tz("Asia/Colombo")
    .startOf("day")
    .format();
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
    const startOfDay = moment(date ? new Date(date) : new Date())
      .tz("Asia/Colombo")
      .startOf("day")
      .format();

    const workingUserIds = await getWorkingUsers(date);
    const customersToPay = await Customer.find({
      startDate: { $lte: startOfDay },
      collectorId: { $in: workingUserIds },
    }).select(
      "customerID name NIC loanAmount arrears paidAmount phone phoneTwo isSettled collectorId"
    );

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
