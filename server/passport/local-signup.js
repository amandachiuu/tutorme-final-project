const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'netid',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, netid, password, done) => {
  const userData = {
    netid: netid.trim(),
    password: password.trim(),
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim()
  };
  const newUser = new User(userData);
  newUser.save((err, user) => {
    if (err) { return done(err); }
    console.log("SAVE USER SIGN UP", user);
    return done(null);
  });
});
