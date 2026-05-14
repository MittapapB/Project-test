
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { authenticate } = require("./auth");
const { User } = require("./config");

/**
 *  @function authenticateAdmin
*/
const authenticateAdmin = (req, res, next) => {
    if (!(req.session?.user?.role === "admin")) {
        return res.status(401).json({ message: "Unauthorized. Requires admin privileges." });
    }
    req.user = req.session.user;
    next();
};

router.use(authenticate);
router.use(authenticateAdmin);

/**
 * @function users
 */
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching users: " + err.message });
    }
});

/**
 * @function updateUser
 */
router.post("/updateUser/:username", async (req, res) => {
    const { username } = req.params;
    const { username: newUsername, password: newPassword, role: newRole } = req.body;

    const newUserInfo = {};
    if (newUsername) newUserInfo.username = newUsername;
    if (newPassword) newUserInfo.password = newPassword;
    if (newRole) newUserInfo.role = newRole;

    try {
        const user = await User.findOneAndUpdate({ username }, { $set: newUserInfo }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating user: " + err.message });
    }
    res.status(200).json({ message: "User update successful" });
});

/**
 * @function deleteUser
 */
router.post("/deleteUser/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting user: " + err.message });
    }
    res.status(200).json({ message: "User deletion successful" });
});

module.exports = {
    authenticateAdmin,
    adminRoutes: router
};
