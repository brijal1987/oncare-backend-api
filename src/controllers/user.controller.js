const passport = require('passport')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const db = require('../../models')
const passwordHash = require('password-hash')

const validatePassword = (password, hash) => {
  return passwordHash.verify(password, hash)
}

const getUserByEmail = async (email) => {
  return await db.User.findOne({ where: { email } })
}
const getUserByID = async (id) => {
  return await db.User.findOne({ where: { id } })
}

exports.login = async (req, res, next) => {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        const { email, password } = req.body
        if (err || !user) {
          const error = new Error('An error occurred.')
          return next(error)
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
        }

        const userInfo = await getUserByEmail(email)

        if (!userInfo) {
          return res.json({
            message: `User (${email}) not found`,
            error: 1
          })
        }

        const validate = validatePassword(password, userInfo.hash)

        if (!validate) {
          return res.json({
            message: 'Wrong Password',
            error: 1
          })
        }
        req.login(
          userInfo,
          { session: false },
          async (error) => {
            if (error) return next(error)

            const body = { id: userInfo.id, email: userInfo.email }
            const token = jwt.sign({ user: body }, 'TOP_SECRET')

            return res.json({ token, user: { firstname: userInfo.first_name, lastname: userInfo.last_name, email: userInfo.email } })
          }
        )
      } catch (error) {
        return next(error)
      }
    }
  )(req, res, next)
}

exports.logout = (req, res) => {
  req.logout()
  res.json({
    success: 1,
    message: 'Logout'
  })
}

exports.register = async (req, res, next) => {
  passport.authenticate(
    'signup',
    async (err) => {
      try {
        const { first_name, last_name, email, password } = req.body
        if (err) {
          return next(err)
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
        }

        const userExist = await getUserByEmail(email)
        if (userExist) {
          return res.json({
            message: `User (${email}) already found`,
            error: 1
          })
        }
        const hash = passwordHash.generate(password)

        const user = await db.User.create({ first_name, last_name, email, password: hash, hash })
        res.json({
          message: 'Signup successful',
          user
        })
      } catch (error) {
        return next(error)
      }
    }
  )(req, res, next)
}

exports.profile = async (req, res, next) => {
  const { email } = req.user
  const user = await getUserByEmail(email)

  if (!user) {
    return res.json({
      message: `User (${email}) not found`,
      error: 1
    })
  }
  res.json({
    user: user,
    token: req.query.secret_token
  })
}

exports.users = async (req, res, next) => {
  const users = await db.User.findAll({attributes: ['id', 'first_name', 'last_name', 'email']})
  res.json({
    users
  })
}

exports.get_user = async (req, res, next) => {
  const id = parseInt(req.params.id)
  const user = await getUserByID(id)

  if (!user) {
    return res.json({
      message: `User (${id}) not found`,
      error: 1
    })
  }

  res.json({
    user
  })
}

exports.update_user = async (req, res, next) => {
  const id = parseInt(req.params.id)
  const user = await getUserByID(id)

  if (!user) {
    return res.json({
      message: `User (${id}) not found`,
      error: 1
    })
  }
  const { first_name, last_name, email, password } = req.body
  let userData = {
    first_name, last_name, email
  }
  if(password) {
    const hash = passwordHash.generate(password)
    userData.password = hash
    userData.hash = hash
  }

  await user.update(userData)
  res.json({
    messge: `User (${id}) updated successfully`,
    id
  })
}

exports.delete_user = async (req, res, next) => {
  const id = parseInt(req.params.id)
  const user = await getUserByID(id)

  if (!user) {
    return res.json({
      message: `User (${id}) not found`,
      error: 1
    })
  }
  user.destroy()
  res.json({
    messge: `User (${id}) deleted successfully`,
    id
  })
}
