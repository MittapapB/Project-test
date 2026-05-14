// Environment variables activation
require("dotenv").config();

// Imports
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const { sessionConfig } = require("./server/config");

// Routes
const { adminRoutes } = require("./server/admin");
const { authRoutes } = require("./server/auth");

const PORT = process.env.PORT || 3000;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    return console.log(error);
  }
  console.log("Connected to Pokemon World database");
};

async function main() {
  try {
    await connectDB();
  } catch (error) {
    console.log("Failed to connect to database: " + error.message);
    return;
  }

  try {
    app.use(sessionConfig);
    app.set("view engine", "ejs");

    app.use(express.static("public"));
    app.use(express.urlencoded({ extended: true }));

    app.use("/admin", adminRoutes);
    app.use("/auth", authRoutes);

    app.get("/", (req, res) => {
      res.render("home.ejs", {
        placeholder: "Home",
        admin: req.session?.user?.role === "admin"
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
