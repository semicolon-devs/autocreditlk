const mongoose = require("mongoose");

const InstallmentsSchema = new mongoose.Schema({
  customerID: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  paidDate: {
    type: String,
    required: true,
  },
  collectedBy: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.model.Installments ||
  mongoose.model("Installment", InstallmentsSchema);
