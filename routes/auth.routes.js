const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controllers')
const passport = require('../common/passport')
const authenticated = passport.authenticate('jwt', { session: false })

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', authController.logout)
router.get('/current_user', authenticated, authController.getCurrentUser)

module.exports = router
