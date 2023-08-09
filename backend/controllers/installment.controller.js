const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const User = require("../models/user.model");
const { sendDailySMS } = require("../services/sms.service");
const { calculateNextBillingDate } = require("../utils/calculateDays");

exports.addPayment = async (req, res) => {
  const { customerID, amount, paidDate, collectedBy, paidAmountDate } = req.body;
  // TODO: check amount agains arrears amount... for accurate calculation
  try {
    const user = await User.findById(collectedBy)
      .then(async (user) => {

        try {
          const filter = { customerID: customerID };
          
          const customer = await Customer.findOne(filter);
          // TODO: once arrears calculation is done, modify this to update the nextBilling date to correct date...
          const nextPayment  = calculateNextBillingDate(customer.nextBillingDate, customer.billingCycle);
          console.log(nextPayment)

          const update = {
            paidAmount: customer.paidAmount + parseInt(amount),
            paidAmountDate : (paidAmountDate ? new Date(paidAmountDate) : new Date()),
            nextBillingDate : nextPayment
          };

          const updatedCustomer = await Customer.findOneAndUpdate(filter, update, { new: true });

          await Installment.create({
            customerID,
            amount,
            paidDate: new Date(paidDate),
            collectedBy,
            dueDate: new Date(customer.nextBillingDate)
          });

          const smsPayload = {
            to: customer.phone,
            customerId: customer.customerID,
            customerName: customer.name,
            collectorName: user.name,
            amountPaid: amount,
            amountLeft: updatedCustomer.loanAmount - updatedCustomer.paidAmount,
          };

          await sendDailySMS(smsPayload);
          res.status(200).json({ customers: customer });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: err.message,
          // error : err
        });
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPaymentInfo = async (req, res) => {
  const id = req.params.id;
  Installment.findById(id)
    .then(async (installment) => {
      res.status(200).json({ payment: installment });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
};

exports.filterByDate = async (req, res) => {
  const date = req.params.date;

  const dayStartTime = new Date(date + "T00:00:00+05:30");
  const dayEndTime = new Date(date + "T23:59:59+05:30");
  Installment.find({
    paidDate: { $gte: dayStartTime, $lt: dayEndTime },
  })
    .then(async (installments) => {
      const updatedList = [];
      for (const installment of installments) {
        await User.findById(installment.collectedBy)
          .then(async (user) => {
            installment.collectedBy = user.name;

            await Customer.findOne({ customerID: installment.customerID })
              .then((customer) => {
                installment._doc.customerName = customer.name;
                updatedList.push(installment._doc);
              })
              .catch((err) => {
                res.status(400).json({ message: err.message });
              });
          })
          .catch((err) => {
            res.status(400).json({ message: err.message });
          });
      }
      res.status(200).json({ installments: updatedList });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.deletePayment = async (req, res) => {
  const id = req.params.id;

  await Installment.findOne({ _id: id })
    .then((installment) => {
      const allowedLastTime = new Date(installment.paidDate);
      allowedLastTime.setUTCDate(allowedLastTime.getUTCDate() + 1);

      if (new Date() < allowedLastTime) {
        Installment.findByIdAndDelete(id)
          .then(async (result) => {
            const customer = await Customer.findOne({
              customerID: result.customerID,
            });
            filter = {
              customerID: result.customerID,
            };
            const update = {
              paidAmount: customer.paidAmount - result.amount,
            };
            Customer.findOneAndUpdate(filter, update)
              .then((result) => {
                res
                  .status(200)
                  .json({ message: "payment  deleted successfully" });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json({
                  message:
                    "payment deleted but not updated in customer details",
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
            "delete installment function only allowed for 24 Hours since payment made",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "installment with givan id not found" });
    });
};

exports.updatePayment = async (req, res) => {
  const id = req.params.id;

  const update = {
    amount: req.body.amount,
  };

  await Installment.findOne({ _id: id })
    .then((installment) => {
      const allowedLastTime = new Date(installment.paidDate);
      allowedLastTime.setUTCDate(allowedLastTime.getUTCDate() + 1);

      if (new Date() < allowedLastTime) {
        Installment.findOneAndUpdate({ _id: id }, update)
          .then((result) => {
            Customer.findOne({ customerID: result.customerID })
              .then((customer) => {
                const filter = {
                  _id: customer._id,
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
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "installment with givan id not found" });
    });
};
