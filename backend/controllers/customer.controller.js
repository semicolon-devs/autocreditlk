const Customer = require("../models/customer.model");
const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { storage } = require("../config/firebase.config");
const Installment = require("../models/installment.model");

const uploadFileToFirebaseStorage = async (fileType, customerID, file) => {
  const fileRef = ref(storage, `documents/${customerID}/${fileType + "-" + file.originalname}`);

  const metadata = {
    contentType: file.mimetype,
  };

  try {
    const snapshot = await uploadBytesResumable(fileRef, file.buffer, metadata);
    console.log("Uploaded a blob or file!");
    const url = await getDownloadURL(fileRef);
    return url;

  } catch (err) {
    console.log(err);
    return null;
  }
};

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
      uploadFileToFirebaseStorage("guarantorNICFrontCopy", customerID, guarantorNICFrontCopy),
      uploadFileToFirebaseStorage("guarantorNICRearCopy", customerID, guarantorNICRearCopy),
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
      startDate: new Date(
        startDate + "T00:00:00+05:30"
      ),
      billingCycle,
      collectorId,
      nextBillingDate: new Date(
        startDate + "T00:00:00+05:30"
      ),
      NICFrontCopyLink,
      NICRearCopyLink,
      customerPhotoLink,
      guarantorNICFrontCopyLink,
      guarantorNICRearCopyLink
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
    const customer = await Customer.findOne({ customerID: customerID })
    
    res.status(200).json({ payments: installments, customer : customer })
  }catch (err) {

    console.log(err);
    res.status(400).json({ message: err.message });
  }

};

exports.deleteCustomer = async (req, res) => {
  const customerID = req.params.id;

  Customer.findByIdAndDelete(customerID)
    .then((customer) => {
      Installment.deleteMany({customerID: customerID})
      .then((result) => {
        res.status(200).json({message: "customer deleted with all installment details"});
      })
      .catch((err) => {
        res.status(200).json({message: "installment details remove failed"});
      })
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "customer delete failed" });
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
  }

  Customer.findByIdAndUpdate(customerID, newCustomerDetails, {new: true})
    .then((customer) => {
      res.status(200).json({message: "customer details updated"})
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "customer delete failed" });
    });
};