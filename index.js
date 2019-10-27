require("dotenv").config();
const express = require("express");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Directory (used only in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Database Connection
const mongoose = require("mongoose");
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/dbnamehere",
  mongooseOptions
);

const passport = require("passport");
app.use(passport.initialize());
require("./authentication/passport")(passport); // this one uses the JWT strategy

// Routing
const routes = require("./routes");
app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}\n\nhttp://localhost:${PORT}`);
});
