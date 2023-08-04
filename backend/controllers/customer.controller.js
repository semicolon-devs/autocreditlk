const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const { uploadFileToFirebaseStorage } = require("../utils/firebaseUpload");

exports.addCustomer = async (req, res) => {
  try {
    const {
      customerID,
      name,
      NIC,
      email,
      phone,
      phoneTwo,
      address,
      loanAmount,
      installmentAmount,
      noOfInstallments,
      startDate,
      billingCycle,
      collectorId,
      description,
      guarantor,
      guarantorMobile,
      guarantorMobileTwo,
      guarantorNIC,
    } = req.body;

    const NICFrontCopy = req.files["NICFrontCopy"][0];
    const NICRearCopy = req.files["NICRearCopy"][0];
    const customerPhoto = req.files["customerPhoto"][0];
    const guarantorNICFrontCopy = req.files["guarantorNICFrontCopy"][0];
    const guarantorNICRearCopy = req.files["guarantorNICRearCopy"][0];

    const [
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink,
    ] = await Promise.all([
      uploadFileToFirebaseStorage("NICFrontCopy", customerID, NICFrontCopy),
      uploadFileToFirebaseStorage("NICRearCopy", customerID, NICRearCopy),
      uploadFileToFirebaseStorage("customerPhoto", customerID, customerPhoto),
      uploadFileToFirebaseStorage(
        "guarantorNICFrontCopy",
        customerID,
        guarantorNICFrontCopy
      ),
      uploadFileToFirebaseStorage(
        "guarantorNICRearCopy",
        customerID,
        guarantorNICRearCopy
      ),
    ]);

    Customer.create({
      customerID,
      name,
      NIC,
      email,
      phone,
      phoneTwo,
      address,
      description,
      guarantor,
      guarantorNIC,
      guarantorMobile,
      guarantorMobileTwo,
      loanAmount,
      installmentAmount,
      paidAmount: 0,
      noOfInstallments,
      startDate: new Date(startDate + "T00:00:00+05:30"),
      billingCycle,
      collectorId,
      nextBillingDate: new Date(startDate + "T00:00:00+05:30"),
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink,
    })
      .then((result) => {
        // const customers = Customer.findMany({});
        res.status(200).json({ result: result });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (e) {
    console.log("running");
    res.status(400).json({ message: e.message });
  }
};

exports.addExisitngCustomer = async (req, res) => {
  try {
    const {
      customerID,
      name,
      NIC,
      email,
      phone,
      phoneTwo,
      address,
      loanAmount,
      installmentAmount,
      paidAmount,
      paidAmountDate,
      noOfInstallments,
      startDate,
      billingCycle,
      collectorId,
      description,
      guarantor,
      guarantorMobile,
      guarantorMobileTwo,
      guarantorNIC,
    } = req.body;

    const NICFrontCopy = req.files["NICFrontCopy"][0];
    const NICRearCopy = req.files["NICRearCopy"][0];
    const customerPhoto = req.files["customerPhoto"][0];
    const guarantorNICFrontCopy = req.files["guarantorNICFrontCopy"][0];
    const guarantorNICRearCopy = req.files["guarantorNICRearCopy"][0];

    const [
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink,
    ] = await Promise.all([
      uploadFileToFirebaseStorage("NICFrontCopy", customerID, NICFrontCopy),
      uploadFileToFirebaseStorage("NICRearCopy", customerID, NICRearCopy),
      uploadFileToFirebaseStorage("customerPhoto", customerID, customerPhoto),
      uploadFileToFirebaseStorage(
        "guarantorNICFrontCopy",
        customerID,
        guarantorNICFrontCopy
      ),
      uploadFileToFirebaseStorage(
        "guarantorNICRearCopy",
        customerID,
        guarantorNICRearCopy
      ),
    ]);

    Customer.create({
      customerID,
      name,
      NIC,
      email,
      phone,
      phoneTwo,
      address,
      description,
      guarantor,
      guarantorNIC,
      guarantorMobile,
      guarantorMobileTwo,
      loanAmount,
      installmentAmount,
      paidAmount,
      paidAmountDate,
      noOfInstallments,
      startDate: new Date(startDate + "T00:00:00+05:30"),
      billingCycle,
      collectorId,
      nextBillingDate: new Date(startDate + "T00:00:00+05:30"),
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink,
    })
      .then((result) => {
        // const customers = Customer.findMany({});
        res.status(200).json({ result: result });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (e) {
    console.log("running");
    res.status(400).json({ message: e.message });
  }
};

exports.getCustomers = async (req, res) => {
  Customer.find()
    .select("customerID name NIC loanAmount arrears paidAmount phone phoneTwo")
    .then((customers) => {
      res.status(200).json({ customers: customers });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
};

exports.getPaymentOfCustomer = async (req, res) => {
  const customerID = req.params.id;

  try {
    const installments = await Installment.find({ customerID: customerID });

    if (req.user.role == "admin") {
      const customer = await Customer.findOne({ customerID: customerID });
      res.status(200).json({ payments: installments, customer: customer });
    } else if (req.user.role == "collector") {
      const customer = await Customer.findOne({
        customerID: customerID,
      }).select(
        "customerID name NIC loanAmount arrears paidAmount phone phoneTwo"
      );
      res.status(200).json({ payments: installments, customer: customer });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getGuarantorIDs = async (req, res) => {
  Customer.find({}).select('guarantorNIC').distinct('guarantorNIC')
  .then((idList) => {
    res.status(200).json({idList: idList});
  })
  .catch((err) => {
    res.status(200).json({message: err.message});
  })
}

exports.deleteCustomer = async (req, res) => {
  const customerID = req.params.id;

  Customer.findByIdAndDelete(customerID)
    .then((customer) => {
      Installment.deleteMany({ customerID: customerID })
        .then((result) => {
          res
            .status(200)
            .json({ message: "customer deleted with all installment details" });
        })
        .catch((err) => {
          res
            .status(200)
            .json({ message: "installment details remove failed" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "customer delete failed" });
    });
};

exports.topUpLoan = async (req, res) => {
  const customerID = req.params.id;
  const { topUpAmount, installmentsAdded, newInstallment } = req.body;

  const customer = await Customer.findOne({ customerID: customerID });

  const filter = { customerID: customerID };
  const updateCustomer = {
    loanAmount: customer.loanAmount + topUpAmount,
    installmentAmount: newInstallment,
    noOfInstallments: customer.noOfInstallments + installmentsAdded,
  };

  Customer.findOneAndUpdate(filter, updateCustomer, { new: true })
    .then(res.status(200).json({ message: "loan topup successfull" }))
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.updateCustomer = async (req, res) => {
  const customerID = req.params.id;
  const {
    name,
    NIC,
    email,
    phone,
    phoneTwo,
    address,
    description,
    guarantor,
    guarantorMobile,
    guarantorMobileTwo,
    guarantorNIC,
  } = req.body;

  const filter = { customerID: customerID };
  const newCustomerDetails = {
    name,
    NIC,
    email,
    phone,
    phoneTwo,
    address,
    description,
    guarantor,
    guarantorMobile,
    guarantorMobileTwo,
    guarantorNIC,
  };

  Customer.findOneAndUpdate(filter, newCustomerDetails, { new: true })
    .then((customer) => {
      res.status(200).json({ message: "customer details updated" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "customer delete failed" });
    });
};
