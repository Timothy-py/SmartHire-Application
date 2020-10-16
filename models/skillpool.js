'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skillpool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Skillpool.belongsTo(models.Department, {
        as: 'department', foreignKey: 'DepartmentId', onDelete: 'CASCADE'
      });

      models.Skillpool.belongsTo(models.CurrentBusiness, {
          onDelete: 'CASCADE', as: 'currentbusiness', foreignKey: 'CurrentBusinessId'
      });

      models.Skillpool.belongsTo(models.User, {
          as: 'manager', foreignKey: 'UserId', onDelete: 'SET NULL'
      });

      models.Skillpool.hasMany(models.Skill, {
          as: 'skills'
      })
    }
  };
  Skillpool.init({
    skillpoolName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Skillpool',
  });
  return Skillpool;
};