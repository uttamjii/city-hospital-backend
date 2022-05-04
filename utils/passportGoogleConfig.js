// Config file
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config/config.env" });
}

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../models/UserModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLLBACK_URL,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const name = profile.displayName;
      const email = profile.emails[0].value;
      const avatar = {
        public_id: undefined,
        url: profile.photos[0].value,
      };
      const googleAuth = true;
      const password =
        profile.emails[0].value + profile.id + profile.emails[0].value;
      const googleId = profile.id;

      const user = await UserModel.findOne({ email });

      if (profile) {
        if (user) {
          const token = user.generateAuthToken();
          return done(null, { token, user });
        } else {
          const newUser = await UserModel.create(
            {
              name,
              email,
              avatar,
              googleAuth,
              password,
              googleId,
            },
            {
              new: true,
            }
          );
          const token = newUser.generateAuthToken();
          return done(null, { token, newUser });
        }
      } else {
        return done(null, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
