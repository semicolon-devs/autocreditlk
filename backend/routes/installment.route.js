const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
  addPayment,
  deletePayment,
  updatePayment,
  filterByDate
} = require("../controllers/installment.controller");

router.post(
  "/add-payment",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin", "collector"]),
  ],
  addPayment
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

router.get(
  "/:date",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  filterByDate
);

module.exports = router;
