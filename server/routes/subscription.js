const router = require("express").Router();
const authentication = require("../middleware/auth");
const Plan = require("../models/subscriptionPlanModels");
const nodeMailer_config = require("../config");
const { v4: uuidv4 } = require("uuid");
const createHMAC = require("../utility");
const User = require("../models/userModels");
const { sender } = nodeMailer_config;

// subscription activation
router.post("/activate", authentication, async (req, res, next) => {
  try {
    //   send OTP for activate
    if (req.body.type === "otp") {
      if (req.body.suscriptionPlan) {
        let random_otp = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        const composemail = {
          from: "mani8754209@gmail.com",
          to: `${req.token_decoded?.id}`,
          subject: "Subscription OTP",
          html: `<pre>
         Hi,
       
         Your OTP is ${random_otp} to Subscribe.
       
         Thanks By,
         Mani.R
         </pre>`,
        };

        sender.sendMail(composemail, async function (erroremail, info) {
          if (erroremail) {
            next(new Error(erroremail));
          } else {
            res.status(200).json({
              error: false,
              message: createHMAC(random_otp),
            });
          }
        });
      } else {
        res
          .status(400)
          .json({ error: true, message: "Require Subscription Plan" });
      }
    }
    // activate plan
    else {
      let currentDateTime = new Date().getTime() + 19800000 + 2592000000;
      let expireDate = new Date(currentDateTime);
      let expireDateMs = expireDate.getTime();
      let result = await User.updateOne(
        { userEmail: req.token_decoded?.id },
        {
          $set: {
            "dynamicFields.plan": {
              planName: req.body.planName,
              planId: req.body.planId,
              expireDate: [expireDate, expireDateMs],
            },
            planActivation: true,
          },
        }
      );
      if (result.acknowledged) {
        res
          .status(200)
          .json({ error: false, message: "Subscribed Successfully" });
      }
      
    }
  } catch (er) {
    next(new Error(er));
  }
});

// subscription plan creation
router.post("/create", authentication, async (req, res, next) => {
  try {
    if (
      req.body.planName &&
      req.body.amount &&
      req.body.details &&
      req.body.isActive
    ) {
      const randomId = uuidv4();
      const createPlan = new Plan({
        id: randomId,
        planName: req.body.planName,
        amount: +req.body.amount,
        details: req.body.details,
        isActive: req.body.isActive,
        duration: req.body.duration,
      });
      let result = await createPlan.save();

      if (result["_id"]) {
        res.status(200).json({ error: false, message: "Plan Created" });
      }
    } else {
      res
        .status(400)
        .json({ error: true, message: "Require Subscription Plan" });
    }
  } catch (er) {
    next(new Error(er));
  }
});

module.exports = router;
