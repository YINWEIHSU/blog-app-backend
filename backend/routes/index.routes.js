const authRouter = require('./auth.routes')
const userRouter = require('./user.routes')
const postRouter = require('./post.routes')
const tagRouter = require('./tag.routes')
const categoryRouter = require('./category.routes')

module.exports = function (app) {
  app.use('/api/auth', authRouter)
  app.use('/api/users', userRouter)
  app.use('/api/posts', postRouter)
  app.use('/api/tags', tagRouter)
  app.use('/api/categories', categoryRouter)
}
