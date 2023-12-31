const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./models/userModels");
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

// fb
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID_FB,
      clientSecret: process.env.CLIENT_SECRET_FB,
      callbackURL: "/auth/fb/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ id: profile.id });
        if (existingUser) {
          return cb(null, profile);
        }

        // Create a new user and save it to the database
        const newUser = new User({
          id: profile.id,
          image: profile.photos[0]?.value,
          userEmail: profile?.emails?.[0]?.value,
          userName: profile.displayName,
          role:"visitor"
        });
        await newUser.save();
      } catch (er) {
        next(new Error(er));
      }

      cb(null, profile);
    }
  )
);

// git
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID_GIT,
      clientSecret: process.env.CLIENT_SECRET_GIT,
      callbackURL: "/auth/github/callback",
      scope: ["user:email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await User.findOne({
          userEmail: profile.emails[0]?.value,
        });
        if (existingUser) {
          await User.updateOne(
            { userEmail: profile.emails[0]?.value },
            {
              $set: {
                userName: profile.username,
                image: profile.photos[0]?.value,
              },
            }
          );
          return done(null, profile);
        } else {
          // Create a new user and save it to the database
          const newUser = new User({
            id: profile.id,
            image: profile.photos[0].value,
            userEmail: profile.emails[0].value,
            userName: profile.username,
            role:"visitor"
          });

          await newUser.save();
          return done(null, profile);
        }
      } catch (er) {
        next(new Error(er));
      }

      return done(null, profile);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({
          userEmail: profile.emails[0]?.value,
        });

        if (existingUser) {
          // update name image for email which is already logged by oAuth
          await User.updateOne(
            { userEmail: profile.emails[0]?.value },
            {
              $set: {
                userName: profile.displayName,
                image: profile.photos[0]?.value,
              },
            }
          );
          return callback(null, profile);
        }
        // save if dosenot exist
        else {
          // Create a new user and save it to the database
          const newUser = new User({
            id: profile.id,
            image: profile.photos[0]?.value,
            userEmail: profile.emails[0]?.value,
            userName: profile.displayName,
            role:"visitor"
          });
          await newUser.save();
          return callback(null, profile);
        }
      } catch (er) {
        next(new Error(er));
      }

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
