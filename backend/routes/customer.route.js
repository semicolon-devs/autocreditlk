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
      { name: "application", maxCount: 1 },
      { name: "document1", maxCount: 1 },
      { name: "document2", maxCount: 1 },
    ]),
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

module.exports = router;