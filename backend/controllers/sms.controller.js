const axios = require("axios");
const {
  sendLoanOverdueSMS,
  sendResetOTP,
  sendDailySMS,
  getSMSGatewayStatus,
} = require("../services/sms.service");

// this route is made purely for testing purposes. Will be removed after the testing.
exports.sendSMS = async (req, res) => {
  const payload = {
    to: "94714387473",
    customerId: "A111",
    customerName: "Cust_1",
    collectorName: "Coll_1",
    amountPaid: "11100.00",
    amountLeft: "1021.00",
  };
  // tos = ["94714387473", "94764052787"]
  const response = await sendDailySMS(payload);
  // if
  console.log(JSON.stringify(response));
  res.status(200).json({ message: response });
};

exports.smsGatewayStatus = async (req, res) => {
//   await axios
//     .post(
//       `https://app.notify.lk/api/v1/status?user_id=${process.env.SMS_SENDER_USER_ID}&api_key=${process.env.SMS_SENDER_API_KEY}`
//     )
//     .then((result) => {
//       res.status(200).json(JSON.stringify(result));
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ message: err.message });
//     });
    getSMSGatewayStatus().then((result) => {
        res.status(200).json({status: result});
    })
    .catch((err) => {
        res.status(500).json({message: err.message});
    })
};
