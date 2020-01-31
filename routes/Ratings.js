const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
require("../models/Rating");
const Rating = mongoose.model("Ratings");
const { ensureAuthentication } = require("../helpers/Auth");

router.get("/:id", ensureAuthentication, (req, res) => {
  Rating.findOne({ client: req.params.id })
    .then(rating => {
      console.log(rating);
      res.json(rating);
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});
router.get("/reviewsFor/:id", ensureAuthentication, (req, res) => {
  Rating.find({ stylist: req.params.id })
    .then(rating => {
      console.log(rating);
      res.json(rating);
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});

router.put("/editRatings/:id", ensureAuthentication, (req, res) => {
  Rating.findOne({
    client: req.params.id
  }).then(rating => {
    rating.value = req.body.value;
    rating.review = req.body.review;
    // Update appoitment date
    rating.save();
    res.json(rating);
    console.log("Edited Stylist Profile");
  });
});

router.post("/postRatings/:id", ensureAuthentication, (req, res) => {
  let errors = [];
  if (!req.body.stylist) {
    errors.push({ text: "Must enter stylist id" });
  }
  if (!req.body.value) {
    errors.push({ text: "Must enter a value." });
  }
  if (errors.length > 0) {
    console.log("Fill in the required fields");
    console.log(errors);
    res.send("failed1"); // Required fields error
  } else {
    const newRating = {
      stylist: req.body.stylist,
      client: req.params.id,
      value: req.body.value,
      review: req.body.review,
      name: req.body.name
    };
    new Rating(newRating).save().then(rating => {
      res.send(rating);
      console.log("Completed Rating");
    });
  }
});

router.delete("/delete/:id", ensureAuthentication, (req, res) => {
  Rating.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.send("Deleted");
    console.log("Deleted Rating");
  });
});

module.exports = router;
