'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'User', // name of source model
      'DepartmentId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Department',
          key: 'id',
          as: 'department'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    .then(()=>{
      'User', // name of source model
      'CurrentBusinessId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'CurrentBusiness',
          key: 'id',
          as: 'currentbusiness'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    })
    .then(()=>{
      'User', // name of source model
      'RoleId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Role',
          key: 'id',
          as: 'role'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'User', // name of source model
      'DepartmentId' // name of the key we're removing
    )
    .then(()=>{
      'User', // name of source model
      'CurrentBusinessId' // name of the key we're removing
    })
    .then(()=>{
      'User', // name of source model
      'DepartmentId' // name of the key we're removing
    })
  }
};
