const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("./config/Database");
const passport = require("passport");
// Models middleware
const Jobs = require("./routes/Jobs");
const Stylists = require("./routes/Stylists");
const Users = require("./routes/Users");
const Ratings = require("./routes/Ratings");

// Map Global promise, to get rid of warning
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch(err => console.log(err));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Express middleware
app.use(
  session({
    secret: "Secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/jobs", Jobs);
app.use("/stylists", Stylists);
app.use("/users", Users);
app.use("/ratings", Ratings);

const port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
