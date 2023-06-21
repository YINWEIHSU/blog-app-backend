'use strict'

const { PostTag, Tag } = require('../models') // 导入你的模型

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 添加count列
    await queryInterface.addColumn('Tags', 'count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    })

    // 获取所有标签
    const tags = await Tag.findAll()

    // 对每个标签计算PostTag数量并更新count值
    for (const tag of tags) {
      const count = await PostTag.count({ where: { tagId: tag.id } })
      tag.count = count
      if (count <= 0) {
        await tag.destroy()
      } else {
        await tag.save()
      }
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tags', 'count')
  }
}
