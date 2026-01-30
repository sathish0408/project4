const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* =======================
   MONGODB CONNECTION
======================= */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* =======================
   USER MODEL
======================= */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: "User Registered" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json("Wrong password");

    res.json("Login success");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* =======================
   START SERVER  ✅ REQUIRED
======================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
