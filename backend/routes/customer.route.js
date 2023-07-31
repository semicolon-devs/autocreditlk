const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
  addCustomer,
  getCustomers,
} = require("../controllers/customer.controller");
const { uploader } = require("../config/multer.config");

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
    uploader.fields([
      { name: "NICFrontCopy", maxCount: 1 },
      { name: "NICRearCopy", maxCount: 1 },
      { name: "customerPhoto", maxCount: 1 },
      { name: "guarantorNICFrontCopy", maxCount: 1 },
      { name: "guarantorNICRearCopy", maxCount: 1 },
    ]),
  ],
  addCustomer
);
router.get(
  "/all",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin", "collector"]),
  ],
  getCustomers
);

module.exports = router;
