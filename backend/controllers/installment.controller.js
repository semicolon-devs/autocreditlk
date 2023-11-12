const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const User = require("../models/user.model");
const {
  startCollecting,
  collectedBySomeoneElse,
} = require("../services/arrears.service");
const { sendDailySMS } = require("../services/sms.service");
const { amountToPay } = require("../utils/amountToPay");
const { calculateNextBillingDate } = require("../utils/calculateDays");
const {
  getCustomersToPay,
  getInstallmentsForDate,
  filterByCollectorId,
} = require("../services/insight.service");

exports.addPayment = async (req, res) => {
  const { customerID, amount, paidDate, collectedBy, paidAmountDate } =
    req.body;
  try {
    startCollecting(collectedBy);

    await User.findById(collectedBy)
      .then(async (user) => {
        try {
          const filter = { customerID: customerID };

          const customer = await Customer.findOne(filter);
          if (customer.collectorID != collectedBy) {
            collectedBySomeoneElse(customerID, new Date());
          }
          const nextPayment = calculateNextBillingDate(
            customer.nextBillingDate,
            customer.billingCycle
          );
          // console.log(nextPayment)

          // if(customer.paidAmount + parseInt(amount) <= customer.loanAmount) {

          // }

          const update = {
            paidAmount: customer.paidAmount + parseInt(amount),
            paidAmountDate: paidAmountDate
              ? new Date(paidAmountDate)
              : new Date(),
            nextBillingDate: nextPayment,
            isSettled: paidAmount <= customer.loanAmount,
          };

          const updatedCustomer = await Customer.findOneAndUpdate(
            filter,
            update,
            { new: true }
          );

          await Installment.create({
            customerID,
            amount,
            paidDate: new Date(paidDate),
            collectedBy,
            dueDate: new Date(customer.nextBillingDate),
          });

          const smsPayload = {
            to: customer.phone,
            customerId: customer.customerID,
            customerName: customer.name,
            collectorName: user.name,
            arrears: customer.arrears,
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
  try {
    const date = req.params.date;
    const { installments, nonPaidCustomers } = await getInstallmentsForDate(
      date
    );

    res.status(200).json({ installments, nonPaidCustomers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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
            "Update installment function only allowed for the date that installment is made",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "installment with givan id not found" });
    });
};
