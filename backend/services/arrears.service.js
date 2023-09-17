const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const User = require("../models/user.model");
const moment = require("moment-timezone");

async function startCollecting(collectorId, date) {
  User.findById(collectorId)
    .then((user) => {
      let workingDays = user.workingDays;

      if (!workingDays) workingDays = [];

      const day = moment(date ? new Date(date) : new Date())
        .tz("Asia/Colombo")
        .startOf("day")
        .format();
      workingDays.push(day);

      // removes duplicates by converting into a set
      const updatedWorkingDays = Array.from(new Set(workingDays));

      return User.findByIdAndUpdate(collectorId, {
        $addToSet: { workingDays: updatedWorkingDays },
      })
        .then((user) => {
          return {
            status: "Success",
          };
        })
        .catch((err) => {
          return {
            status: "Failed",
            message: err.message,
          };
        });
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

async function collectedBySomeoneElse(customerID, date) {
  const filter = {
    customerID: customerID,
  };

  const update = {
    collectedDates: date ? Date(date) : Date(),
  };

  const customer = await Customer.findOne(filter);
  let collectedDates = customer.collectedDates;

  if (!collectedDates) collectedDates = [];

  const day = moment(date ? new Date(date) : new Date())
    .tz("Asia/Colombo")
    .startOf("day")
    .format();
  collectedDates.push(day);

  // removes duplicates by converting into a set
  const updatedCollectedDates = Array.from(new Set(collectedDates));

  return Customer.findOneAndUpdate(filter, {
    collectedDates: updatedCollectedDates,
  })
    .then((customer) => {
      return {
        status: "Success",
      };
    })
    .catch((err) => {
      return {
        status: "Failed",
        message: err.message,
      };
    });
}

async function calculateArrears(customerID) {
  const today = moment(new Date());

  try {
    const filter = {
      customerID: customerID,
    };
    var finalArries = 0;
    await Customer.findOne(filter)
      .then(async (customer) => {
        const noOfPayments = Math.floor(
          customer.paidAmount / customer.installmentAmount
        );
        // calculate last billing date
        var lastBillingDate = moment(new Date(customer.startDate));
        switch (customer.billingCycle) {
          case "Daily":
            lastBillingDate = lastBillingDate.add(noOfPayments, "d");
            break;
          case "Weekly":
            lastBillingDate = lastBillingDate.add(noOfPayments, "w");
            break;
          case "Monthly":
            lastBillingDate = lastBillingDate.add(noOfPayments, "M");
        }

        const days = await getWorkingDays(customer.collectorId);
        const arriesDays = getDateRange(days, lastBillingDate, today);

        const noOfArriesPayments = arriesDays.length;

        const arries =
          (noOfPayments + noOfArriesPayments) * customer.installmentAmount -
          customer.paidAmount;

        if (arries + customer.paidAmount >= customer.loadAmount) {
          finalArries = customer.loadAmount - customer.paidAmount;
        } else {
          finalArries = arries;
        }
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    return finalArries;
  } catch (err) {
    console.log(err);
    return {
      message: "Error",
      error: err.message,
    };
  }
}

function getDateRange(arr, begin, end) {
  let result = arr.filter(function (item) {
    return (
      moment(item).isSameOrAfter(moment(begin)) &&
      moment(item).isSameOrBefore(moment(end))
    );
  });

  return result;
}

function noOfDaysAndCycles(today, dueDate, billingCycle) {
  const noOfDaysBehind = today.diff(dueDate, "days");
  let noOfCyclesBehind = 0;

  switch (billingCycle) {
    case "Daily":
      noOfCyclesBehind = noOfDaysBehind;
      break;

    case "Weekly":
      noOfCyclesBehind = today.diff(dueDate, "weeks");
      break;

    case "Monthly":
      noOfCyclesBehind = today.diff(dueDate, "months");
      break;

    default:
      noOfCyclesBehind = 0;
      break;
  }

  return {
    noOfCyclesBehind,
    noOfDaysBehind,
  };
}

async function getWorkingDays(collectorId) {
  return User.findById(collectorId)
    .then((user) => {
      return user.workingDays ? user.workingDays : null;
    })
    .catch((err) => {
      return null;
    });
}

module.exports = {
  calculateArrears,
  startCollecting,
  collectedBySomeoneElse,
};
