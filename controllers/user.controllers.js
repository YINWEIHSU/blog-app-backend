const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  getUser: async (req, res) => {
    const { id } = req.params
    const user = await User.cache(id).findOne({ where: { id } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
  },
  updateUser: async (req, res) => {
    const { id } = req.params
    const currentUserId = req.user.id
    if (Number(id) !== currentUserId) {
      return res.status(403).json({ message: 'You are not authorized to do this' })
    }
    const { name, newPassword, checkPassword } = req.body
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const updateData = { name }
    if (newPassword !== checkPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    } else if (newPassword) {
      updateData.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10), null)
    }
    await user.update(updateData)
    await User.clearCache(id)
    return res.status(200).json(user)
  }
}

module.exports = userController
