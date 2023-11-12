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
    return Promise.all([
      queryInterface.addColumn('Profiles', 'country', {
        type: Sequelize.STRING,
        // allowNull: true,
      }),
      queryInterface.addColumn('Profiles', 'province', {
        type: Sequelize.STRING,
        // allowNull: true,
      }),
      queryInterface.addColumn('Profiles', 'district', {
        type: Sequelize.STRING,
        // allowNull: true,
      }),
      queryInterface.addColumn('Profiles', 'ward', {
        type: Sequelize.STRING,
        // allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('Profiles', 'country'),
      queryInterface.removeColumn('Profiles', 'province'),
      queryInterface.removeColumn('Profiles', 'district'),
      queryInterface.removeColumn('Profiles', 'ward'),
    ]);
  },
};
