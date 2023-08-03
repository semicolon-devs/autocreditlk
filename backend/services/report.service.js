const fs = require('fs');
const nodemailer = require('nodemailer');
const moment = require('moment')


// TODO: remove hardcoded values on stag
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS || "morning123lucifer@gmail.com";
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || "gmail";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "ypgdraaoruolsgek";
const COMPANY_NAME = "Auto Credit";
const FILE_EXTENSION = "xls";

function getMailOptions(payload) {
  const from = COMPANY_NAME + '<' + EMAIL_ADDRESS + '>';
  const to = payload.to;
  const subject = payload.date + ' -' + COMPANY_NAME + payload.reportType + 'Report';
  const text = 'File Attached for : ' + payload.date;
  const html = '';

  var mailOption = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachments: [{
      filename: payload.fileName,
      path: payload.filePath
    }]
  }
  return mailOption;
}

function getDate() {
  return moment().format("MMM Do YY");
}

function getMonth() {
  return moment().format("MMMM YYYY");
}

function getWeek() {
  return moment().startOf("week").format("MMMM YYYY") + " to " + moment().endOf("week").format("MMMM YYYY");
}

function generateDailyReport(records, filePath) {
  generateReport(records, filePath, "DAILY REPORT", getDate());
}

function generateMonthlyReport(records, filePath) {
  generateReport(records, filePath, "MONTHLY REPORT", getMonth());
}

function generateWeeklyReport(records, filePath) {
  generateReport(records, filePath, "WEEKLY REPORT", getWeek());
}

function generateReport(records, filePath, reportType, date) {
  let data = reportType + '\n' +
    'Auto Credit' + '\n' +
    date + '\n' + '\n';

  // extract the list of collectors
  let collectors = new Set();
  records.forEach((record) => {
    collectors.add(record.collector)
  })

  // TODO: if the report needs a list of every collector, fetch it from db.
  let total = {};
  for (const item of collectors) {
    total[item] = 0;
  }

  records.forEach((record) => {
    total[record.collector] += Number(record.amount);
    data += record.id + '\t' + record.name + '\t' + record.collector + '\t' + record.amount + '\n';
  });

  data += '\n' + '\n' + '\n';


  const collectorNames = Object.keys(total);
  for (const name of collectorNames) {
    data += "Collected Amount by " + name + '\t' + total[name] + '\n'
  }

  fs.writeFile(filePath, data, (err) => {
    if (err) {
      throw err
    };

    console.log('File created');
  });
}

function sendMail(payload) {
  let transporter = nodemailer.createTransport({
    service: EMAIL_PROVIDER,
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = getMailOptions(payload);


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

}



//fetch today entries from db

// var start = new Date();
// start.setHours(0,0,0,0);

// var end = new Date();
// end.setHours(23,59,59,999);

// var todayJSN = db.posts.find({created_on: {$gte: start, $lt: end}});

// fetch(url)
//   .then(function(res) {
//     // handle the response
//   })
//   .catch(function(err) {
//     // handle the error
//   });


function main() {
  const records = [{
    "name": "Nilesh",
    "id": "RDTC",
    "collector": "A",
    "amount": "1000"
  }, {
    "name": "Nilesh",
    "id": "RDTC",
    "collector": "B",
    "amount": "2000"
  }, {
    "name": "Nilesh",
    "id": "RDTC",
    "collector": "B",
    "amount": "3000"
  }];


  const reportType = "Weelkly";
  const fileName = getDate() + ' - Auto Credit ' + reportType + ' Report' + '.' + FILE_EXTENSION
  const filePath = "./reports/" + fileName;

  const payload = {
    to: "supuledirisinghe@gmail.com",
    fileName: fileName,
    filePath: filePath,
    reportType: reportType,
    date: getDate()
  };

  generateWeeklyReport(records, filePath);

  sendMail(payload)
}

main();