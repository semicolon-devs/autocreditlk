const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");

const { sendSMS } = require("../controllers/sms.controller")

router.post( "/sendSMS", sendSMS )


module.exports = router;