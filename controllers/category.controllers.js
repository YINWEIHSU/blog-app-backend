const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.cache('all').findAll()
    return res.status(200).json(categories)
  },
  createCategory: async (req, res) => {
    const { name } = req.body
    const categoryExists = await Category.cache(name).findOne({ where: { name } })
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' })
    }
    const category = await Category.create({ name })
    await Category.clearCache('all')
    return res.status(201).json(category)
  },
  updateCategory: async (req, res) => {
    const { name } = req.body
    const category = await Category.findByPk(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    await Category.clearCache(name)
    await category.update({ name })
    return res.status(200).json(category)
  },
  deleteCategory: async (req, res) => {
    const category = await Category.findByPk(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    await Category.clearCache(category.name)
    await category.destroy()
    return res.status(204).json({ message: 'Category deleted' })
  }
}

module.exports = categoryController
