const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controllers')
const passport = require('../common/passport')
const authenticated = passport.authenticate('jwt', { session: false })

router.get('/:id', userController.getUser)
router.put('/update/:id', authenticated, userController.updateUser)

module.exports = router
