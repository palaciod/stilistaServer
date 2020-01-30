const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const RatingSchema = new Schema({
  stylist: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("Ratings", RatingSchema);
