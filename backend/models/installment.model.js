const mongoose = require("mongoose");

const InstallmentsSchema = new mongoose.Schema(
  {
    customerID: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    collectedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model.Installments ||
  mongoose.model("Installment", InstallmentsSchema);
