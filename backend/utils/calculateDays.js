const moment = require('moment-timezone');

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
      currentDate.add(7, "weeks");

    default:
      break;
  }

  
  return currentDate.tz("Asia/Colombo").startOf('day').format();
}

module.exports = {
  calculateNextBillingDate
}