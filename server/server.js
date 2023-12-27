require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const userauthRoute = require("./routes/userAuth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const bodyparser = require("body-parser");
const app = express();

// parsing request payloads
app.use(bodyparser.json());
app.use(
  cookieSession({
    name: "session_oauth",
    keys: [process.env.SESSION],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/userAuth", userauthRoute);

// Error Handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      error: true,
      mssg: err.message,
    });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
