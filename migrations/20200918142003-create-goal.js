'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Goals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      goalName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      target_date: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Goals');
  }
};