require('dotenv').config()
const config = {
  passportStrategy: process.env.PASSPORT_STRATEGY,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT
}

module.exports = config
