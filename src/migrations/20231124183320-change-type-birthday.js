'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Profiles', 'dateOfBirth');
    await queryInterface.addColumn('Profiles', 'dateOfBirth', {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('Profiles', 'dateOfBirth');
    queryInterface.addColumn('Profiles', 'dateOfBirth', {
      type: Sequelize.DATEONLY,
    });
  },
};
