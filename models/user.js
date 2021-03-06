'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsTo(models.Department, {
        allowNull: true,
        as: 'department', foreignKey: 'DepartmentId', onDelete: 'SET NULL', onUpdate: 'CASCADE'
      }); 

      models.User.belongsTo(models.CurrentBusiness, {
        allowNull: true, onDelete: 'SET NULL', onUpdate: 'CASCADE',
        as: 'currentbusiness', foreignKey: 'CurrentBusinessId'
      });

      models.User.belongsTo(models.Role, {
        allowNull: true, onDelete: 'SET NULL', onUpdate: 'CASCADE',
        as: 'role', foreignKey: 'RoleId'
      })

      models.User.hasMany(models.Skillpool, {
        as: 'skillpool'
      });

      models.User.belongsToMany(models.Skill, {
        as: 'skills', through: 'UserSkills', foreignKey: 'UserId'
      });

      models.User.hasMany(models.Goal, {
        as: 'goals'
      });

      models.User.hasMany(models.Userskillrank, {
        as: 'ranks'
      })
    }
  };
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 40] // must be between 3 to 40 characters
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: "active"
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};