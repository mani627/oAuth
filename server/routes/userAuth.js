const router = require("express").Router();
const nodeMailer_config = require("../config");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const createHMAC = require("../utility");
const { sender } = nodeMailer_config;

let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

// signin
router.post("/signin", async (req, res, next) => {
  try {
    if (req.body.email || req.body.password) {
      //  email validation
      if (!emailRegex.test(req.body.email)) {
        res.status(400).json({ error: true, message: "Email Input Not valid" });
      }
      //pass validation
      else if (
        !(req.body.password.length >= 4 && req.body.password.length <= 8)
      ) {
        res.status(400).json({
          error: true,
          message: "Pass must Mini 4 char and Max 8 char",
        });
      } else if (!passwordRegex.test(req.body.password)) {
        res.status(400).json({
          error: true,
          message: "Must have numeric and alpha character",
        });
      } else {
        let existUser = await User.findOne({ userEmail: req.body.email });

        if (!existUser) {
          res.status(400).json({ error: true, message: "User not Exist" });
        } else {
        
          let result = await User.updateOne(
            { userEmail: req.body.email },
            {
              $set: {
                image: "",
              },
            }
          );

          bcrypt.compare(
            req.body.password,
            existUser.passWord,
            (er, result) => {
              if (er) {
                if (er.message === "Illegal arguments: string, undefined") {
                  // login with email which already logged by outh
                  res.status(500).json({
                    error: true,
                    message: "Register with provided email",
                  });
                }
              } else {
                if (!result) {
                  res
                    .status(400)
                    .json({ error: true, message: "Password Mismatch" });
                } else {
                  let expireDate =
                    new Date().getTime() + Number(process.env.JWT_EXPIRES_IN);

                  let email = existUser.userEmail;
                  const token = jwt.sign(
                    { id: email },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: process.env.JWT_EXPIRES_IN,
                    }
                  );
                  res.cookie("customCookie", "example_value", {
                    maxAge: 3600000,
                  });
                  res.status(200).json({
                    error: false,
                    message: "Successfully LoggedIn",
                    token: token,
                    details: [existUser.userEmail, existUser.userName,existUser.role],
                    expireDate: expireDate,
                  });
                }
              }
            }
          );
        }
      }
    } else {
      res.status(400).json({ error: true, message: "Required User's Details" });
    }
  } catch (er) {
    next(new Error(er));
  }
});

//signup
router.post("/signup", async (req, res, next) => {
  try {
    if (req.body.email || req.body.password || req.body.username) {
      //  email validation
      if (!emailRegex.test(req.body.email)) {
        res.status(400).json({ error: true, message: "Email Input Not valid" });
      }
      // pass validation
      else if (
        !(req.body.password.length >= 4 && req.body.password.length <= 8)
      ) {
        res.status(400).json({
          error: true,
          message: "Minimun 4 char and Max 8 char",
        });
      } else if (!passwordRegex.test(req.body.password)) {
        res.status(400).json({
          error: true,
          message: "Must have numeric and alpha character",
        });
      } else if (
        !(req.body.username.length >= 5 && req.body.username.length <= 15)
      ) {
        res.status(400).json({
          error: true,
          message: "Must username have min 5 and max 15",
        });
      } else {
        let existUser = await User.findOne({ userEmail: req.body.email });

        // find exist user
        if (existUser && existUser.passWord) {
          res.status(400).json({ error: true, message: "Email Already Exist" });
        } else {
          // send OTP

          let random_otp = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
          const composemail = {
            from: "mani8754209@gmail.com",
            to: `${req.body.email}`,
            subject: "Register OTP",
            html: `<pre>
   Hi,
 
   Your OTP is ${random_otp} to Signup.
 
   Thanks By,
   Mani.R
   </pre>`,
          };
          sender.sendMail(composemail, async function (erroremail, info) {
            if (erroremail) {
              next(new Error(erroremail));
            } else {
              // hash password and register
              let pass = await bcrypt.hash(req.body.password, 8);
              // Example: Generate a random ID using uuid
              const randomId = uuidv4();
              let user = {
                id: randomId,
                image: "",
                userEmail: req.body.email,
                userName: req.body.username,
                passWord: pass,
              };
              res.status(200).json({
                error: false,
                message: createHMAC(random_otp),
                optional: user,
              });
            }
          });
        }
      }
    }

    // Register By OTP
    else if (req.body.type === "RegisterByOtp") {
      let existUser = await User.findOne({ userEmail: req.body.userEmail });

      if (existUser) {
        let result = await User.updateOne(
          { userEmail: req.body.userEmail },
          {
            $set: {
              passWord: req.body.passWord,
              userName: req.body.userName,
              image: "",
            },
          }
        );
        res.status(200).json({ error: false, message: "User Created" });
      } else {
        const newUser = new User({
          id: req.body.id,
          image: "",
          userEmail: req.body.userEmail,
          userName: req.body.userName,
          passWord: req.body.passWord,
          role:"visitor"
        });
        await newUser.save();

        res.status(200).json({ error: false, message: "User Created" });
      }
    } else {
      res.status(400).json({ error: true, message: "Required User's Details" });
    }
  } catch (e) {
    next(new Error(e));
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
          Hi,
        
          Your OTP is ${random_otp} to Change Password.
        
          Thanks By,
          Mani.R
          </pre>`,
        };
        sender.sendMail(composemail, async function (erroremail, info) {
          if (erroremail) {
            next(new Error(erroremail));
          } else {
            res
              .status(200)
              .json({ error: false, message: createHMAC(random_otp) });
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
    if (req.body.password) {
      //email validation
      if (!(req.body.password.length >= 4 && req.body.password.length <= 8)) {
        res.status(400).json({
          error: true,
          message: "Minimun 4 char and Max 8 char",
        });
      } else if (!passwordRegex.test(req.body.password)) {
        res.status(400).json({
          error: true,
          message: "Must have numeric and alpha character",
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
            .json({ error: false, message: "Changed Successfully" });
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
