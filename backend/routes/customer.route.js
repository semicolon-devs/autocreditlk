const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const { addCustomer, getCustomers } = require("../controllers/customer.controller");

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  addCustomer
);
router.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  getCustomers
);
