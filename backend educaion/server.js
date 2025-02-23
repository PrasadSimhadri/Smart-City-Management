const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eduwebapp";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    });

// ✅ Institution Schema
const InstitutionSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    country: String,
    world_rank: Number,
    national_rank: Number,
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
});

const Institution = mongoose.model("Institution", InstitutionSchema);

// ✅ User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedUniversities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Institution" }],
    appliedUniversities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Institution" }],
});

const User = mongoose.model("User", UserSchema);

// ✅ Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id };
      next();
  } catch (err) {
      console.error('Token verification failed:', err.message);
      res.status(403).json({ message: 'Invalid token.' });
  }
};

// ✅ Signup Route
app.post("/api/auth/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already registered. Please log in." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// ✅ Login Route
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

// ✅ Profile Route — Get user's profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id)
          .populate('likedUniversities', 'institution world_rank rating')
          .populate('appliedUniversities', 'institution world_rank rating')
          .select('-password');

      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({
          username: user.username,
          email: user.email,
          likedUniversities: user.likedUniversities,
          appliedUniversities: user.appliedUniversities
      });
  } catch (err) {
      console.error('Profile fetch error:', err.message);
      res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});