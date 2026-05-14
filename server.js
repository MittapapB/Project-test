// Environment variables activation
require("dotenv").config();

// Imports
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const { sessionConfig, User } = require("./server/config");

// Routes
const { authenticate, authRoutes } = require("./server/auth");
const { adminRoutes } = require("./server/admin");

const PORT = process.env.PORT || 3000;

/**
 * @function connectDB
 * @description Connects to the MongoDB database.
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    return console.log(error);
  }
  console.log("Connected to Pokemon World database");
};

/**
 * @function main
 * 
 * @description The server entrypoint.
 */
async function main() {
  // DB setup
  try {
    await connectDB();
  } catch (error) {
    console.log("Failed to connect to database: " + error.message);
    return;
  }

  // Server setup
  try {
    app.use(sessionConfig);
    app.set("view engine", "ejs");

    app.use(express.static("public"));
    app.use(express.json());

    app.use("/auth", authRoutes);
    app.use("/admin", adminRoutes);

    app.get("/", authenticate, (req, res) => {
      res.render("home.ejs", {
        placeholder: "Home",
        username: req.session?.user?.username || "Guest",
        admin: req.session?.user?.role === "admin"
      });
    });

    app.get("/login", async (req, res) => {
      const usersAmount = await User.countDocuments({});
      res.render("login.ejs", {
        registeredUsers: usersAmount
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
