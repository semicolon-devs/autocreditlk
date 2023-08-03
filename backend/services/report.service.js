const fs = require('fs');
const nodemailer = require('nodemailer');
const moment = require('moment')


// TODO: remove hardcoded values on stag
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS || "morning123lucifer@gmail.com";
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || "gmail"
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "ypgdraaoruolsgek"
const COMPANY_NAME = "Auto Credit";

function getMailOptions(payload) {
  const from = COMPANY_NAME + '<' + EMAIL_ADDRESS + '>';
  const to = payload.to;
  const subject = payload.date + ' -' + COMPANY_NAME + payload.reportType;
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

function generateDailyReport(records) {
  const data = 'DAILY REPORT' + '\n' +
    'Auto Credit' + '\n' +
    getDate() + '\n' + '\n';

  // extract the list of collectors
  let collectors = new Set();
  records.forEach((record) => {
    collectors.add(record.collector)

  })

  let total = {};
  for (const item of collectors) {
    total[item] = 0;
  }


  // console.log(total);

  let total_A = 0;
  let total_B = 0;
  let total_C = 0;

  for (var i = 0; i < records.length; i++) {

    if (records[i].collector == 'A') {
      total_A += Number(records[i].amount);
    } else if (records[i].collector == 'B') {
      total_B += Number(records[i].amount);
    } else {
      total_C += Number(records[i].amount);
    }

    data = data + records[i].id + '\t' + records[i].name + '\t' + records[i].collector + '\t' + records[i].amount + '\n';
  }

  data = data + '\n' + '\n' + '\n';
  data = data + "Collected Amount by A" + '\t' + total_A + '\n';
  data = data + "Collected Amount by B" + '\t' + total_B + '\n';
  data = data + "Collected Amount by C" + '\t' + total_C + '\n';


  fs.writeFile((getDate() + ' - Auto Credit Daily Report' + '.xlsx'), data, (err) => {
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

const fileName = getDate() + ' - Auto Credit Daily Report' + '.xlsx'
const payload = {
  to: "supuledirisinghe@gmail.com",
  fileName: fileName,
  filePath: fileName,
  reportType: "Daily Report",
  date: getDate()
};

generateDailyReport(records);

sendMail(payload)