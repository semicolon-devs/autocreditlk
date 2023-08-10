const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const User = require("../models/user.model");
const moment = require('moment-timezone');
const {
  calculateNextBillingDate
} = require("../utils/calculateDays");


async function startCollecting(collectorId, date) {
  const user = User.findById(collectorId);
  let workingDays = user.workingDays;

  if (!workingDays) workingDays = [];

  const day = moment((date ? new Date(date) : new Date())).tz("Asia/Colombo").startOf('day').format();
  workingDays.push(day);

  // removes duplicates by converting into a set
  const updatedWorkingDays = Array.from(new Set(workingDays));

  return User.findByIdAndUpdate(collectorId, {
      workingDays: updatedWorkingDays
    })
    .then((user) => {
      return {
        "status": "Success"
      };
    })
    .catch((err) => {
      return {
        "status": "Failed",
        "message": err.message
      };
    });

}



async function collectedBySomeoneElse(customerID, date) {
  const filter = {
    customerID: customerID
  };

  const update = {
    collectedDates: (date ? Date(date) : Date())
  };

  const customer = await Customer.findOne(filter);
  let collectedDates = customer.collectedDates;

  if (!collectedDates) collectedDates = [];

  const day = moment((date ? new Date(date) : new Date())).tz("Asia/Colombo").startOf('day').format();
  collectedDates.push(day);

  // removes duplicates by converting into a set
  const updatedCollectedDates = Array.from(new Set(collectedDates));

  return Customer.findOneAndUpdate(filter, {
      collectedDates: updatedCollectedDates
    })
    .then((customer) => {
      return {
        "status": "Success"
      };
    })
    .catch((err) => {
      return {
        "status": "Failed",
        "message": err.message
      };
    });
}

async function calculateArrears(customerID) {
  const today = moment(new Date());

  const filter = {
    customerID: customerID
  };

  try {
    const customer = await Customer.findOne(filter);

    const collectorId = customer.collectorId;
    const dueDate = moment(new Date(customer.nextBillingDate));
    const billingCycle = customer.billingCycle;

    if (today.isBefore(dueDate)) { // if before -> no arrears
      return 0;

    } else if (today.isSame(dueDate)) { // on date -> one installment
      return amountToPay(customer.loanAmount, customer.installmentAmount, customer.paidAmount, 0);
    }

    // when overdue 

    let {
      noOfCyclesBehind,
      noOfDaysBehind
    } = noOfDaysAndCycles(today, dueDate, billingCycle);

    const workingDays = await getWorkingDays(collectorId);

    // TODO: Calculate arrears when no one collected for the duration of the cycle : Especially in daily case
    return amountToPay(customer.loanAmount, customer.installmentAmount, customer.paidAmount, noOfCyclesBehind);



  } catch (err) {
    return {
      message: "Error",
      error: err.message
    }
  }
}

function noOfDaysAndCycles(today, dueDate, billingCycle) {
  const noOfDaysBehind = today.diff(dueDate, 'days');
  let noOfCyclesBehind = 0;

  switch (billingCycle) {
    case "Daily":
      noOfCyclesBehind = noOfDaysBehind;
      break;

    case "Weekly":
      noOfCyclesBehind = today.diff(dueDate, 'weeks');
      break;

    case "Monthly":
      noOfCyclesBehind = today.diff(dueDate, 'months');
      break;

    default:
      noOfCyclesBehind = 0;
      break;
  }

  return {
    noOfCyclesBehind,
    noOfDaysBehind
  };
}

function amountToPay(loanAmount, installmentAmount, paidAmount, noOfCyclesBehind) {
  noOfCyclesBehind++;

  const amountLeft = loanAmount - paidAmount;
  const arrears = installmentAmount * noOfCyclesBehind;

  let toPay = (amountLeft >= arrears ? arrears : amountLeft);

  return toPay;
}

async function getWorkingDays(collectorId) {
  return User.findById(collectorId)
    .then((user) => {
      return user.workingDays ? user.workingDays : null;
    })
    .catch((err) => {
      return null;

    })
}


module.exports = {
  calculateArrears,
  startCollecting,
  collectedBySomeoneElse
};