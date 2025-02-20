const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eduwebapp";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Institution Schema
const InstitutionSchema = new mongoose.Schema({
  name: String,
  location: String,
});

const Institution = mongoose.model("Institution", InstitutionSchema);

// API to Fetch Institutions
app.get("/institutions", async (req, res) => {
  try {
    const institutions = await Institution.find(); // Fetch data from MongoDB
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
