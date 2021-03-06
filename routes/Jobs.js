const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("../models/Job");
const Job = mongoose.model("Jobs");
const { ensureAuthentication } = require("../helpers/Auth");
// Get Cookie Session
router.get("/", (req, res) => {
  res.send(req.session);
  console.log(req.session);
});

// Get ALl Jobs
router.get("/:id", ensureAuthentication, (req, res) => {
  Job.find({ stylist: req.params.id })
    .sort({ date: -1 }) // 1 is acsending
    .then(jobs => {
      var jobsJson = jobs;
      res.json(jobsJson);
      console.log(jobs);
    });
});

// Edit Job Status
router.put("/update/:id", ensureAuthentication, (req, res) => {
  if (!req.body.status) {
    res.send("Failed status update.");
  } else {
    Job.findOne({
      _id: req.params.id
    }).then(job => {
      if (!job) {
        res.send("Did not find job posting.");
        console.log("Did not find the job posting.");
      } else {
        job.status = req.body.status;
        // Update appoitment date
        job.save();
        res.json(job);
        console.log("Edited Job Posting");
      }
    });
  }
});

// Update Job Form
router.put("/update/:id", ensureAuthentication, (req, res) => {
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

router.delete("/delete/:id", ensureAuthentication, (req, res) => {
  Job.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.send("Deleted");
    console.log("Deleted Post");
  });
});

// Post Job Form

router.post("/postJob/:id", ensureAuthentication, (req, res) => {
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
