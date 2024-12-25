import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js'

dotenv.config();



passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT || 4000}/auth/google/callback`,
  },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("Google profil:", profile);
      // console.log("AccessToken:", accessToken);
      // console.log("RefreshToken:", refreshToken);

      try {
        let user = await User.findOne({ googleId: profile.id })
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName
          });
        }
        return done(null, user);

      } catch (error) {
        return done(error, null);
      }

    }
  )
);

// Derialize user into the session
passport.serializeUser((user, done) => done(null, user._id));

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;