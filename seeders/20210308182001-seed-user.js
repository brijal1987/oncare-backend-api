'use strict';
const passwordHash = require('password-hash')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = passwordHash.generate('123456')
    return queryInterface.bulkInsert('Users', [{
      first_name: 'Brijal',
      last_name: 'Savaliya',
      password: hash,
      hash,
      email: 'brijal.savaliya@gmail.com'
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
