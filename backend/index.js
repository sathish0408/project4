const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());

/* =======================
   MONGODB CONNECTION
======================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* =======================
   USER MODEL
======================= */
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

/* =======================
   ROUTES
======================= */

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json("Email and password are required");
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json("Server error");
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("User not found");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json("Wrong password");
    }

    res.status(200).json("Login success");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json("Server error");
  }
});

/* =======================
   START SERVER (RENDER SAFE)
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
