
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { User } = require("./config");

/**
 *  @function authenticate
 */
const authenticate = (req, res, next) => {
    if (!(req.session?.user)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = req.session.user;
    next();
};

/**
 * @function startSession 
 */
const startSession = (req, user, rememberMe) => {
    req.session.user = {
        id: user._id,
        username: user.username,
        role: user.role
    };
    req.session.cookie.maxAge = rememberMe
        ? 14 * 24 * 60 * 60 * 1000 // 14 days
        : null;
};

/**
 * @function login
 */
router.post("/login", async (req, res) => {
    const { username, password, rememberMe } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const passwordCorrect = await user.comparePassword(password);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        startSession(req, user, rememberMe);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error: " + err.message });
    }
    res.status(200).json({ message: "Login successful" });
});

/**
 * @function register
 */
router.post("/register", async (req, res) => {
    const { username, password, rememberMe } = req.body;
    try {
        const newUser = await User.create({ username, password });
        // Success
        startSession(req, newUser, rememberMe);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "Error registering user: " + err.message,
        });
    }
    res.status(201).json({ message: "Registration successful" });
});

/**
 * @function logout
 */
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error logging out: " + err.message });
        }
        res.status(200).json({ message: "Logout successful" });
    });
});

router.use(authenticate);
/**
 * @function me
 */
router.get("/me", (req, res) => {
    res.status(200).json({
        user: req.user || req.session.user
    });
});

module.exports = {
    authenticate,
    authRoutes: router
};
