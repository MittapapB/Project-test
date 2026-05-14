
const session = require("express-session");
const mongoose = require("mongoose");
const { MongoStore } = require("connect-mongo");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

/**
 * @function pre-save
 */
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
});

/**
 * @function comparePassword
 */
userSchema.methods.comparePassword = async function (passwordAttempt) {
    return await bcrypt.compare(passwordAttempt, this.password);
};

module.exports = {
    sessionConfig: session({
        store: new MongoStore({
            mongoUrl: 'mongodb://127.0.0.1:27017/test',
            mongooseConnection: mongoose.connection,
            ttl: 14 * 24 * 60 * 60, // 14 days
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false }
    }),
    User: mongoose.model("User", userSchema)
};
