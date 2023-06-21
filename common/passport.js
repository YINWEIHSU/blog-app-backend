const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const passport = require('passport')
const db = require('../models')
const User = db.User

const jwtOptions = {}
const cookieExtractor = function (req) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.access_token
  }
  return token
}
jwtOptions.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor])
jwtOptions.secretOrKey = process.env.JWT_SECRET

const strategy = new JwtStrategy(jwtOptions, async function (jwtPayload, next) {
  const user = await User.cache(jwtPayload.id).findOne({ where: { id: jwtPayload.id } })
  if (!user) { return next(null, false) }
  return next(null, user)
})
passport.use(strategy)
module.exports = passport
