const router = require("express").Router();
const nodeMailer_config = require("../config");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");

const { sender } = nodeMailer_config;

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// signin
router.post("/signin", async (req, res) => {
  let pass = await bcrypt.hash(req.body.password, 8);
  res.send(pass);
});

//signup
router.post("/signup", (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

//forgot pass
router.post("/forgotPassword", async (req, res, next) => {
  try {
    if (req.body.email) {
      //email validation
      if (!emailRegex.test(req.body.email)) {
        res.status(400).json({ error: true, message: "Email Input Not valid" });
      }

      let existUser = await User.findOne({ userEmail: req.body.email });

      // find exist user
      if (!existUser) {
        res.status(400).json({ error: true, message: "User not Found" });
      } else {
        // send OTP

        let random_otp = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        const composemail = {
          from: "mani8754209@gmail.com",
          to: `${existUser["userEmail"]}`,
          subject: "ForgotPassword OTP",
          html: `<pre>
          Hi,<b>Abu</b>
        
          Your OTP is ${random_otp} to Change Password.
        
          Thanks By,
          Mani.R
          </pre>`,
        };
        sender.sendMail(composemail, function (erroremail, info) {
          if (erroremail) {
            next(new Error(erroremail));
          } else {
            res.status(200).json({ error: false, message: random_otp });
          }
        });
      }
    } else {
      res.status(400).json({ error: true, message: "Invalid Input Valid" });
    }
  } catch (er) {
    next(new Error(er));
  }

  //composing email
});

//changepassword
router.post("/changepassword", async (req, res, next) => {
  try {
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*()-_+=])[0-9a-zA-Z!@#$%^&*()-_+=]{8,}$/;
    if (req.body.password) {
      //email validation
      if (req.body.password >= 4 && req.body.password <= 8) {
        res.status(400).json({
          error: true,
          message: "Minimun 4 char and Max 8 char",
        });
      } else if (!passwordRegex.test(req.body.password)) {
        res.status(400).json({
          error: true,
          message: "Must have numeric and special character",
        });
      } else {
        let pass = await bcrypt.hash(req.body.password, 8);
        let result = await User.updateOne(
          { userEmail: req.body.email },
          { $set: { passWord: pass } }
        );
        if (result.modifiedCount) {
          res
            .status(200)
            .json({ error: true, message: "Changed Successfully" });
        }
      }
    } else {
      res.status(400).json({ error: true, message: "Required Password" });
    }
  } catch (er) {
    next(new Error(er));
  }
});

module.exports = router;
