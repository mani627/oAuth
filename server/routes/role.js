const router = require("express").Router();
const authentication= require("../middleware/auth");
const User = require("../models/userModels");

// success
router.post("/roleChange", authentication,async(req, res,next) => {
  try {

    if(req.body.email){
      if(req.token_decoded?.id){
        let existUser = await User.findOne({ userEmail: req.token_decoded.id });
        // admin check
        if(!existUser){
          res.status(400).json({ error: true, message: "User not Exist" });
        }else if(existUser.role!=="admin"){
          res.status(200).json({ error: false, message: "EmailId not Admin" });
        }else{
          // user check
          let existUser = await User.findOne({ userEmail: req.body.email });
          if(!existUser){
            res.status(400).json({ error: true, message: "User not Exist" });
          }else if(existUser.role===req.body.roleChangeBy){
            res.status(200).json({ error: false, message: "Already Role Exist" });
          }
          // role changeBy
          else{
          let result=  await User.updateOne(
              { userEmail: req.body.email },
              {
                $set: {
                  role: req.body.roleChangeBy,
                },
              }
            );
            if(result.modifiedCount){
              res.status(200).json({ error: false, message: result });
            }
           
          }
        }
      }
    }
    else{
      res.status(400).json({ error: true, message: "Require EmailId" });
    }
  
  } catch (er) {
    next(new Error(er));
  }
});


module.exports = router;