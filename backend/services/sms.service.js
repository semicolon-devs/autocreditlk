const axios = require("axios");
// const { response } = require("express");
require("dotenv").config();
const { parseMobileNumber, validateMobileNumber } = require("../utils/PhoneNumberValidation");


const SMS_SENDER_HOST = process.env.SMS_SENDER_ENDPOINT;
const SMS_SENDER_UID = process.env.SMS_SENDER_USER_ID;
const SMS_SENDER_API_KEY = process.env.SMS_SENDER_API_KEY;
const SMS_SENDER_SID = process.env.SMS_SENDER_SID;

async function sendOneSMS(to, message) {
  
  to = parseMobileNumber(to);
  
  if(!validateMobileNumber(to)) {
    return {
      message: "failed",
      staus: "invalid mobile number"
    }
  }
  
  const params = {
    user_id: SMS_SENDER_UID,
    api_key: SMS_SENDER_API_KEY,
    sender_id: SMS_SENDER_SID,
    to: to,
    message: message
  };


  const res = await
  axios.get(SMS_SENDER_HOST, {
      params: params
    })
    .then((res) => {
      // if successful
      // send record to database ? if needed
      // console.log(res)
      return res.data
    })
    .catch((error) => {
      er = {}
      if (error.response) {
        er.message = error.response.data.errors;
        er.status = error.response.status;

      } else if (error.request) {
        // The request was made but no response was received
        er.status = "444";

      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        er.message = error.message
        er.status = "503" // service unavailable
      }

      return er;
    })

  return res;

}

async function sendDailySMS(payload) {
  const {
    to,
    customerId,
    customerName,
    collectorName,
    amountPaid,
    amountLeft
  } = payload;

  message =
    `Daliy Payment Recieved : 
Name : ${customerName}
ID : ${customerId}
Collector : ${collectorName}
Payment : ${amountPaid} LKR
Remaining : ${amountLeft} LKR

@Autocredit
`
  return await sendOneSMS(to, message);
}

async function sendUserAddedSMS(to, customerId, customerName, totalAmount, issueDate) {
  message =
    `New Loan Issued : 
Name : ${customerName}
ID : ${customerId}
Toal Amount : ${totalAmount} LKR
Issue Date : ${issueDate}

@Autocredit
`

  return await sendOneSMS(to, message);
}

async function sendLoanSettledSMS(to, message) {
  return await sendOneSMS(to, message);
}

// guarantors = [to]
async function sendLoanOverdueSMS(guarantors, message) {
  let responses = []
  for (let guarantor of guarantors) {
    let resp = await sendOneSMS(guarantor, message)
    responses.push(resp)
  }

  // implement error checking if needed
  return {
    message: "success",
    staus: "200"
  }
}

async function sendResetOTP(to, OTP) {
  message =
    `Your Password reset token is : ${OTP} 
Use this to reset your password.
If you received this message by mistake, please ignore this message.

@Autocredit
`

  return await sendOneSMS(to, message);
}

async function sendFirstTimeOTP(to, OTP) {
  message =
    `Your Temporary Password is : ${OTP} 
Use it to log into the autocredit portal for the first time.
If you received this message by mistake, please ignore this message.

@Autocredit
`

  return await sendOneSMS(to, message);
}

module.exports = {
  sendDailySMS,
  sendUserAddedSMS,
  sendLoanSettledSMS,
  sendLoanOverdueSMS,
  sendFirstTimeOTP,
  sendResetOTP
}