const express = require('express')
const passport = require('passport')
const router = express.Router()
const { body } = require('express-validator');

const userController = require('../controllers/user.controller')

router.post('/login', passport.authenticate('login', { session: false }), userController.login)
router.post('/register', passport.authenticate('signup', { session: false }), [
  body('email').isEmail(),
  body('password').isLength({ min: 5 })
], userController.register)
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.profile)
router.get('/users', passport.authenticate('jwt', { session: false }), userController.users)
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), userController.delete_user)
router.put('/users/:id', passport.authenticate('jwt', { session: false }), userController.update_user)

module.exports = router
