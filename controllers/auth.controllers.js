const { User } = require('../models')
const bcrypt = require('bcryptjs')
// JWT
const jwt = require('jsonwebtoken')

const authController = {
  register: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }
    const user = await User.findOne({ where: { email } })
    if (user) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
    return res.status(201).json({ message: 'User created' })
  },
  login: async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'No such user found' })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Password is incorrect' })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1day' })
    return res.cookie('access_token', token, { httpOnly: true }).json({ message: 'ok', user: { id: user.id, name: user.name, email: user.email } })
  },
  logout: (req, res) => {
    return res.clearCookie('access_token').status(200).json({ message: 'User has been logged out' })
  },
  getCurrentUser: (req, res) => {
    const { id, name, email } = req.user
    return res.status(200).json({ id, name, email })
  }
}

module.exports = authController
