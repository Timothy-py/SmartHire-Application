'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      skillName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dept_rank: {
        type: Sequelize.ENUM('1','2','3','4','5','6','7','8','9','10'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      // SkillpoolId: {
      //   type: Sequelize.INTEGER,
      //   onDelete: 'CASCADE',
      //   references: {
      //     model: 'Skillpool',
      //     key: 'id',
      //     as: 'skillpool'
      //   }
      // },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Skills');
  }
};