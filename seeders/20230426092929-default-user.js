'use strict'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'root',
  email: process.env.ROOT_EMAIL,
  password: '12345678'
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if user exists
    const user = await queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE email = '${SEED_USER.email}'`,
      { type: Sequelize.QueryTypes.SELECT }
    )

    if (!user.length) {
    const userId = await queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  }
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
