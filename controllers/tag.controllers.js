const { Tag } = require('../models')

const TagController = {
  getTags: async (req, res) => {
    const tags = await Tag.cache('all').findAll()
    return res.status(200).json(tags)
  },
  createTag: async (req, res) => {
    const { name } = req.body
    const tag = await Tag.create({ name })
    return res.status(201).json(tag)
  }
}

module.exports = TagController
