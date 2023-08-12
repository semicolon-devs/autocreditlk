const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    downloadURL: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    // Add timestamps to the schema createdAt & updatedAt
    timestamps: true,
  }
);

module.exports =
  mongoose.model.Reports || mongoose.model("Report", ReportSchema);
