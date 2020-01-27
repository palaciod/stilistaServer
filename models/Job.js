const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const JobSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  stylist: {
    type: String,
    required: true
  },
  appointment: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("Jobs", JobSchema);
