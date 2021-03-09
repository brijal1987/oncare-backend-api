const router = require('express').Router()
const auth = require('./auth.route')

// Export all routes
router.get('/heartbeat', (req, res) => {
  res.json({
    status: 'online'
  })
})

router.use('/', auth)

module.exports = router
