const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
  addPayment,
  getPaymentOfCustomer,
  deletePayment,
  updatePayment
} = require("../controllers/installment.controller");

router.post(
  "/add-payment",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin", "collector"]),
  ],
  addPayment
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
  deletePayment
);

router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  updatePayment
);

module.exports = router;
