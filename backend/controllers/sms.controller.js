const { sendLoanOverdueSMS, sendResetOTP, sendDailySMS } = require("../services/sms.service")


// this route is made purely for testing purposes. Will be removed after the testing.
exports.sendSMS = async (req, res) => {
    const payload = {
        to : "94714387473",
        customerId : "A111",
        customerName : "Cust_1",
        collectorName : "Coll_1",
        amountPaid : "11100.00",
        amountLeft : "1021.00"
    }
    // tos = ["94714387473", "94764052787"]
    const response = await sendDailySMS(payload);
    // if 
    console.log(JSON.stringify(response))
    res.status(200).json({message : response});
}