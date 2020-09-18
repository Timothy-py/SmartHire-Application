'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Goal.init({
    goalName: DataTypes.STRING,
    target_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Goal',
  });
  return Goal;
};