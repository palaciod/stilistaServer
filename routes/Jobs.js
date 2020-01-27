const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("../models/Job");
const Job = mongoose.model("Jobs");
// Get Cookie Session
router.get("/", (req, res) => {
  res.send(req.session);
  console.log(req.session);
});

// Get ALl Jobs
router.get("/:id", (req, res) => {
  Job.find({ stylist: req.params.id })
    .sort({ date: -1 }) // 1 is acsending
    .then(jobs => {
      var jobsJson = jobs;
      res.json(jobsJson);
      console.log(jobs);
    });
});

// Update Job Form
router.put("/update/:id", (req, res) => {
  Job.findOne({
    _id: req.params.id
  }).then(job => {
    job.message = req.body.message;
    // Update appoitment date
    job.save();
    res.json(job);
    console.log("Edited Job Posting");
  });
});

// Delete Form

router.delete("/delete/:id", (req, res) => {
  Job.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.send("Deleted");
    console.log("Deleted Post");
  });
});

// Post Job Form

router.post("/postJob/:id", (req, res) => {
  let errors = [];
  if (!req.body.stylist) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.appointment) {
    errors.push({ text: "Please add a appointment" });
  }

  if (errors.length > 0) {
    console.log(`Fill in the following fields ${errors}`);
  } else {
    const newJob = {
      name: req.body.name,
      stylist: req.body.stylist,
      user: req.params.id,
      message: req.body.message,
      appointment: req.body.appointment,
      status: false
    };
    new Job(newJob).save().then(job => {
      res.send(job);
      console.log("Completed Job");
    });
  }
});

module.exports = router;
