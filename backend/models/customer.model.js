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
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    guarantor: {
      type: String,
      required: true,
    },
    guarantorMobile: {
      type: String,
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    noOfInstallments: {
      type: Number,
      required: true,
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
      type: String,
      required: true,
    },
    applicationDocumentLink: {
      type: String,
      required: true,
    },
    document1Link: {
      type: String,
      required: true,
    },
    document2Link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model.Customers || mongoose.model("Customer", CustomerSchema);
