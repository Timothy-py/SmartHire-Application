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
      'Users', // name of source model
      'DepartmentId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Departments',
          key: 'id',
          as: 'department'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    .then(async()=>{
      await queryInterface.addColumn(
      'Users', // name of source model
      'CurrentBusinessId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'CurrentBusinesses',
          key: 'id',
          as: 'currentbusiness'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
      )
    })
    .then(async()=>{
      await queryInterface.addColumn(
      'Users', // name of source model
      'RoleId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Roles',
          key: 'id',
          as: 'role'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
      )
    })
    .then(async()=>{
      await queryInterface.addColumn(
      'Skillpools', // name of source model
      'DepartmentId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Departments',
          key: 'id',
          as: 'department'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
      )
    })
    .then(async()=>{
      await queryInterface.addColumn(
        'Skillpools', // name of source model
        'CurrentBusinessId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'CurrentBusinesses',
            key: 'id',
            as: 'currentbusiness'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      )
    })
    .then(async()=>{
      await queryInterface.addColumn(
        'Skillpools', // name of source model
        'UserId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
            as: 'manager'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      )
    })
    .then(async()=>{
      await queryInterface.addColumn(
        'Goals', // name of source model
        'UserId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
            as: 'user'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      )
    })
    .then(async()=>{
      await queryInterface.addColumn(
        'Goaldetails', // name of source model
        'GoalId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Goals',
            key: 'id',
            as: 'goal'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      )
    })
    .then(async()=>{
      await queryInterface.addColumn(
        'Skills', // name of source model
        'SkillpoolId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Skillpools',
            key: 'id',
            as: 'skillpool'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      )
    })
    .then(async()=>{
      await queryInterface.addColumn(
        'Userskillranks', // name of source model
        'UserId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
            as: 'user'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      )
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
      'Users', // name of source model
      'DepartmentId' // name of the key we're removing
    )
    .then(async()=>{
      await queryInterface.removeColumn(
        'Users', // name of source model
        'CurrentBusinessId' // name of the key we're removing
      )
    })
    .then(async()=>{
      await queryInterface.removeColumn(
        'Users', // name of source model
        'DepartmentId' // name of the key we're removing
      )
    })
    .then(async()=>{
      await queryInterface.removeColumn(
        'Skillpools', // name of source model
        'DepartmentId' // name of the key we're removing
      )
    })
    .then(async()=>{
      await queryInterface.removeColumn(
        'Skillpools', // name of source model
        'CurrentBusinessId' // name of the key we're removing
      )
    })
    .then(async()=>{
      await queryInterface.removeColumn(
        'Skillpools', // name of source model
        'UserId' // name of the key we're removing
      )
    })
    .then(async()=>{
      await queryInterface.removeColumn(
        'Goals', // name of source model
        'UserId' // name of the key we're removing
      )
    })
    .then(async()=>{
      await queryInterface.removeColumn(
      'Goaldetails', // name of source model
      'GoalId' // name of the key we're removing
      )
    })
    .then(async()=>{
      await queryInterface.removeColumn(
        'Skills', // name of source model
        'SkillpoolId' // name of the key we're removing
      )
    })
    .then(async()=>{
      await queryInterface.removeColumn(
        'Userskillranks', // name of source model
        'UserId' // name of the key we're removing
      )
    })
  }
};
