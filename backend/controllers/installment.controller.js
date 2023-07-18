const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");

exports.addPayment = async (req, res) => {
  const { customerID, amount, paidDate, collectedBy } = req.body;

  Installment.create({
    customerID,
    amount,
    paidDate,
    collectedBy,
  })
    .then((res) => {
      const filter = { customerID: customerID };
      const customers = Customer.find(filter)
        .then((customer) => {
          Customer.findOneAndUpdate(filter, {
            paidAmount: customer.paidAmount + amount,
          });
          res.status(200).json({ customers: customers });
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};
