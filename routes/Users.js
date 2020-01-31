const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
require("../models/User");
const User = mongoose.model("Users");
const { ensureAuthentication } = require("../helpers/Auth");
require("../config/Passport")(passport);

router.get("/:id", ensureAuthentication, (req, res) => {
  User.findOne({
    _id: req.params.id
  }).then(user => {
    res.json(user);
    console.log("Sent Stylist");
  });
});

// Login User Form

router.post("/login", (req, res, next) => {
  req.session.cookie.expires = false;
  req.session.cookie.maxAge = 5 * 60000 * 10000000;
  try {
    passport.authenticate("local-user", {
      successRedirect: "/stylists",
      failureRedirect: "/users/"
    })(req, res, next);
  } catch (error) {
    res.send("Faielddnwjnw");
    console.log("Faielddnwjnw");
  }
});

// Fail User Form

router.get("/", (req, res) => {
  res.send("failed");
  console.log("Failed to authenticate");
});

// Register Post
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    // Server side password matching
    errors.push({ text: "Passwords must match" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be greater than 3 characters" });
  }
  if (!req.body.name) {
    errors.push({ text: "Must enter a name." });
  }

  if (errors.length > 0) {
    console.log("Fill in the required fields");
    res.send("failed1"); // Required fields error
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        res.send("failed2"); // EMail is taken error
        console.log("Email is taken");
      } else {
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        };

        bcrypt.genSalt(15, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;
            newUser.password = hash;
            new User(newUser)
              .save()
              .then(user => {
                console.log(`Registration for  ${newUser.email} is complete.`);
              })
              .catch(error => {
                console.log(error);
              });
          });
        });
        console.log(newUser);
        res.send("Register");
      }
    });
  }
});

// Update User email and name Form
router.put("/update/:id", ensureAuthentication, (req, res) => {
  console.log("Editing user");
  let errors = [];
  if (!req.body.name) {
    errors.push({ text: "Must enter a name." });
  }
  if (!req.body.email) {
    errors.push({ text: "Must enter an email." });
  }
  if (errors.length > 0) {
    console.log(errors);
    res.send("Must fill in all requirments");
  }
  User.findOne({
    _id: req.params.id
  }).then(user => {
    if (user) {
      user.email = req.body.email;
      user.name = req.body.name;
      // Update appoitment date
      user.save();
      res.json(user);
      console.log("Edited User Profile");
    } else {
      res.send("User not found");
      console.log("User not found");
    }
  });
});

// Delete Form

router.delete("/delete/:id", ensureAuthentication, (req, res) => {
  User.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.send("Deleted");
    console.log("Deleted User");
  });
});

// Post Profile Picture

module.exports = router;
