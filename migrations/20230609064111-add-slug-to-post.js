'use strict'
const { generateSlug } = require('../common/utils')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'default-slug'
    })

    const [posts, metadata] = await queryInterface.sequelize.query('SELECT id, title FROM Posts')
    for (const post of posts) {
      const slug = generateSlug(post.title, post.id)
      await queryInterface.sequelize.query(`UPDATE Posts SET slug='${slug}' WHERE id=${post.id}`)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'slug')
  }
}
