const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load stylist Model

require("../models/Stylist");
require("../models/User");
const Stylist = mongoose.model("Stylists");
const User = mongoose.model("Users");

function SessionConstructor(userId, userGroup) {
  this.userId = userId;
  this.userGroup = userGroup;
}

module.exports = function(passport) {
  // Stylist Authentication

  passport.use(
    "local-stylist",
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match stylist
      console.log("Logging in a stylist user.");
      Stylist.findOne({
        email: email
      })
        .then(stylist => {
          if (!stylist) {
            console.log(`<-------User not found------>`);
            return done(null, false);
          }
          console.log(`<-------User  found------>`);
          // Match password
          bcrypt.compare(password, stylist.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              console.log(`<-------Passed------>`);
              return done(null, stylist);
            } else {
              console.log("<-------Failed------>");
              return done(null, false);
            }
          });
        })
        .catch(error => {
          return done(null, false);
        });
    })
  );
  // User Authentication
  passport.use(
    "local-user",
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      console.log("Logging in a client user.");
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          console.log(`<-------User not found------>`);
          return done(null, false);
        }
        console.log(`<-------User  found------>`);

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            console.log(`<-------Passed------>`);
            return done(null, user);
          } else {
            console.log("<-------Failed------>");
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser(function(userObject, done) {
    // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
    let userGroup = "stylist";
    let userPrototype = Object.getPrototypeOf(userObject);
    if (userPrototype === Stylist.prototype) {
      userGroup = "stylist";
      console.log("stylist");
    } else if (userPrototype === User.prototype) {
      userGroup = "user";
      console.log("user");
    }
    let sessionConstructor = new SessionConstructor(userObject.id, userGroup);
    done(null, sessionConstructor);
  });

  passport.deserializeUser(function(sessionConstructor, done) {
    console.log(`This is my thing: ${sessionConstructor.userGroup}`);
    if (sessionConstructor.userGroup == "stylist") {
      Stylist.findOne(
        {
          _id: sessionConstructor.userId
        },

        function(err, user) {
          // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
        }
      );
    } else if (sessionConstructor.userGroup == "user") {
      User.findOne(
        {
          _id: sessionConstructor.userId
        },

        function(err, user) {
          // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
        }
      );
    }
  });
};
