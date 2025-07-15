const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const SamlStrategy = require("passport-saml").Strategy;
const OpenIDConnectStrategy = require("passport-openidconnect").Strategy;
const { OIDCStrategy: AzureOIDCStrategy } = require("passport-azure-ad");
const config = require("./config");
const { Admin } = require("../models");
const { tokenTypes } = require("./attributes");

// ---------------------
// Email & Password Strategy
// ---------------------
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = async (payload, done) => {
  console.log("🚀 ~ jwtVerify ~ payload:", payload)
  
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    const identity = await Admin.findByPk(payload.id);
    if (!identity) {
      return done(null, false);
    }
    done(null, identity);
  } catch (error) {
    done(error, false);
  }
};
passport.use("custom", new JwtStrategy(jwtOptions, jwtVerify));



module.exports = passport;
