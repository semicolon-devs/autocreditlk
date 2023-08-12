const Report = require("../models/report.model");

exports.getReports = async (req, res) => {
  Report.find({})
    .sort({ createdAt: -1 })
    .limit(30)
    .then((reports) => {
      res.status(200).json({ reports: reports });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "error getting data" });
    });
};
