const Customer = require("../models/customer.model");

exports.addCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      guarantor,
      guarantorMobile,
      loanId,
      loanAmount,
      noOfInstallments,
      startDate,
      billingCycle,
    } = req.body;

    Customer.create({
      name,
      email,
      phone,
      address,
      guarantor,
      guarantorMobile,
      loanId,
      loanAmount,
      noOfInstallments,
      startDate,
      billingCycle,
    })
      .then((res) => {
        const customers = Customer.find({});
        res.status(200).json({ customers: customers });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

exports.getCustomers = async (req, res) => {
  Customer.find({}).then((result) => {
    res
      .status(200)
      .json({ customers: result })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  });
};

