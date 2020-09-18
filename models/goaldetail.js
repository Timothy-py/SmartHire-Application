'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Goaldetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Goaldetail.belongsTo(models.Goal, {
        as: 'goal', foreignKey: 'GoalId', onDelete: 'CASCADE'
      });
    }
  };
  Goaldetail.init({
    detail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('done', 'undone'),
      defaultValue: 'undone'
    }
  }, {
    sequelize,
    modelName: 'Goaldetail',
  });
  return Goaldetail;
};