const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
import PassportController from "./PassportController";

passport.use(new LocalStrategy(PassportController.localStrategy));

passport.serializeUser(PassportController.serializeUser);

passport.deserializeUser(PassportController.deserializeUser);

export default passport;
