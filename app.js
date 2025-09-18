const express = require("express");
const mongoose = require("mongoose");
const Farmer = require("./Schema/farmer");
const farmersData = require("./init/data");
const path = require("path");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/farmer";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");
    await initializeData(); // Preload data if collection is empty
  } catch (err) {
    console.log("❌ DB Connection Error:", err);
  }
}

// Initialize data (one-time)
async function initializeData() {
  const count = await Farmer.countDocuments();
  if (count === 0) {
    await Farmer.insertMany(farmersData);
    console.log("✅ Initial farmer data added to DB");
  } else {
    console.log("ℹ Farmer data already exists");
  }
}

main();

// Serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve dashboard page
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Login route
app.post("/login", async (req, res) => {
  const mobile = req.body.mobile?.trim();
  const password = req.body.password?.trim();
  console.log("Incoming login data:", req.body);

  try {
    const farmer = await Farmer.findOne({ mobile, password });
    if (farmer) {
      // ✅ Redirect directly to dashboard
      res.redirect("/dashboard");
    } else {
      res.send("<h2>Invalid credentials! <a href='/'>Go back</a></h2>");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error! Try again later.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

