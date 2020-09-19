'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Userskillranks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DepartmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: true
        }
      },
      user_rank: {
        type: Sequelize.ENUM('1','2','3','4','5','6','7','8','9','10'),
        allowNull: true
      },
      skillName: {
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
      // UserId: {
      //   type: Sequelize.INTEGER,
      //   onDelete: 'CASCADE',
      //   references: {
      //     model: 'User',
      //     key: 'id',
      //     as: 'user'
      //   }
      // },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Userskillranks');
  }
};