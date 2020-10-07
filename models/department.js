'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Department.hasMany(models.User, {
        as: 'members'
      });

      models.Department.hasOne(models.Skillpool, {
        as: 'skillpool'
      });
    }
  };
  Department.init({
    department_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Department',
  });
  return Department;
};