const moment = require('moment');

function calculateNextBillingDate(date, billingCycle) {
  let currentDate = moment(new Date(date));

  switch (billingCycle) {
    case "Daily":
      currentDate.add(1, "days");
      break;

    case "Monthly":
      currentDate.add(1, "months");
      break;
    
    case "Weekly" : 
      currentDate.add(7, "days");

    default:
      break;
  }

  return currentDate.format();
}

module.exports = {
  calculateNextBillingDate
}