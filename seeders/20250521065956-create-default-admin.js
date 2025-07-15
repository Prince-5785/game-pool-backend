'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Plain‐text password for your seeded admin
    const plainPassword = 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    await queryInterface.bulkInsert('admins', [
      {
        // id will auto-increment if your table is empty; omit to let the DB assign it
        role: 'admin',
        first_name: 'Jhon',
        last_name: 'Admin',
        email: 'admin@gmail.com',
        employee_key: 'EMP-0001',
        position: 'Administrator',
        password: passwordHash,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', {
      email: 'admin@gmail.com'
    }, {});
  }
};
