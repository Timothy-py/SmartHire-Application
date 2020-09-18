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
    }
  };
  Userskillrank.init({
    DepartmentId: DataTypes.INTEGER,
    user_rank: DataTypes.ENUM,
    skillName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Userskillrank',
  });
  return Userskillrank;
};