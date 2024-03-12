const Customer = require("../models/customer.model");
const Installment = require("../models/installment.model");
const User = require("../models/user.model");
const { calculateArrears } = require("../services/arrears.service");
const { reportGenerateAndSend } = require("../services/report.service");
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
      job,
      guarantorJob,
    } = req.body;
    const NICFrontCopy = req.files["NICFrontCopy"][0];
    const NICRearCopy = req.files["NICRearCopy"][0];
    const customerPhoto = req.files["customerPhoto"][0];
    const guarantorNICFrontCopy = req.files["guarantorNICFrontCopy"][0];
    const guarantorNICRearCopy = req.files["guarantorNICRearCopy"][0];
    const customerAdditionalDocument = req.files["customerAdditionalDocument"]
      ? req.files["customerAdditionalDocument"][0]
      : null;

    const guarantorAdditionalDocument = req.files["guarantorAdditionalDocument"]
      ? req.files["guarantorAdditionalDocument"][0]
      : null;

    const [
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink,
      customerAdditionalDocumentLink,
      guarantorAdditionalDocumentLink,
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
      customerAdditionalDocument
        ? uploadFileToFirebaseStorage(
            "customerAdditionalDocument",
            customerID,
            customerAdditionalDocument
          )
        : null,
      guarantorAdditionalDocument
        ? uploadFileToFirebaseStorage(
            "guarantorAdditionalDocument",
            customerID,
            guarantorAdditionalDocument
          )
        : null,
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
      isSettled: false,
      noOfInstallments,
      status: "pending",
      startDate: new Date(startDate + "T00:00:00+05:30"),
      billingCycle,
      collectorId,
      nextBillingDate: new Date(startDate + "T00:00:00+05:30"),
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      customerAdditionalDocumentLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink,
      guarantorAdditionalDocumentLink,
      job,
      guarantorJob,
    })
      .then((result) => {
        res.status(200).json({ result: result });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (e) {
    console.log(e);
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
      job,
      guarantorJob,
    } = req.body;

    const NICFrontCopy = req.files["NICFrontCopy"][0];
    const NICRearCopy = req.files["NICRearCopy"][0];
    const customerPhoto = req.files["customerPhoto"][0];
    const guarantorNICFrontCopy = req.files["guarantorNICFrontCopy"][0];
    const guarantorNICRearCopy = req.files["guarantorNICRearCopy"][0];
    const customerAdditionalDocument = req.files["customerAdditionalDocument"]
      ? req.files["customerAdditionalDocument"][0]
      : null;

    const guarantorAdditionalDocument = req.files["guarantorAdditionalDocument"]
      ? req.files["guarantorAdditionalDocument"][0]
      : null;

    const [
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink,
      customerAdditionalDocumentLink,
      guarantorAdditionalDocumentLink,
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
      customerAdditionalDocument
        ? uploadFileToFirebaseStorage(
            "customerAdditionalDocument",
            customerID,
            customerAdditionalDocument
          )
        : null,
      guarantorAdditionalDocument
        ? uploadFileToFirebaseStorage(
            "guarantorAdditionalDocument",
            customerID,
            guarantorAdditionalDocument
          )
        : null,
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
      status: "pending",
      isSettled: false,
      paidAmountDate,
      startDate: new Date(startDate + "T00:00:00+05:30"),
      billingCycle,
      collectorId,
      nextBillingDate: new Date(startDate + "T00:00:00+05:30"),
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      customerAdditionalDocumentLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink,
      guarantorAdditionalDocumentLink,
      job,
      guarantorJob,
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
  const userId = req.user.id;
  const isAdmin = req.user.role === "admin";
  let query = { $expr: { $lt: ["$paidAmount", "$loanAmount"] } };
  if (!isAdmin) {
    query = {
      $and: [query, { collectorId: userId }],
    };
  }

  Customer.find(query)
    .sort({ customerID: -1 })
    .select(
      "customerID name NIC loanAmount arrears paidAmount phone phoneTwo isSettled collectorId billingCycle installmentAmount"
    )
    .then((customers) => {
      res.status(200).json({ customers });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
};

exports.getPaymentOfCustomer = async (req, res) => {
  // reportGenerateAndSend();
  const customerID = req.params.id;
  const updatedInstallments = [];

  try {
    Installment.find({ customerID: customerID })
      .sort({ paidDate: -1 })
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
        //

        if (req.user.role == "admin") {
          await Customer.findOne({
            customerID: customerID,
          })
            .then(async (customer) => {
              await calculateArrears(customer.customerID)
                .then((arrears) => {
                  customer._doc.arrears = arrears;
                  res.status(200).json({
                    payments: updatedInstallments,
                    customer: customer,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(400).json({ message: err.message });
                });
            })
            .catch((err) => {
              res.status(400).json({ message: err.message });
            });
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
    job,
    guarantorJob,
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
    job,
    guarantorJob,
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

exports.updateIsSettled = async (req, res) => {
  try {
    const allCustomers = await Customer.find();

    const updatePromises = allCustomers.map(async (customer) => {
      const isSettled = customer.loanAmount <= customer.paidAmount;

      customer.set("isSettled", isSettled);
      const saveResult = await customer.save();
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: "New field 'isSettled' added and updated for all customers",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getSettledCustomers = async (req, res) => {
  try {
    const settledCustomers = await Customer.find({
      $expr: { $lte: ["$loanAmount", "$paidAmount"] },
    })
      .sort({ customerID: -1 })
      .select(
        "customerID name NIC loanAmount paidAmount phone phoneTwo isSettled"
      );

    res.status(200).json({ customers: settledCustomers });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getTotalUnpaid = async (req, res) => {
  try {
    const totalLoanAmount = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalLoanAmount: { $sum: "$loanAmount" },
        },
      },
    ]);

    const totalPaidAmount = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalPaidAmount: { $sum: "$paidAmount" },
        },
      },
    ]);

    const unpaidAmount =
      totalLoanAmount[0].totalLoanAmount - totalPaidAmount[0].totalPaidAmount;

    res.status(200).json({ totalUnpaid: unpaidAmount });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getArrearsOfCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const arrears = await calculateArrears(customerId);
    res.status(200).json({ arrears });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error calculating arrears." });
  }
};
