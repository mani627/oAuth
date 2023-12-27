
const mongoose_config= require("../config/index")
const{mongoose}=mongoose_config
// Create a User schema and model
const userSchema = new mongoose.Schema({
    id: String,
    image: String,
    userEmail: String,
    userName: String,
    passWord:String
  });
  
  //   create model
  const User = mongoose.model("oAuths", userSchema);

 module.exports= User