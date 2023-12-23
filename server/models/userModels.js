
const mongoose= require("../config/index")

// Create a User schema and model
const userSchema = new mongoose.Schema({
    googleId: String,
    image: String,
    userEmail: String,
    userName: String,
  });
  
  //   create model
  const User = mongoose.model("oAuths", userSchema);

 module.exports= User