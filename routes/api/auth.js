const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const passport = require("passport");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    // Handle other errors
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
});

// @route   POST /api/user/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      if (!user) {
        return res.status(401).json({ error: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Login error" });
        }
        return res.json({
          success: true,
          user: user
        });
      });
    })(req, res, next);
  }
);

// @route   GET /api/user/check-auth
// @desc    Check if user is authenticated
// @access  Private
router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  }
  res.json({ isAuthenticated: false });
});

router.get("/logout", (req, res) => {
  req.flash("success_msg", "You have been logged out successfully");

  req.logout(function (err) {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/");
    }

    req.session.destroy(function (err) {
      if (err) {
        console.error("Session destruction error:", err);
      }
      res.redirect("/login");
    });
  });
});
module.exports = router;
