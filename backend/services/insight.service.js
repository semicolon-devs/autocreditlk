const User = require("../models/user.model");
const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
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
      "customerID name NIC loanAmount arrears paidAmount phone phoneTwo isSettled collectorId installmentAmount"
    );

    return customersToPay;
  } catch (err) {
    return {
      status: "Failed",
      message: err.message,
    };
  }
}

async function getInstallmentsForDate(date) {
  const dayStartTime = new Date(date + "T00:00:00+05:30");
  const dayEndTime = new Date(date + "T23:59:59+05:30");

  try {
    const installments = await Installment.find({
      paidDate: { $gte: dayStartTime, $lt: dayEndTime },
    });

    const customersToPay = await getCustomersToPay(date);

    const paidCustomers = [];
    const nonPaidCustomers = customersToPay.slice();

    for (const installment of installments) {
      if (
        customersToPay.some(
          (customer) => customer.customerID === installment.customerID
        )
      ) {
        paidCustomers.push(installment);
        const index = nonPaidCustomers.findIndex(
          (customer) => customer.customerID === installment.customerID
        );
        if (index !== -1) {
          nonPaidCustomers.splice(index, 1);
        }
      }
    }

    return { installments: paidCustomers, nonPaidCustomers };
  } catch (err) {
    return {
      status: "Failed",
      message: err.message,
    };
  }
}

module.exports = {
  getCustomersToPay,
  getInstallmentsForDate,
};
