import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();



passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT || 4000}/auth/google/callback`,
  },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google profil:", profile);
      console.log("AccessToken:", accessToken);
      console.log("RefreshToken:", refreshToken);

      done(null, profile);
    }
  )
);

// Derialize user into the session
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the session
passport.deserializeUser((user, done) => done(null, user));

export default passport;