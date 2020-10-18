'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Skill.belongsTo(models.Skillpool, {
        as: 'skillpool', foreignKey: 'SkillpoolId', onDelete: 'CASCADE'
      });

      models.Skill.belongsToMany(models.User, {
        as: 'users', through: 'UserSkills', foreignKey: 'SkillId'
      });
    }
  };
  Skill.init({
    skillName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dept_rank: {
      type: DataTypes.ENUM('1','2','3','4','5','6','7','8','9','10'),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Skill',
  });
  return Skill;
};