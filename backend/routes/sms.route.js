const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");

const {
  sendSMS,
  smsGatewayStatus,
  sendCustomSMS,
} = require("../controllers/sms.controller");

router.post("/sendSMS", sendSMS);
router.get(
  "/status",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  smsGatewayStatus
);

module.exports = router;

router.post(
  "/send-custom",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  sendCustomSMS
);
