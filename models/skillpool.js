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
        onDelete: 'CASCADE', as: 'department', foreignKey: 'DepartmentId'
      });

      models.Skillpool.belongsTo(models.CurrentBusiness, {
        onDelete: 'CASCADE', as: 'currentbusiness', foreignKey: 'CurrentBusinessId'
      });

      models.Skillpool.belongsTo(models.User, {
        as: 'manager', foreignKey: 'UserId', onDelete: 'CASCADE'
      });

      models.Skillpool.hasMany(models.Skill, {
        as: 'skills'
      });
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