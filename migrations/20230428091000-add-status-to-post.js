'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'draft'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'status')
  }
}
