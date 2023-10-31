const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    customerID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    NIC: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    phoneTwo: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    guarantor: {
      type: String,
      required: true,
    },
    guarantorNIC: {
      type: String,
      required: true,
    },
    guarantorMobile: {
      type: String,
      required: true,
    },
    guarantorMobileTwo: {
      type: String,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    installmentAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    paidAmountDate: {
      type: Date,
    },
    startDate: {
      type: Date,
      required: true,
    },
    billingCycle: {
      type: String,
      required: true,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    collectorId: {
      // change string to correct datatype
      type: String,
      required: true,
    },
    NICFrontCopyLink: {
      type: String,
      required: true,
    },
    NICRearCopyLink: {
      type: String,
      required: true,
    },
    customerPhotoLink: {
      type: String,
      required: true,
    },
    guarantorNICFrontCopyLink: {
      type: String,
      required: true,
    },
    guarantorNICRearCopyLink: {
      type: String,
      required: true,
    },
    customerAdditionalDocumentLink:
    {
      type:String
    }
    ,guarantorAdditionalDocument:{
      type:String
    },
    collectedDates: [{
      type: Date
    }]
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model.Customers || mongoose.model("Customer", CustomerSchema);
