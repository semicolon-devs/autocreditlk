const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const User = require("../models/user.model");
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
        Installment.create({
          customerID: result.customerID,
          amount: result.paidAmount,
          paidDate: new Date(result.paidAmountDate),
          collectedBy: collectorId,
        })
          .then((installment) => {
            res.status(200).json({ result: result });
          })
          .catch((err) => {
            res.status(400).json({
              message: "customer add but adding installment failed",
              err: err.message,
            });
          });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (e) {
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
  const updatedInstallments = [];

  try {
    Installment.find({ customerID: customerID }).sort({paidDate: -1})
      .then(async (installments) => {

        for (const installment of installments) {
          await User.findById(installment.collectedBy)
            .then((user) => {
              installment.collectedBy = user.name;
              updatedInstallments.push(installment);
            })
            .catch((err) => {
              console.log(err);
            });
        }

        // limit data send to client based on user role
        if (req.user.role == "admin") {
          const customer = await Customer.findOne({
            customerID: customerID,
          });

          res
            .status(200)
            .json({ payments: updatedInstallments, customer: customer });
        } else if (req.user.role == "collector") {
          const customer = await Customer.findOne({
            customerID: customerID,
          }).select(
            "customerID name NIC loanAmount arrears paidAmount phone phoneTwo"
          );

          res
            .status(200)
            .json({ payments: updatedInstallments, customer: customer });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getGuarantorIDs = async (req, res) => {
  Customer.find({})
    .select("guarantorNIC")
    .distinct("guarantorNIC")
    .then((idList) => {
      res.status(200).json({ idList: idList });
    })
    .catch((err) => {
      res.status(200).json({ message: err.message });
    });
};

exports.deleteCustomer = async (req, res) => {
  const customerID = req.params.id;

  const filter = { customerID: customerID };

  Customer.findOneAndDelete(filter)
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

exports.changeLoanAmount = async (req, res) => {
  const customerID = req.params.id;
  const { newAmount } = req.body;

  const filter = { customerID: customerID };
  const updateCustomer = {
    loanAmount: newAmount,
  };

  Customer.findOneAndUpdate(filter, updateCustomer, { new: true })
    .then(res.status(200).json({ message: "loan amount change successfull" }))
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
      // console.log(customer);
      res.status(200).json({ message: "customer details updated" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "customer delete failed" });
    });
};
