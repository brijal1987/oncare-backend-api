const passport = require('passport')
const MockStrategy = require('passport-mock-strategy')

passport.use(new MockStrategy({
  name: 'my-mock',
  user: { email: 'john@example.com' }
}, (user, done) => {
  // Perform actions on user, call done once finished
}))
