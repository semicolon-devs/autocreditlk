const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
  addCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
  getPaymentOfCustomer
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
router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  getPaymentOfCustomer
);
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  deleteCustomer
)
router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  updateCustomer
)

module.exports = router;
