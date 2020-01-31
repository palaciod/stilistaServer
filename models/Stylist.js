const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const StylistSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  rating: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now()
  }
});
StylistSchema.index({ location: "2dsphere" });
mongoose.model("Stylists", StylistSchema);
