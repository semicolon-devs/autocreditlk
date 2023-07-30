const { sendLoanOverdueSMS, sendResetOTP } = require("../services/sms.service")


// this route is made purely for testing purposes. Will be removed after the testing.
exports.sendSMS = async (req, res) => {
    const payload = {
        to : "94714387473",
        message : "HELLO"
    }
    // tos = ["94714387473", "94764052787"]
    const response = await sendResetOTP(payload.to, "0192912");
    // if 
    console.log(JSON.stringify(response))
    res.status(200).json({message : response});
}