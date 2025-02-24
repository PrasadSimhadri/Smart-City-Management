const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// User Signup
router.post('/signup', async (req, res) => {
    console.log("Signup request received:", req.body); // Check incoming data

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        console.error("Missing fields:", { fullName, email, password });
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.warn("User already exists:", email);
            return res.status(400).json({ message: "User already registered. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });

        await newUser.save();
        console.log("User created:", newUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get User Profile
router.get("/profile", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Access denied" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).populate("likedUniversities appliedUniversities");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch profile", error: err.message });
    }
});

module.exports = router;
