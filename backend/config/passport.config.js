const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const User = require("../models/user.model");

// getting port from .env file
const SECRET_KEY = process.env.SECRET_KEY;

// Create local strategy
exports.localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Invalid email" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// Set up options for JWT authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY, // Replace with your own secret key
};

// Create JWT strategy
exports.jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  const user = await User.findOne({ email: jwtPayload.email });
  
  if (user.password === jwtPayload.password) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});
