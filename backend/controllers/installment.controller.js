const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const { sendDailySMS } = require("../services/sms.service");

exports.addPayment = async (req, res) => {
  const { customerID, amount, paidDate, collectedBy } = req.body;
  // might need collector_id verification, before adding to the database...

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

          const smsPayload = {
            to : customer.phone,
            customerId: customer.customerID,
            customerName : customer.name,
            collectorName : collectedBy,
            amountPaid : amount,
            amountLeft : customer.loanAmount - customer.paidAmount
          };

          sendDailySMS(smsPayload)

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

exports.getPaymentOfCustomer = async (req, res) => {
  const customerID = req.params.id;
  Installment.fine({ customerID: customerID })
    .then((installments) => {
      res.status(200).json({ payments: installments });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
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
};

exports.updatePayment = async (req, res) => {
  const id = req.params.id;

  const filter = {
    id: id,
  };

  const update = {
    amount: req.body.amount,
  };

  Installment.findOneAndUpdate(filter, update)
    .then((result) => {
      Customer.findById(result.customerID)
        .then((customer) => {
          const filter = {
            id: customer.id,
          };
          const update = {
            paidAmount: result.paidAmount - req.body.amount,
          };
          Customer.findOneAndUpdate(filter, update)
            .then((result) => {
              res
                .status(200)
                .json({ message: "payment  updated successfully" });
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
};
