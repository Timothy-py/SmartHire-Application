'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Userskillrank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Userskillrank.belongsTo(models.User, {
        as: 'user', foreignKey: 'UserId'
      });
    }
  };
  Userskillrank.init({
    DepartmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    user_rank: {
      type: DataTypes.ENUM('1','2','3','4','5','6','7','8','9','10'),
      allowNull: true
    },
    skillName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Userskillrank',
  });
  return Userskillrank;
};