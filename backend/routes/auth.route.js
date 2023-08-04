const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
  login,
  passwordResetToDefault,
  addUser,
  passwordResetByAdmin,
  forgetPasswordReset,
  forgetPasswordRequest,
  getUserData,
  tempPasswordReset,
} = require("../controllers/auth.controller");

router.post(
  "/login",
  [
    passport.authenticate("local", { session: false }),
  ],
  login
);
router.post("/forget-password-request", forgetPasswordRequest);
router.post("/forget-password-reset", forgetPasswordReset);
router.post(
  "/add-user",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  addUser
);
router.get(
  "/userdata",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin", "collector"]),
  ],
  getUserData
);
router.post(
  "/temp-password-reset",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin", "collector", "pending"]),
  ],
  tempPasswordReset
);
router.post(
  "/password-reset-by-admin",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  passwordResetByAdmin
);

router.post(
  "/password-reset-to-default",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  passwordResetToDefault
);


module.exports = router;
