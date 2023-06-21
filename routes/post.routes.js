const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controllers')
const passport = require('../common/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) { return next(err) }
    if (user) { req.user = user }
    return next()
  })(req, res, next)
}

router.get('/', optionalAuth, postController.getPosts)
router.get('/:slug', optionalAuth, postController.getPost)
router.post('/', authenticated, postController.createPost)
router.put('/:slug', authenticated, postController.updatePost)
router.delete('/:slug', authenticated, postController.deletePost)

module.exports = router
