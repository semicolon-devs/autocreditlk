const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
  addCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
  getPaymentOfCustomer,
  changeLoanAmount,
  addExisitngCustomer,
  getGuarantorIDs,
  updateIsSettled,
  getSettledCustomers,
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
      { name: "customerAdditionalDocument", maxCount: 1 },
      { name: "guarantorAdditionalDocument", maxCount: 1 },
    ]),
  ],
  addCustomer
);
router.post(
  "/existing",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
    uploader.fields([
      { name: "NICFrontCopy", maxCount: 1 },
      { name: "NICRearCopy", maxCount: 1 },
      { name: "customerPhoto", maxCount: 1 },
      { name: "guarantorNICFrontCopy", maxCount: 1 },
      { name: "guarantorNICRearCopy", maxCount: 1 },
      { name: "customerAdditionalDocument", maxCount: 1 },
      { name: "guarantorAdditionalDocument", maxCount: 1 },
    ]),
  ],
  addExisitngCustomer
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
  "/settled",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin", "collector"]),
  ],
  getSettledCustomers
);

router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin", "collector"]),
  ],

  getPaymentOfCustomer
);
router.get(
  "/guarantors/ids",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  getGuarantorIDs
);
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  deleteCustomer
);

router.put(
  "/update-settled",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  updateIsSettled
);

router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  updateCustomer
);
router.put(
  "/update-amount/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  changeLoanAmount
);

module.exports = router;
