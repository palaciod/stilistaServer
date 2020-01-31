const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../models/Stylist");
const Stylist = mongoose.model("Stylists");
require("../config/Passport")(passport);
// Login Form

router.post("/login", (req, res, next) => {
  req.session.cookie.expires = false;
  req.session.cookie.maxAge = 5 * 60000 * 10000000;
  passport.authenticate("local-stylist", {
    successRedirect: "/jobs",
    failureRedirect: "/stylists/fail",
    failureFlash: true
  })(req, res, next);
});

// Fail Form

router.get("/fail", (req, res) => {
  res.send("failed");
  console.log("Failed to authenticate");
});

// Register form

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
    console.log(errors);
    res.send("failed1"); // Required fields error
  } else {
    Stylist.findOne({ email: req.body.email }).then(user => {
      if (user) {
        res.send("Email is taken");
        console.log("Email is taken");
      } else {
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          location: {
            type: "Point",
            coordinates: [req.body.long, req.body.lat]
          },
          rating: 0
        };

        bcrypt.genSalt(15, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;
            newUser.password = hash;
            new Stylist(newUser)
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

// Default Search Stylist Form

router.post("/near", (req, res, next) => {
  let errors = [];
  if (!req.body.long) {
    errors.push({ text: "Must enter a longitude point." });
  }
  if (!req.body.lat) {
    errors.push({ text: "Must enter a latitude point." });
  }
  if (!req.body.distance) {
    errors.push({ text: "Must enter a distance." });
  }
  if (errors.length > 0) {
    console.log("Fill in the required fields");
    res.send("failed1"); // Required fields error
  } else {
    Stylist.find({
      location: {
        $near: {
          $maxDistance: req.body.distance,
          $geometry: {
            type: "Point",
            coordinates: [req.body.long, req.body.lat]
          }
        }
      }
    }).find((error, results) => {
      if (error) console.log(" i am failing here");
      console.log(results);
      res.json(results);
    });
  }
});

router.get("/", (req, res) => {
  res.send(req.session);
  console.log(req.session);
});

// Update Rating Value Form
router.put("/updateRating/:id", (req, res) => {
  if (!req.body.rating) {
    console.log("Failed to get rating");
    res.send("No Rating");
  } else {
    Stylist.findOne({
      _id: req.params.id
    }).then(stylist => {
      stylist.rating = req.body.rating;
      // Update appoitment date
      stylist.save();
      res.json(stylist);
      console.log("Edited Stylist Profile");
    });
  }
});

// Update Stylist Name and Email Form
router.put("/update/:id", (req, res) => {
  if (!req.body.name) {
    console.log("Failed to get name");
    res.send("No name");
  } else if (!req.body.email) {
    console.log("Failed to get email");
    res.send("No email");
  } else {
    Stylist.findOne({
      _id: req.params.id
    }).then(stylist => {
      stylist.name = req.body.name;
      stylist.email = req.body.email;
      // Update appoitment date
      stylist.save();
      res.json(stylist);
      console.log("Edited Stylist Profile");
    });
  }
});

// Delete Form

router.delete("/delete/:id", (req, res) => {
  Stylist.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.send("Deleted");
    console.log("Deleted Stylist");
  });
});

// Get Stylist Details

router.get("/:id", (req, res) => {
  Stylist.findOne({
    _id: req.params.id
  }).then(job => {
    res.json(job);
    console.log("Sent Stylist");
  });
});

module.exports = router;
