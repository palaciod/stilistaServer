if (process.env.NODE_ENV === "production") {
  module.exports = { mongoURI: "LOL NOT POSTING THIS ON GITHUB" };
} else {
  module.exports = { mongoURI: "mongodb://localhost/stilista-dev" };
}
