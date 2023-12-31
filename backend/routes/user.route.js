const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkPermission } = require("../middleware/userAuth");
const {
    deleteUser,
    updateProfile,
    getPendingUsers,
    getCollectors
} = require("../controllers/user.controller");

router.delete(
    "/delete/:id",
    [
        passport.authenticate("jwt", {
            session: false
        }),
        checkPermission(["admin"]),
    ],
    deleteUser
);

router.post(
    "/update-profile/:id",
    [
        passport.authenticate("jwt", {
            session: false
        }),
        checkPermission(["admin", "collector"]),
    ],

    updateProfile
)

router.get(
    "/pending-users",
    [
        passport.authenticate("jwt", {
            session: false
        }),
        checkPermission(["admin"]),
    ],
    getPendingUsers
);

router.get(
    "/collectors",
    [
        passport.authenticate("jwt", {
            session: false
        }),
        checkPermission(["admin"]),
    ],
    getCollectors
);



module.exports = router;