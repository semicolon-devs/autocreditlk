const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
  login,
  passwordReset,
  passwordResetToDefault,
  getCollectors,
  deleteUser,
  addUser,
  getPendingUsers,
  passwordResetByAdmin,
  forgetPasswordReset,
  forgetPasswordRequest,
} = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/forget-password-request", forgetPasswordRequest);
router.post("/forget-password-reset", forgetPasswordReset);
router.post(
  "/register",
  // [passport.authenticate("jwt", { session: false }), isAdmin()],
  addUser
);
router.post(
  "/password-reset",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin", "collector", "pending"]),
  ],
  passwordReset
);
router.post(
  "/password-reset-by-admin",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  passwordResetByAdmin
);
router.get(
  "/collectors",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  getCollectors
);
router.get(
  "/pending-users",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  getPendingUsers
);
router.post(
  "/password-reset-to-default",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  passwordResetToDefault
);
router.delete(
  "/collectors/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkPermission(["admin"]),
  ],
  deleteUser
);

module.exports = router;
