const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const User = require("../models/user.model");
const { sendDailySMS } = require("../services/sms.service");

exports.addPayment = async (req, res) => {
  const { customerID, amount, paidDate, collectedBy } = req.body;

  try {
    const user = await User.findById(collectedBy)
      .then(async (user) => {
        await Installment.create({
          customerID,
          amount,
          paidDate: new Date(paidDate),
          collectedBy,
        });

        const filter = { customerID: customerID };

        try {
          const customer = await Customer.findOne(filter);

          await Customer.findOneAndUpdate(filter, {
            paidAmount: customer.paidAmount + parseInt(amount),
          });

          const smsPayload = {
            to: customer.phone,
            customerId: customer.customerID,
            customerName: customer.name,
            collectorName: user.name,
            amountPaid: amount,
            amountLeft: customer.loanAmount - customer.paidAmount,
          };

          await sendDailySMS(smsPayload);
          res.status(200).json({ customers: customer });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: "collector id invalid",
        });
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPaymentInfo = async (req, res) => {
  const id = req.params.id;
  Installment.findById(id)
    .then((Installment) => {
      res.status(200).json({ payment: Installment });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
};

exports.deletePayment = async (req, res) => {
  const id = req.params.id;
  const timeNow = new Date();
  const dateString = timeNow.toLocaleDateString("es-CL", {
    timeZone: "Asia/Colombo",
  });
  const dayStartTime = new Date(dateString + "T00:00:00+05:30");
  const dayEndTime = new Date(dateString + "T23:59:59+05:30");

  const installment = await Installment.findOne(filter);

  if (
    installment.paidDate <= dayEndTime &&
    installment.paidDate >= dayStartTime
  ) {
    Installment.findByIdAndDelete(id)
      .then(async (result) => {
        const installment = await Installment.findById(id);
        filter = {
          customerID: result.customerID,
        };
        const update = {
          paidAmount: installment.paidAmount - result.paidAmount,
        };
        Customer.findOneAndUpdate(filter, update)
          .then((result) => {
            res.status(200).json({ message: "payment  deleted successfully" });
          })
          .catch((err) => {
            res.status(400).json({
              message: "payment deleted but not updated in customer details",
              error: err.message,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message:
        "update installment function only allowed for the date that installment is made",
    });
  }
};

exports.updatePayment = async (req, res) => {
  const id = req.params.id;
  const timeNow = new Date();
  const dateString = timeNow.toLocaleDateString("es-CL", {
    timeZone: "Asia/Colombo",
  });
  const dayStartTime = new Date(dateString + "T00:00:00+05:30");
  const dayEndTime = new Date(dateString + "T23:59:59+05:30");

  const filter = {
    _id: id,
  };

  const update = {
    amount: req.body.amount,
  };

  const installment = await Installment.findOne(filter);

  if (
    installment.paidDate <= dayEndTime &&
    installment.paidDate >= dayStartTime
  ) {
    Installment.findOneAndUpdate(filter, update)
      .then((result) => {
        Customer.findOne({ customerID: result.customerID })
          .then((customer) => {
            const filter = {
              _id: customer.id,
            };
            const update = {
              paidAmount:
                parseInt(customer.paidAmount) -
                parseInt(result.amount) +
                parseInt(req.body.amount),
            };

            if (update.paidAmount < 0) {
              update.paidAmount = 0;
            }

            Customer.findOneAndUpdate(filter, update)
              .then((result) => {
                res
                  .status(200)
                  .json({ message: "payment updated successfully" });
              })
              .catch((err) => {
                res.status(400).json({ message: err.message });
              });
          })
          .catch((err) => {
            res.status(200).json({ message: err.message });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message:
        "update installment function only allowed for the date that installment is made",
    });
  }
};
