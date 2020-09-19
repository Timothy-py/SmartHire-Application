'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Skillpools', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      skillpoolName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      // DepartmentId: {
      //   type: Sequelize.INTEGER,
      //   onDelete: 'CASCADE',
      //   references: {
      //     model: 'Department',
      //     key: 'id',
      //     as: 'department'
      //   }
      // },
      // CurrentBusinessId: {
      //   type: Sequelize.INTEGER,
      //   onDelete: 'CASCADE',
      //   references: {
      //     model: 'CurrentBusiness',
      //     key: 'id',
      //     as: 'currentbusiness'
      //   }
      // },
      // UserId: {
      //   type: Sequelize.INTEGER,
      //   onDelete: 'CASCADE',
      //   references: {
      //     model: 'User',
      //     key: 'id',
      //     as: 'manager'
      //   }
      // },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Skillpools');
  }
};