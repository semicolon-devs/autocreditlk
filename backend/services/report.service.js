const fs = require("fs");
const nodemailer = require("nodemailer");
const moment = require("moment");
const Installment = require("../models/installment.model");
const Customer = require("../models/customer.model");
const User = require("../models/user.model");
const { reportUpload } = require("../utils/firebaseUpload");
const Report = require("../models/report.model");
const schedule = require("node-schedule");
const getInstallmentsForDate = require("../services/insight.service");
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const COMPANY_NAME = "Auto Credit";
const FILE_EXTENSION = "xls";

function getMailOptions(payload) {
  const from = COMPANY_NAME + "<" + EMAIL_ADDRESS + ">";
  const to = payload.to;
  const subject =
    payload.date + " -" + COMPANY_NAME + payload.reportType + "Report";
  const text =
    "File Attached for : " +
    payload.date +
    "\n\n ---SemicolonDevs---\n---semicolondevs.com--- ";
  const html = "";

  var mailOption = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachments: [
      {
        filename: payload.fileName,
        path: payload.filePath,
      },
    ],
  };
  return mailOption;
}

function getDate() {
  return moment().format("YYYY-MM-DD");
}

function getMonth() {
  return moment().format("MMMM YYYY");
}

function getWeek() {
  return (
    moment().startOf("week").format("MMMM YYYY") +
    " to " +
    moment().endOf("week").format("MMMM YYYY")
  );
}

const generateDailyReport = async (records, filePath) => {
  await generateReport(records, filePath, "SYSTEM GENARATED REPORT", getDate());
};

const generateMonthlyReport = async (records, filePath) => {
  await generateReport(records, filePath, "MONTHLY REPORT", getMonth());
};

function generateWeeklyReport(records, filePath) {
  generateReport(records, filePath, "WEEKLY REPORT", getWeek());
}

const generateReport = async (records, filePath, reportType, date) => {
  let data = reportType + "\n" + "Auto Credit" + "\n" + date + "\n" + "\n";

  // extract the list of collectors
  let collectors = new Set();
  records.forEach((record) => {
    collectors.add(record.collector);
  });

  // TODO: if the report needs a list of every collector, fetch it from db.
  let total = {};
  for (const item of collectors) {
    total[item] = 0;
  }

  records.forEach((record) => {
    total[record.collector] += Number(record.amount);
    data +=
      record.customerID +
      "\t" +
      record.customerName +
      "\t" +
      record.amount +
      "\t" +
      record.collectedBy +
      "\t" +
      new Date(record.paidDate).toLocaleString("en-US", {
        timeZone: "Asia/colombo",
      }) +
      "\n";
  });

  data += "\n" + "\n" + "\n";

  const collectorNames = Object.keys(total);
  for (const name of collectorNames) {
    data += "Collected Amount by " + name + "\t" + total[name] + "\n";
  }

  try {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const sendMail = async (payload) => {
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
    }
  });
};

const addReportToDatabase = async (filePath, date) => {
  try {
    const file = fs.readFileSync(filePath);

    const downloadURL = await reportUpload(
      file,
      date.toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" })
    );

    await Report.create({
      downloadURL,
      date,
    })
      .then((result) => {
        console.log("report added to mongo");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

const reportGenerateAndSend = (reportTypeSent, dayCount) => {
  const records = [];

  const reportType = reportTypeSent;
  const fileName =
    getDate() +
    " - Auto Credit " +
    reportType +
    " Report " +
    "." +
    FILE_EXTENSION;
  const filePath = "./reports/" + fileName;

  // use following function to get installments and nonpaid customers for the day, and we can map them to the report

  //  const date = getDate;
  //    const { installments, nonPaidCustomers } = await getInstallmentsForDate(
  //       date
  //     );

  const dayStartTime = new Date(
    moment().utcOffset("+05:30").format("YYYY-MM-DD") + "T00:00:00+05:30"
  );
  dayStartTime.setUTCDate(dayStartTime.getUTCDate() - dayCount);
  console.log(dayStartTime);
  const dayEndTime = new Date(
    moment().utcOffset("+05:30").format("YYYY-MM-DD") + "T23:59:59+05:30"
  );
  dayEndTime.setUTCDate(dayEndTime.getUTCDate());
  console.log(dayEndTime);
  Installment.find({
    paidDate: { $gte: dayStartTime, $lt: dayEndTime },
  })
    .then(async (installments) => {
      for (const installment of installments) {
        await User.findById(installment.collectedBy)
          .then(async (user) => {
            installment.collectedBy = user.name;

            await Customer.findOne({ customerID: installment.customerID })
              .then((customer) => {
                installment._doc.customerName = customer.name;
                records.push(installment._doc);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      // TODO shedule generate and send report at 23:59:59 today
      setTimeout(await generateDailyReport(records, filePath), 15000);

      // upload generated file to firebase
      await addReportToDatabase(filePath, dayStartTime);

      const payload = {
        to: "autocreditlk@gmail.com",
        fileName: fileName,
        filePath: filePath,
        reportType: reportType,
        date: getDate(),
      };

      await sendMail(payload);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Triggering reportGenerateAndSend() everyday at 00:00:00
const rule = new schedule.RecurrenceRule();
rule.hour = 21;
rule.minute = 12;
rule.second = 0;
rule.tz = "Asia/colombo";

schedule.scheduleJob(rule, function () {
  reportGenerateAndSend("Daily", 1);
});

// Triggering reportGenerateAndSend() every week on sunday at 23:00:00
const rule2 = new schedule.RecurrenceRule();
rule2.dayOfWeek = 0; // 0 = Sunday
rule2.hour = 8;
rule2.minute = 0;
rule2.tz = "Asia/colombo";

schedule.scheduleJob(rule2, function () {
  reportGenerateAndSend("Weekly", 7);
});

// Triggering reportGenerateAndSend() every month on 30 at 00:23:00
const rule3 = new schedule.RecurrenceRule();
rule3.date = 1; // 1st day of the month
rule3.hour = 4; // 2 PM
rule3.minute = 0;
rule3.tz = "Asia/colombo";

schedule.scheduleJob(rule3, function () {
  reportGenerateAndSend("Monthly", 30);
});
