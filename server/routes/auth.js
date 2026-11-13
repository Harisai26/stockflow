const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");
const protect = require("../middleware/auth");

const router = express.Router();

const makeToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, organizationName } = req.body;

    if (!email || !password || !organizationName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // create the org first, then the user linked to it
    const org = await Organization.create({ name: organizationName });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      organization: org._id,
    });

    res.status(201).json({
      token: makeToken(user._id),
      user: { id: user._id, email: user.email },
      organization: { id: org._id, name: org.name },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const org = await Organization.findById(user.organization);

    res.json({
      token: makeToken(user._id),
      user: { id: user._id, email: user.email },
      organization: { id: org._id, name: org.name },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// GET /api/auth/me - used to restore the session on page refresh
router.get("/me", protect, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organization);
    res.json({
      user: { id: req.user._id, email: req.user.email },
      organization: { id: org._id, name: org.name },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

module.exports = router;
