// Azure Application Insights discover and rapidly diagnose performance and other issues.
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const config = require('./config')

if (config.nodeEnv === 'test') {
  require('./auth/mock')
} else {
  require('./auth/auth')
}

const app = express()

const { port = 8000 } = require('./config')
app.use(cors())
app.use(require('morgan')('dev'))
app.use(cookieParser('secret'))

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false
}))

app.use(function (req, res, next) {
  res.locals.user = req.session.passport
  next()
})

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

const routes = require('./routes')

app.use('/', routes)

const server = app.listen(port, '0.0.0.0')
console.info(`Running on http://localhost:${port}`)

module.exports = server
