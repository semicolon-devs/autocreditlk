const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");

const { getReports } = require("../controllers/report.controller");

router.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  getReports
);

module.exports = router;
