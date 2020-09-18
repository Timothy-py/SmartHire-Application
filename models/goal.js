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
      models.Goal.belongsTo(models.User, {
        as: 'user', foreignKey: 'UserId', onDelete: 'CASCADE'
      });

      models.Goal.hasMany(models.Goaldetail, {
        as: 'goaldetail'
      });
    }
  };
  Goal.init({
    goalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Goal',
  });
  return Goal;
};