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
    }).select("_id workingDays");

    const workingDaysu = usersWithDate.map((user) => user.workingDays);
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
      $expr: { $lt: ["$paidAmount", "$loanAmount"] },
    }).select(
      "customerID name NIC loanAmount arrears paidAmount phone billingCycle isSettled collectorId installmentAmount"
    );

    return customersToPay;
  } catch (err) {
    return {
      status: "Failed",
      message: err.message,
    };
  }
}

const getInstallmentsForDate = async (date) => {
  const dayStartTime = new Date(date + "T00:00:00+05:30");
  const dayEndTime = new Date(date + "T23:59:59+05:30");

  const customersToPay = await getCustomersToPay(date);

  const installments = await Installment.find({
    paidDate: { $gte: dayStartTime, $lt: dayEndTime },
  });

  const updatedList = [];
  for (const installment of installments) {
    const user = await User.findById(installment.collectedBy);
    installment.collectedBy = user.name;
    const customer = await Customer.findOne({
      customerID: installment.customerID,
    });
    installment._doc.customerName = customer.name;
    installment._doc.collectorID = customer.collectorId;
    installment._doc.billingCycle = customer.billingCycle;

    updatedList.push(installment._doc);
  }

  const nonPaidCustomers = customersToPay.filter((customer) => {
    return !updatedList.some(
      (installment) => installment.customerID === customer.customerID
    );
  });

  const updatedNonPaidCustomers = [];

  for (const customer of nonPaidCustomers) {
    const user = await User.findById(customer.collectorId);
    customer._doc.collectorName = user.name;
    updatedNonPaidCustomers.push(customer._doc);
  }
  return {
    installments: updatedList,
    nonPaidCustomers: updatedNonPaidCustomers,
  };
};

module.exports = {
  getCustomersToPay,
  getInstallmentsForDate,
};
