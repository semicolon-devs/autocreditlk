const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
  deleteUser,
  updateProfile,
  getPendingUsers,
  getCollectors,
  markWorkingDay,
  getCollectorsByDate,
} = require("../controllers/user.controller");

router.delete(
  "/delete/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    checkPermission(["admin"]),
  ],
  deleteUser
);

router.post(
  "/update-profile/:id",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    checkPermission(["admin", "collector"]),
  ],

  updateProfile
);

router.post("/mark-working/:id", [
  passport.authenticate("jwt", {
    session: false,
  }),
  checkPermission(["admin", "collector"]),
  markWorkingDay,
]);

router.get(
  "/pending-users",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    checkPermission(["admin"]),
  ],
  getPendingUsers
);

router.get(
  "/collectors",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    checkPermission(["admin"]),
  ],
  getCollectors
);

router.get(
  "/collectors/:date",
  [
    passport.authenticate("jwt", {
      session: false,
    }),
    checkPermission(["admin"]),
  ],
  getCollectorsByDate
);

module.exports = router;
