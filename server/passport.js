const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User= require("./models/userModels")



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return  callback(null, profile);
      }

      // Create a new user and save it to the database
      const newUser = new User({
        googleId: profile.id,
        image:  profile.photos[0]?.value,
        userEmail: profile.emails[0]?.value,
        userName:profile.displayName,
      });
	  await newUser.save();
     return callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
